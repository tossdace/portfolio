"use client";

import { useEffect, useRef, useState } from "react";

interface UnderwaterShaderProps {
  enabled?: boolean;
  className?: string;
}

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_mouseX;
  uniform float u_mouseY;
  uniform bool u_reducedMotion;

  varying vec2 v_uv;

  // Hash function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // 2D noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // FBM noise
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  // Caustics pattern
  float caustics(vec2 uv, float time) {
    vec2 p = uv * 8.0;
    float c = 0.0;

    // Multiple layers of distorted noise for caustics
    p += vec2(sin(time * 0.3) * 0.5, cos(time * 0.2) * 0.5);
    c += fbm(p, 4) * 0.5;

    p = uv * 12.0 + vec2(time * 0.1, time * 0.07);
    c += fbm(p, 3) * 0.3;

    p = uv * 20.0 - vec2(time * 0.15, time * 0.1);
    c += fbm(p, 2) * 0.2;

    // Sharpen caustics
    c = smoothstep(0.42, 0.6, c);
    return c;
  }

  // Water surface waves
  float waterSurface(vec2 uv, float time) {
    float waves = 0.0;
    waves += sin(uv.x * 10.0 + time * 1.5) * 0.02;
    waves += sin(uv.y * 8.0 + time * 1.2) * 0.015;
    waves += sin((uv.x + uv.y) * 6.0 + time * 1.0) * 0.01;
    waves += fbm(uv * 5.0 + vec2(time * 0.2, time * 0.15), 3) * 0.03;
    return waves;
  }

  // Rising bubbles
  float bubbles(vec2 uv, float time) {
    float b = 0.0;
    for (int i = 0; i < 8; i++) {
      float seed = float(i) * 17.3 + 42.0;
      float speed = 0.1 + hash(vec2(seed, 0.0)) * 0.3;
      float x = hash(vec2(seed, 1.0)) * 2.0 - 1.0;
      float size = 0.005 + hash(vec2(seed, 2.0)) * 0.015;
      float y = -1.0 - mod(time * speed + hash(vec2(seed, 3.0)), 2.0);

      vec2 center = vec2(x, y);
      float dist = length(uv - center);
      float bubble = smoothstep(size, 0.0, dist);
      b += bubble * (1.0 + y) * 0.5; // Fade as they rise
    }
    return b;
  }

  // Light rays / god rays
  float lightRays(vec2 uv, float time) {
    vec2 center = vec2(0.5 + sin(time * 0.1) * 0.3, 0.2);
    vec2 dir = normalize(uv - center);
    float dist = length(uv - center);

    float rays = 0.0;
    for (int i = 0; i < 16; i++) {
      float angle = float(i) * 3.14159 / 8.0;
      float rayDir = sin(angle + time * 0.05) * 0.5 + 0.5;
      float ray = smoothstep(0.48, 0.52, rayDir);
      rays += ray * (1.0 - dist * 0.5) * 0.1;
    }

    return rays * exp(-dist * 2.0);
  }

  // Kelp swaying
  float kelp(vec2 uv, float time) {
    float k = 0.0;
    for (int i = 0; i < 5; i++) {
      float seed = float(i) * 23.7 + 11.0;
      float x = hash(vec2(seed, 0.0)) * 2.0 - 1.0;
      float height = 0.3 + hash(vec2(seed, 1.0)) * 0.4;
      float sway = sin(time * 0.8 + seed) * 0.15;
      float width = 0.02;

      float dist = abs(uv.x - (x + sway * (1.0 - uv.y)));
      if (uv.y > 0.5 && uv.y < 0.5 + height) {
        k += smoothstep(width, 0.0, dist) * (1.0 - (uv.y - 0.5) / height);
      }
    }
    return k;
  }

  // Particle/speckles
  float particles(vec2 uv, float time) {
    float p = 0.0;
    for (int i = 0; i < 12; i++) {
      float seed = float(i) * 31.1 + 7.0;
      float speed = 0.05 + hash(vec2(seed, 0.0)) * 0.15;
      float x = hash(vec2(seed, 1.0)) * 2.0 - 1.0;
      float y = -1.0 - mod(time * speed + hash(vec2(seed, 2.0)), 2.0);
      float sway = sin(time * 0.5 + seed * 2.0) * 0.1;

      vec2 center = vec2(x + sway, y);
      float dist = length(uv - center);
      float size = 0.003 + hash(vec2(seed, 3.0)) * 0.005;
      p += smoothstep(size, 0.0, dist) * 0.8;
    }
    return p;
  }

  void main() {
    vec2 uv = v_uv;
    vec2 centeredUV = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

    // Base water color - deep blue to cyan gradient
    vec3 deepColor = vec3(0.015, 0.09, 0.18);
    vec3 shallowColor = vec3(0.035, 0.34, 0.5);
    vec3 surfaceColor = vec3(0.14, 0.66, 0.86);

    float depth = uv.y;
    vec3 waterColor = mix(deepColor, shallowColor, pow(1.0 - depth, 1.5));
    waterColor = mix(waterColor, surfaceColor, pow(1.0 - depth, 3.0));

    // Apply caustics on the "floor"
    float causticField = caustics(centeredUV, u_time);
    float caustic = pow(causticField, 1.25);
    float causticVeins = 1.0 - smoothstep(0.025, 0.1, abs(causticField - 0.58));
    waterColor += vec3(caustic * 0.2, caustic * 0.42, caustic * 0.58);
    waterColor += vec3(causticVeins * 0.12, causticVeins * 0.28, causticVeins * 0.38);

    // Water surface distortion
    float surfaceWave = waterSurface(centeredUV, u_time);
    float surfaceAlpha = smoothstep(0.95, 1.0, uv.y + surfaceWave);
    waterColor = mix(waterColor, vec3(0.3, 0.7, 0.9), surfaceAlpha * 0.3);

    // Light rays from surface
    float rays = lightRays(centeredUV, u_time);
    waterColor += vec3(rays * 0.28, rays * 0.38, rays * 0.48);

    // Kelp forests
    float kelpAmount = kelp(centeredUV, u_time);
    waterColor = mix(waterColor, vec3(0.0, 0.15, 0.05), kelpAmount * 0.6);
    waterColor += vec3(kelpAmount * 0.02, kelpAmount * 0.08, kelpAmount * 0.02);

    // Rising bubbles
    float bubbleAmount = bubbles(centeredUV, u_time);
    waterColor += vec3(bubbleAmount * 0.4, bubbleAmount * 0.5, bubbleAmount * 0.6);

    // Floating particles/speckles
    float particleAmount = particles(centeredUV, u_time);
    waterColor += vec3(particleAmount * 0.3, particleAmount * 0.4, particleAmount * 0.2);

    // Vignette for depth
    float vignette = 1.0 - length(centeredUV) * 0.3;
    waterColor *= vignette;

    // Subtle color animation
    float colorShift = sin(u_time * 0.2) * 0.02;
    waterColor.r += colorShift;
    waterColor.b -= colorShift * 0.5;

    // Reduced motion: simplify
    if (u_reducedMotion) {
      waterColor = mix(deepColor, shallowColor, pow(1.0 - depth, 1.5));
      waterColor += vec3(caustic * 0.2, caustic * 0.42, caustic * 0.58);
      waterColor += vec3(causticVeins * 0.12, causticVeins * 0.28, causticVeins * 0.38);
      waterColor *= vignette;
    }

    gl_FragColor = vec4(waterColor, 1.0);
  }
`;

export default function UnderwaterShader({
  enabled = true,
  className = ""
}: UnderwaterShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformLocationsRef = useRef<{
    time: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
    mouseX: WebGLUniformLocation | null;
    mouseY: WebGLUniformLocation | null;
    reducedMotion: WebGLUniformLocation | null;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    // Initialize start time
    startTimeRef.current = performance.now();

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance"
    });

    if (!gl) {
      console.warn("WebGL2 not supported");
      return;
    }

    glRef.current = gl;
    setWebglSupported(true);

    // Compile shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;

    // Get uniform locations
    uniformLocationsRef.current = {
      time: gl.getUniformLocation(program, "u_time"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      mouseX: gl.getUniformLocation(program, "u_mouseX"),
      mouseY: gl.getUniformLocation(program, "u_mouseY"),
      reducedMotion: gl.getUniformLocation(program, "u_reducedMotion"),
    };

    // Create full-screen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Resize handler
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);
    resize();

    // Render loop
    const render = (now: number) => {
      if (!glRef.current || !programRef.current || !uniformLocationsRef.current) return;

      const gl = glRef.current;
      const program = programRef.current;
      const uniforms = uniformLocationsRef.current;

      const elapsed = (now - startTimeRef.current) * 0.001;

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.mouseX, mouseX);
      gl.uniform1f(uniforms.mouseY, mouseY);
      gl.uniform1i(uniforms.reducedMotion, reducedMotion ? 1 : 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);

      if (glRef.current) {
        glRef.current.deleteProgram(programRef.current!);
        glRef.current.deleteBuffer(positionBuffer);
        glRef.current.deleteVertexArray(vao);
      }
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
      aria-hidden="true"
      data-webgl-supported={webglSupported}
    />
  );
}
