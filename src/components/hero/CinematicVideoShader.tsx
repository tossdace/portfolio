"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CinematicVideoShaderProps {
  video: HTMLVideoElement | null;
  enabled: boolean;
  onActiveChange: (active: boolean) => void;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uVideo;
  uniform vec2 uVideoSize;
  uniform vec2 uViewportSize;
  uniform vec2 uObjectPosition;
  uniform float uMobileQuality;

  varying vec2 vUv;

  vec3 videoAt(vec2 uv) {
    return sRGBTransferEOTF(texture2D(uVideo, uv)).rgb;
  }

  vec3 brightPart(vec3 color) {
    float peak = max(max(color.r, color.g), color.b);
    return color * smoothstep(0.72, 1.0, peak);
  }

  void main() {
    float sourceAspect = uVideoSize.x / max(uVideoSize.y, 1.0);
    float viewAspect = uViewportSize.x / max(uViewportSize.y, 1.0);
    vec2 visible = vec2(1.0);

    if (sourceAspect > viewAspect) {
      visible.x = viewAspect / sourceAspect;
    } else {
      visible.y = sourceAspect / viewAspect;
    }

    vec2 cropStart = (vec2(1.0) - visible) * uObjectPosition;
    vec2 sourceUv = cropStart + vUv * visible;
    vec2 sourceStep = visible / uViewportSize;
    vec3 original = videoAt(sourceUv);

    vec2 sampleStep = sourceStep * mix(1.8, 1.4, uMobileQuality);
    vec3 east = videoAt(sourceUv + vec2(sampleStep.x, 0.0));
    vec3 west = videoAt(sourceUv - vec2(sampleStep.x, 0.0));
    vec3 nearby;
    vec3 bloom;

    if (uMobileQuality > 0.9) {
      nearby = (east + west) * 0.5;
      bloom = (brightPart(east) + brightPart(west)) * 0.5;
    } else {
      vec3 north = videoAt(sourceUv + vec2(0.0, sampleStep.y));
      vec3 south = videoAt(sourceUv - vec2(0.0, sampleStep.y));
      nearby = (east + west + north + south) * 0.25;
      bloom = (brightPart(east) + brightPart(west) + brightPart(north) + brightPart(south)) * 0.25;
    }

    float sharpen = mix(0.07, 0.045, uMobileQuality);
    vec3 color = original + (original - nearby) * sharpen;
    float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    float shadow = 1.0 - smoothstep(0.035, 0.58, luminance);
    float highlight = smoothstep(0.66, 0.98, luminance);

    color = (color - 0.5) * 1.045 + 0.5;
    float gradedLuminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(vec3(gradedLuminance), color, 1.035);
    color += vec3(0.002, 0.001, 0.008) * shadow;
    color += vec3(0.012, 0.006, -0.002) * highlight;
    color += bloom * mix(0.085, 0.055, uMobileQuality);

    float haze = shadow * smoothstep(0.08, 0.72, vUv.y);
    color += vec3(0.006, 0.003, 0.009) * haze;

    float edge = distance(vUv, vec2(0.5));
    float vignette = 1.0 - smoothstep(0.43, 0.78, edge) * 0.18;
    color *= vignette;

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
    #include <colorspace_fragment>
  }
`;

function objectPositionPercent(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  if (value === "center") return 0.5;
  if (value === "left" || value === "top") return 0;
  if (value === "right" || value === "bottom") return 1;
  const percentage = Number.parseFloat(value);
  return Number.isFinite(percentage) ? THREE.MathUtils.clamp(percentage / 100, 0, 1) : fallback;
}

function getObjectPosition(video: HTMLVideoElement) {
  const [x, y] = getComputedStyle(video).objectPosition.trim().split(/\s+/);
  return new THREE.Vector2(objectPositionPercent(x, 0.5), objectPositionPercent(y, 0.5));
}

export default function CinematicVideoShader({
  video,
  enabled,
  onActiveChange,
}: CinematicVideoShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "active" | "fallback">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !video || !canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let texture: THREE.VideoTexture | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let videoFrameCallback = 0;
    let fallbackTimer: number | null = null;
    let visible = false;
    let stopped = false;
    let disposed = false;
    let failed = false;
    let shaderActive = false;
    let adaptiveScale = 1;
    let resizeRenderer: () => void = () => {};
    let renderTimes: number[] = [];
    let frameIntervals: number[] = [];
    let lastFrameTime = 0;
    let lastSuspendedPlayback = false;
    let slowRenderWindows = 0;
    let slowVideoWindows = 0;

    const safeDispose = (dispose: (() => void) | null) => {
      try {
        dispose?.();
      } catch {
        // Continue releasing the remaining resources if one dispose call fails.
      }
    };

    const setActive = (active: boolean) => {
      shaderActive = active;
      setStatus(active ? "active" : "fallback");
      onActiveChange(active);
    };

    const stopFrames = () => {
      if (videoFrameCallback && "cancelVideoFrameCallback" in video) {
        safeDispose(() => video.cancelVideoFrameCallback(videoFrameCallback));
        videoFrameCallback = 0;
      }
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      lastFrameTime = 0;
      frameIntervals = [];
      renderTimes = [];
      slowRenderWindows = 0;
      slowVideoWindows = 0;
    };

    const onPlaying = () => scheduleFrame();
    const onVisibilityChange = () => {
      if (document.hidden || !visible) suspendPlayback();
      else resumePlayback();
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      fallback("WebGL context was lost");
    };
    const onVideoError = () => fallback("video source failed");

    const teardown = (resumeFallbackVideo = false) => {
      if (disposed) return;
      disposed = true;
      stopped = true;
      stopFrames();
      safeDispose(() => resizeObserver?.disconnect());
      safeDispose(() => intersectionObserver?.disconnect());
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onVideoError);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      safeDispose(() => texture?.dispose());
      safeDispose(() => material?.dispose());
      safeDispose(() => geometry?.dispose());
      safeDispose(() => renderer?.dispose());
      texture = null;
      material = null;
      geometry = null;
      renderer = null;
      if (resumeFallbackVideo && lastSuspendedPlayback) {
        lastSuspendedPlayback = false;
        void video.play().catch(() => undefined);
      }
    };

    const suspendPlayback = () => {
      if (!video.paused) {
        lastSuspendedPlayback = true;
        video.pause();
      }
      stopFrames();
    };

    const resumePlayback = () => {
      if (lastSuspendedPlayback) {
        lastSuspendedPlayback = false;
        void video.play().catch(() => undefined);
      }
      scheduleFrame();
    };

    const fallback = (reason: string) => {
      if (failed) return;
      failed = true;
      teardown(true);
      canvas.dataset.shaderState = "fallback";
      setActive(false);
      console.warn(`Floating island shader fallback: ${reason}`);
    };

    const reduceShaderResolution = (reason: string) => {
      if (failed) return;
      if (adaptiveScale > 0.75 && renderer) {
        adaptiveScale = 0.75;
        resizeRenderer();
        frameIntervals = [];
        renderTimes = [];
        slowRenderWindows = 0;
        lastFrameTime = 0;
        canvas.dataset.shaderQuality = "reduced";
        console.info(`Floating island shader reduced render resolution after sustained slowdown: ${reason}`);
        return;
      }
      fallback(reason);
    };

    const canRender = () =>
      !stopped && !failed && visible && !document.hidden && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !video.paused;

    const renderFrame = () => {
      if (!canRender() || !renderer || !material || !texture) return;
      const startedAt = performance.now();
      try {
        renderer.render(scene, camera);
      } catch {
        fallback("render failed");
        return;
      }
      if (failed) return;
      const renderTime = performance.now() - startedAt;
      renderTimes.push(renderTime);
      if (renderTimes.length === 12) {
        const averageRenderTime = renderTimes.reduce((sum, frame) => sum + frame, 0) / renderTimes.length;
        renderTimes = [];
        if (averageRenderTime > 33) {
          slowRenderWindows += 1;
        } else slowRenderWindows = 0;
        if (slowRenderWindows >= 3) {
          reduceShaderResolution(`CPU render-submission heuristic averaged ${averageRenderTime.toFixed(1)} ms over sustained windows`);
          if (failed) return;
          slowRenderWindows = 0;
        }
      }

      if (!shaderActive) setActive(true);
      canvas.dataset.shaderState = "active";
    };

    const scheduleFrame = () => {
      if (!canRender() || videoFrameCallback || fallbackTimer !== null) return;

      if ("requestVideoFrameCallback" in video) {
        videoFrameCallback = video.requestVideoFrameCallback((now) => {
          videoFrameCallback = 0;
          if (!canRender()) return;

          if (lastFrameTime > 0) {
            const frameInterval = now - lastFrameTime;
            if (frameInterval < 250) frameIntervals.push(frameInterval);
            else {
              frameIntervals = [];
              slowVideoWindows = 0;
            }
          }
          lastFrameTime = now;
          if (frameIntervals.length === 12) {
            const averageFrameTime = frameIntervals.reduce((sum, interval) => sum + interval, 0) / frameIntervals.length;
            frameIntervals = [];
            if (averageFrameTime > 50) {
              slowVideoWindows += 1;
            } else slowVideoWindows = 0;
            if (slowVideoWindows >= 3) {
              reduceShaderResolution(`video-frame-delivery heuristic averaged ${averageFrameTime.toFixed(1)} ms over sustained windows`);
              if (failed) return;
              slowVideoWindows = 0;
            }
          }
          if (failed) {
            return;
          }

          renderFrame();
          scheduleFrame();
        });
      } else {
        fallbackTimer = window.setTimeout(() => {
          fallbackTimer = null;
          if (!canRender()) return;
          renderFrame();
          scheduleFrame();
        }, 1000 / 24);
      }
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: "low-power",
        premultipliedAlpha: false,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor("#09070b", 1);
      renderer.debug.checkShaderErrors = true;
      renderer.debug.onShaderError = (gl, program, vertex, fragment) => {
        const details = [
          gl.getProgramInfoLog(program),
          gl.getShaderInfoLog(vertex),
          gl.getShaderInfoLog(fragment),
        ].filter(Boolean).join(" | ");
        fallback(details ? `shader compilation failed: ${details}` : "shader compilation failed");
      };

      texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      const mobile = window.matchMedia("(max-width: 760px)").matches;
      material = new THREE.ShaderMaterial({
        uniforms: {
          uVideo: { value: texture },
          uVideoSize: { value: new THREE.Vector2(video.videoWidth || 1920, video.videoHeight || 1080) },
          uViewportSize: { value: new THREE.Vector2(1, 1) },
          uObjectPosition: { value: getObjectPosition(video) },
          uMobileQuality: { value: mobile ? 1 : 0 },
        },
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      });
      geometry = new THREE.PlaneGeometry(2, 2);
      scene.add(new THREE.Mesh(geometry, material));

      resizeRenderer = () => {
        if (!renderer || !material) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const isMobile = window.matchMedia("(max-width: 760px)").matches;
        const sourceResolutionScale = Math.min(
          (video.videoWidth || 1920) / Math.max(width, 1),
          (video.videoHeight || 1080) / Math.max(height, 1),
        );
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25, sourceResolutionScale) * adaptiveScale;
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(Math.max(1, width), Math.max(1, height), false);
        material.uniforms.uVideoSize.value.set(video.videoWidth || 1920, video.videoHeight || 1080);
        material.uniforms.uObjectPosition.value.copy(getObjectPosition(video));
        material.uniforms.uMobileQuality.value = isMobile ? 1 : 0;
        renderer.getDrawingBufferSize(material.uniforms.uViewportSize.value);
        canvas.dataset.shaderQuality = adaptiveScale < 1 ? "reduced" : "source";
      };

      resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(canvas);
      resizeRenderer();

      intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio > 0;
        if (visible && !document.hidden) resumePlayback();
        else suspendPlayback();
      });
      intersectionObserver.observe(canvas);

      video.addEventListener("playing", onPlaying);
      video.addEventListener("error", onVideoError);
      document.addEventListener("visibilitychange", onVisibilityChange);
      canvas.addEventListener("webglcontextlost", onContextLost, false);
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) scheduleFrame();

      canvas.dataset.shaderState = "loading";

      return () => {
        teardown();
        onActiveChange(false);
      };
    } catch {
      fallback("WebGL is unavailable");
    }
  }, [enabled, onActiveChange, video]);

  if (!enabled || !video) return null;

  return (
    <canvas
      ref={canvasRef}
      className="dhyan-scene-shader"
      aria-hidden="true"
      data-shader-state={status}
    />
  );
}
