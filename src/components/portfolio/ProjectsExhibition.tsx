"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";
import { projects, type Project } from "@/data/portfolio";

type GalleryStatus = "loading" | "ready" | "fallback";
type PreviewState = "loading" | "loaded" | "error";

const artworkPalettes = [
  ["#efe8f2", "#8c70ac", "#c6b2dd"],
  ["#f0e9e4", "#ad7b5e", "#dfb89a"],
  ["#e8f0ee", "#4b9b8d", "#a8d7cb"],
  ["#f1e9ee", "#bd719b", "#e0b2cd"],
  ["#e9ece9", "#6a8d7b", "#b2c8ba"],
];

const galleryVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const galleryFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uReveal;
  uniform float uSeed;
  varying vec2 vUv;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7)) + uSeed * 17.0) * 43758.5453);
  }

  void main() {
    vec2 cell = floor(vUv * vec2(38.0, 26.0));
    float noise = hash(cell);
    float field = noise * 0.72 + vUv.x * 0.28;
    float remaining = 1.0 - smoothstep(field - 0.035, field + 0.035, uReveal);
    float turbulence = sin(vUv.y * 36.0 + noise * 8.0) * 0.003;
    vec2 displacement = vec2((noise - 0.5) * 0.055 + turbulence, (noise - 0.5) * 0.035) * uReveal;
    float pixelation = mix(512.0, 28.0, uReveal);
    vec2 displacedUv = clamp(vUv + displacement, 0.0, 1.0);
    vec2 pixelatedUv = (floor(displacedUv * pixelation) + 0.5) / pixelation;
    vec2 uv = mix(vUv, pixelatedUv, uReveal);
    vec4 color = texture2D(uMap, clamp(uv, 0.0, 1.0));
    float fragmentEdge = 1.0 - smoothstep(0.0, 0.18, abs(field - uReveal));
    color.rgb = mix(color.rgb, vec3(1.0, 0.54, 0.82), fragmentEdge * uReveal * 0.5);
    color.a *= remaining;
    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function previewFor(project: Project) {
  return project.image;
}

function previewAlt(project: Project) {
  if (["zeno5-emulator", "sign-language-gloves", "project-yukino"].includes(project.slug)) {
    return `${project.title} illustrative concept artwork, not a verified project screenshot`;
  }
  if (project.slug === "hirevoy") return "Hirevoy dashboard screenshot";
  if (project.slug === "portfolio-os") return "Generated floating-island artwork for Portfolio OS";
  return `${project.title} project artwork preview`;
}

function ProjectArtworkFallback({ project }: { project: Project }) {
  return (
    <div
      className={`projects-exhibition-image-fallback projects-exhibition-image-fallback--${project.slug}`}
      role="img"
      aria-label={`${project.title} artwork preview unavailable`}
    >
      <svg viewBox="0 0 640 400" aria-hidden="true" focusable="false">
        {project.slug === "zeno5-emulator" && (
          <>
            <rect x="144" y="48" width="368" height="236" rx="16" />
            <path d="M166 84h324M166 116h90v140h-90zM270 116h220v58H270zM270 190h100v66H270zM382 190h108v66H382z" />
            <path d="M260 326h136M322 284v42M248 344h160" />
            <path d="M266 356c8-19 28-24 56-24s48 5 56 24l-15 22h-82zM282 352v16m-8-8h16m47-8v8m16 0v8" />
          </>
        )}
        {project.slug === "hirevoy" && (
          <>
            <rect x="96" y="44" width="448" height="312" rx="16" />
            <path d="M156 44v312M120 84h18M120 116h18M120 148h18M120 180h18M120 212h18" />
            <rect x="182" y="72" width="150" height="98" rx="10" />
            <rect x="350" y="72" width="166" height="98" rx="10" />
            <rect x="182" y="190" width="334" height="134" rx="10" />
            <path d="M202 146l28-28 25 12 46-44M370 104h120M370 126h84M202 228h92M202 254h276M202 280h226" />
          </>
        )}
        {project.slug === "sign-language-gloves" && (
          <>
            <path d="M228 342 190 248l-2-86c0-16 23-17 25-1l7 56-2-118c0-18 25-19 26-1l5 108 2-128c0-18 26-18 27 0l1 126 8-112c2-18 27-16 27 3l-4 124 17-76c4-17 28-10 23 9l-22 118c-9 49-35 77-74 86z" />
            <path d="m218 209 28 12m4-32 28 13m0-34 27 12m-2 43 25 12" />
            <path d="M224 208c-22 47-22 80 2 105m52-112c-13 38-14 71-7 99m42-86c-6 34-5 59 2 81m35-55c-7 25-9 41-5 56" />
            <rect x="410" y="254" width="100" height="78" rx="8" />
            <path d="M426 254v-18m18 18v-18m18 18v-18m18 18v-18m18 18v-18M436 280h48v28h-48z" />
            <path d="M364 286h46M374 308h36" />
          </>
        )}
        {project.slug === "project-yukino" && (
          <>
            <circle cx="320" cy="188" r="126" />
            <circle cx="320" cy="188" r="78" />
            <path d="M78 190h62l18-34 18 68 22-108 26 150 23-110 20 68 18-36h46l20-24 17 48 20-82 26 118 20-64 20 24h48" />
            <circle cx="320" cy="190" r="23" />
            <path d="M320 176v25m-12-9v4a12 12 0 0 0 24 0v-4m-12 16v12m-13 0h26" />
            <rect x="112" y="326" width="416" height="22" rx="11" />
          </>
        )}
        {project.slug === "portfolio-os" && (
          <>
            <path d="M72 268c33-27 61-30 94-16 20-61 89-80 137-38 41-51 114-48 150 2 54-18 105 8 115 52 22 7 34 20 35 38H72z" />
            <path d="m108 286 92-36 81 25 89-41 133 41-94 44-116-10-94 25z" />
            <path d="m103 302 98-33 84 23 88-38 126 34-88 47-121-13-99 27z" />
            <path d="M282 226v-58m-16 24 16-25 16 25m71 13v-66m-18 30 18-31 18 31" />
            <circle cx="282" cy="154" r="7" />
            <circle cx="355" cy="144" r="7" />
          </>
        )}
      </svg>
      <div className="projects-exhibition-image-fallback-copy">
        <small>PROJECT ARTWORK</small>
        <strong>{project.title}</strong>
        <span>Preview image unavailable</span>
      </div>
    </div>
  );
}

function ProjectPreviewImage({
  project,
  sizes,
  className,
}: {
  project: Project;
  sizes: string;
  className: string;
}) {
  const source = previewFor(project);
  const [previewStatus, setPreviewStatus] = useState<{
    source: string | undefined;
    state: PreviewState;
  }>({ source, state: source ? "loading" : "error" });
  const state = previewStatus.source === source
    ? previewStatus.state
    : source ? "loading" : "error";

  if (!source || state === "error") {
    return <ProjectArtworkFallback project={project} />;
  }

  return (
    <>
      {state === "loading" && (
        <span className="projects-exhibition-image-loading" role="status">
          Loading {project.title} artwork
        </span>
      )}
      <Image
        src={source}
        alt={previewAlt(project)}
        fill
        sizes={sizes}
        className={className}
        onLoad={() => setPreviewStatus({ source, state: "loaded" })}
        onError={() => setPreviewStatus({ source, state: "error" })}
      />
    </>
  );
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawCanvasArtworkFallback(
  context: CanvasRenderingContext2D,
  project: Project,
  ink: string,
  accent: string,
) {
  context.save();
  context.lineWidth = 5;
  context.strokeStyle = `${ink}bb`;
  context.fillStyle = `${accent}30`;

  if (project.slug === "zeno5-emulator") {
    context.strokeRect(610, 145, 500, 320);
    context.fillRect(630, 165, 460, 270);
    context.fillStyle = `${accent}66`;
    context.fillRect(650, 190, 86, 215);
    context.fillRect(756, 190, 314, 92);
    context.fillRect(756, 300, 144, 105);
    context.fillRect(916, 300, 154, 105);
    context.beginPath();
    context.moveTo(666, 526);
    context.lineTo(1060, 526);
    context.moveTo(862, 466);
    context.lineTo(862, 526);
    context.stroke();
    context.beginPath();
    context.ellipse(860, 578, 142, 36, 0, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(806, 578, 13, 0, Math.PI * 2);
    context.stroke();
    context.fillRect(958, 564, 16, 16);
    context.fillRect(990, 564, 16, 16);
  } else if (project.slug === "hirevoy") {
    context.strokeRect(580, 125, 540, 500);
    context.fillRect(600, 145, 84, 460);
    context.strokeRect(710, 155, 174, 140);
    context.strokeRect(902, 155, 194, 140);
    context.strokeRect(710, 318, 386, 278);
    context.beginPath();
    context.moveTo(742, 261);
    context.lineTo(784, 226);
    context.lineTo(822, 244);
    context.lineTo(860, 185);
    context.moveTo(742, 367);
    context.lineTo(1048, 367);
    context.moveTo(742, 420);
    context.lineTo(1030, 420);
    context.moveTo(742, 473);
    context.lineTo(1010, 473);
    context.stroke();
  } else if (project.slug === "sign-language-gloves") {
    context.beginPath();
    context.moveTo(730, 610);
    context.lineTo(678, 420);
    context.lineTo(682, 247);
    context.lineTo(722, 245);
    context.lineTo(738, 390);
    context.lineTo(744, 150);
    context.lineTo(786, 145);
    context.lineTo(796, 380);
    context.lineTo(816, 130);
    context.lineTo(856, 135);
    context.lineTo(854, 390);
    context.lineTo(900, 184);
    context.lineTo(936, 198);
    context.lineTo(902, 454);
    context.lineTo(872, 586);
    context.closePath();
    context.fill();
    context.stroke();
    context.strokeStyle = accent;
    context.lineWidth = 13;
    for (const x of [714, 766, 820, 873]) {
      context.beginPath();
      context.moveTo(x, 205);
      context.lineTo(x + 10, 386);
      context.stroke();
    }
    context.lineWidth = 5;
    context.strokeStyle = `${ink}bb`;
    context.strokeRect(958, 432, 132, 114);
    context.fillRect(982, 458, 82, 62);
    for (let pin = 0; pin < 5; pin += 1) {
      context.fillRect(970 + pin * 23, 418, 7, 14);
      context.fillRect(970 + pin * 23, 546, 7, 14);
    }
  } else if (project.slug === "project-yukino") {
    context.beginPath();
    context.arc(850, 360, 190, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(850, 360, 120, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = accent;
    context.lineWidth = 9;
    context.beginPath();
    context.moveTo(590, 365);
    for (let step = 0; step <= 48; step += 1) {
      const x = 590 + step * 11;
      const y = 365 + Math.sin(step * 1.23) * (step % 4 === 0 ? 90 : 38);
      context.lineTo(x, y);
    }
    context.stroke();
    context.beginPath();
    context.arc(850, 360, 35, Math.PI, Math.PI * 2);
    context.lineTo(885, 373);
    context.arc(850, 373, 35, 0, Math.PI);
    context.stroke();
  } else {
    context.beginPath();
    context.arc(855, 235, 104, Math.PI, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(590, 420);
    context.bezierCurveTo(680, 325, 745, 392, 850, 365);
    context.bezierCurveTo(940, 340, 1010, 365, 1110, 420);
    context.lineTo(1010, 520);
    context.lineTo(810, 485);
    context.lineTo(690, 530);
    context.closePath();
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(790, 365);
    context.lineTo(790, 300);
    context.moveTo(940, 352);
    context.lineTo(940, 270);
    context.stroke();
  }
  context.restore();
}

function createArtworkTexture(
  project: Project,
  index: number,
  textures: Set<THREE.Texture>,
  onUpdate: () => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 750;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas artwork is unavailable");

  const [paper, ink, accent] = artworkPalettes[index % artworkPalettes.length];
  context.fillStyle = paper;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const wash = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  wash.addColorStop(0, `${accent}55`);
  wash.addColorStop(0.48, "#ffffff00");
  wash.addColorStop(1, `${ink}33`);
  context.fillStyle = wash;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = `${ink}35`;
  context.lineWidth = 1;
  for (let line = 0; line < 8; line += 1) {
    const x = 710 + line * 42;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x - 250, canvas.height);
    context.stroke();
  }

  context.fillStyle = ink;
  context.font = "500 22px Arial, sans-serif";
  context.letterSpacing = "0.24em";
  context.fillText((project.category ?? project.eyebrow).toUpperCase(), 72, 86);

  drawCanvasArtworkFallback(context, project, ink, accent);

  context.fillStyle = ink;
  context.font = "bold 82px Georgia, serif";
  const words = project.title.split(" ");
  let line = "";
  let lineY = 390;
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > 760 && line) {
      context.fillText(line, 76, lineY);
      line = word;
      lineY += 94;
    } else line = candidate;
  }
  if (line) context.fillText(line, 76, lineY);

  context.fillStyle = `${ink}bb`;
  context.font = "500 17px Arial, sans-serif";
  context.letterSpacing = "0.18em";
  context.fillText("ILLUSTRATIVE PROJECT ARTWORK", 76, 680);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  textures.add(texture);

  const source = previewFor(project);
  if (source) {
    const image = new window.Image();
    image.onload = () => {
      drawCoverImage(context, image, canvas.width, canvas.height);
      texture.needsUpdate = true;
      onUpdate();
    };
    image.onerror = () => onUpdate();
    image.src = source;
  }

  return texture;
}

function createParticleTexture(textures: Set<THREE.Texture>) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas particle texture is unavailable");
  const glow = context.createRadialGradient(32, 32, 1, 32, 32, 31);
  glow.addColorStop(0, "rgba(255, 222, 247, 1)");
  glow.addColorStop(0.2, "rgba(255, 147, 216, .7)");
  glow.addColorStop(1, "rgba(255, 93, 195, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  textures.add(texture);
  return texture;
}

function randomBetween(seed: number, min: number, max: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return min + (value - Math.floor(value)) * (max - min);
}

export default function ProjectsExhibition() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detailPanelRef = useRef<HTMLElement>(null);
  const openDetailsButtonRef = useRef<HTMLButtonElement>(null);
  const selectedIndexRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const dragStateRef = useRef<{ pointerId: number; startX: number; moved: boolean } | null>(null);
  const fallbackDragRef = useRef<{ pointerId: number; startX: number; moved: boolean } | null>(null);
  const ignoreNextClickRef = useRef(false);
  const detailOpenRef = useRef(false);
  const detailNeedsRevealRef = useRef(false);
  const lastRevealedIndexRef = useRef(0);
  const detailTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const transitionUniformsRef = useRef<Array<{ value: number } | undefined>>([]);
  const renderOnceRef = useRef<() => void>(() => {});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [galleryStatus, setGalleryStatus] = useState<GalleryStatus>("loading");
  const prefersReducedMotion = useReducedMotion() === true;
  const selectedProject = projects[selectedIndex] ?? projects[0];
  const repository = selectedProject?.repo ?? selectedProject?.links.find((link) => link.href?.includes("github.com"))?.href;
  const externalLinks = selectedProject?.links.filter(
    (link) => link.href?.startsWith("http") && link.href !== repository,
  ) ?? [];
  const detailTags = selectedProject
    ? [...new Set([...(selectedProject.category ? [selectedProject.category] : []), ...selectedProject.techStack])]
    : [];

  const selectProject = useCallback((index: number) => {
    const nextIndex = THREE.MathUtils.clamp(index, 0, projects.length - 1);
    selectedIndexRef.current = nextIndex;
    dragOffsetRef.current = 0;
    setSelectedIndex(nextIndex);
    renderOnceRef.current();
  }, []);

  const openDetails = useCallback(() => {
    if (detailOpenRef.current) return;
    detailOpenRef.current = true;
    detailNeedsRevealRef.current = true;
    setDetailsOpen(true);
    detailTimelineRef.current?.kill();

    if (prefersReducedMotion) {
      const reveal = transitionUniformsRef.current[selectedIndexRef.current];
      if (reveal) reveal.value = 1;
      return;
    }
  }, [prefersReducedMotion]);

  const closeDetails = useCallback(() => {
    if (!detailOpenRef.current) return;
    detailOpenRef.current = false;
    detailTimelineRef.current?.kill();

    const finishClose = () => {
      setDetailsOpen(false);
      openDetailsButtonRef.current?.focus({ preventScroll: true });
    };
    const reveal = transitionUniformsRef.current[selectedIndexRef.current];
    if (prefersReducedMotion) {
      if (reveal) reveal.value = 0;
      finishClose();
      return;
    }

    const panel = detailPanelRef.current;
    if (!panel) {
      finishClose();
      return;
    }
    const timeline = gsap.timeline({ onComplete: finishClose });
    timeline.to(panel, { clipPath: "inset(0 0 0 100%)", x: 16, duration: 0.64, ease: "power3.inOut" }, 0);
    if (reveal) timeline.to(reveal, { value: 0, duration: 0.64, ease: "power2.inOut" }, 0);
    detailTimelineRef.current = timeline;
  }, [prefersReducedMotion]);

  useEffect(() => () => {
    detailTimelineRef.current?.kill();
  }, []);

  useEffect(() => {
    if (!detailsOpen || prefersReducedMotion) return;
    const reveal = transitionUniformsRef.current[selectedIndex];
    const panel = detailPanelRef.current;
    if (!reveal || !panel) return;
    detailTimelineRef.current?.kill();
    const previousReveal = transitionUniformsRef.current[lastRevealedIndexRef.current];
    const timeline = gsap.timeline();
    if (previousReveal && previousReveal !== reveal) {
      timeline.to(previousReveal, { value: 0, duration: 0.42, ease: "power2.inOut" }, 0);
    }
    if (detailNeedsRevealRef.current) {
      timeline.fromTo(
        panel,
        { clipPath: "inset(0 0 0 100%)", x: 16 },
        { clipPath: "inset(0 0 0 0)", x: 0, duration: 0.82, ease: "power3.inOut" },
        0,
      );
      detailNeedsRevealRef.current = false;
    }
    timeline.to(reveal, { value: 1, duration: 0.78, ease: "power2.inOut" }, 0.04);
    lastRevealedIndexRef.current = selectedIndex;
    detailTimelineRef.current = timeline;
  }, [detailsOpen, prefersReducedMotion, selectedIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || projects.length === 0) return;
    const reducedMotion = prefersReducedMotion;

    let renderer: THREE.WebGLRenderer | null = null;
    let reflector: Reflector | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let animationFrame = 0;
    let statusFrame = 0;
    let floaterGeometry: THREE.BufferGeometry | null = null;
    let visible = false;
    let stopped = false;
    const textures = new Set<THREE.Texture>();
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const panels: THREE.Group[] = [];
    const transitionUniforms: Array<{ value: number } | undefined> = [];
    transitionUniformsRef.current = transitionUniforms;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2("#08070b", 0.035);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.55, 11.6);
    camera.lookAt(0, 0, -0.15);

    const resize = () => {
      if (!renderer) return;
      const width = Math.max(section.clientWidth, 1);
      const height = Math.max(section.clientHeight, 1);
      const mobile = width <= 760;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = mobile ? 48 : 38;
      camera.position.z = mobile ? 13.6 : 11.6;
      camera.updateProjectionMatrix();
    };

    const setPanelTargets = (delta: number) => {
      const selected = THREE.MathUtils.clamp(
        selectedIndexRef.current + dragOffsetRef.current,
        0,
        projects.length - 1,
      );
      const detailShift = detailOpenRef.current && section.clientWidth > 760 ? 2.35 : 0;
      for (const [index, panel] of panels.entries()) {
        const offset = index - selected;
        const angle = offset * 0.36;
        const distance = Math.abs(offset);
        const targetPosition = new THREE.Vector3(
          Math.sin(angle) * 10.1 - detailShift,
          -0.02,
          -distance * 0.58 - (1 - Math.cos(angle)) * 8.2,
        );
        const targetRotation = -Math.sign(offset) * 0.34;
        const targetScale = 1 - distance * 0.12;

        if (reducedMotion) {
          panel.position.copy(targetPosition);
          panel.rotation.y = targetRotation;
          panel.scale.setScalar(targetScale);
        } else {
          panel.position.lerp(targetPosition, 1 - Math.exp(-delta * 5.2));
          panel.rotation.y = THREE.MathUtils.damp(panel.rotation.y, targetRotation, 5.2, delta);
          const scale = THREE.MathUtils.damp(panel.scale.x, targetScale, 5.2, delta);
          panel.scale.setScalar(scale);
        }

        const frame = panel.userData.frame as THREE.Mesh;
        const frameMaterial = frame.material as THREE.MeshStandardMaterial;
        frameMaterial.emissive.set(index === selected ? "#5e3d5c" : "#0b0a0d");
        frameMaterial.emissiveIntensity = index === selected ? 0.55 : 0.1;
      }
    };

    const drawFrame = (time: number, delta = 1 / 60) => {
      if (stopped || !renderer) return;
      setPanelTargets(delta);

      const positions = floaterGeometry?.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (positions && !reducedMotion) {
        for (let index = 0; index < positions.count; index += 1) {
          const baseY = floaterGeometry?.userData.baseY as Float32Array | undefined;
          const seed = floaterGeometry?.userData.seed as Float32Array | undefined;
          if (!baseY || !seed) break;
          positions.setY(index, baseY[index] + Math.sin(time * 0.00022 + seed[index]) * 0.12);
        }
        positions.needsUpdate = true;
      }

      try {
        renderer.render(scene, camera);
      } catch {
        showFallback();
        return;
      }
      if (visible && !document.hidden && !reducedMotion) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      }
    };

    const startRendering = () => {
      if (!visible || document.hidden || animationFrame || stopped) return;
      animationFrame = window.requestAnimationFrame((time) => {
        animationFrame = 0;
        drawFrame(time);
      });
    };

    const stopRendering = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const cleanup = () => {
      if (stopped) return;
      stopped = true;
      stopRendering();
      if (statusFrame) window.cancelAnimationFrame(statusFrame);
      statusFrame = 0;
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("click", onCanvasClick);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      for (const texture of textures) texture.dispose();
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      reflector?.dispose();
      renderer?.dispose();
      renderer = null;
      transitionUniformsRef.current = [];
      renderOnceRef.current = () => {};
    };

    const showFallback = () => {
      if (stopped) return;
      cleanup();
      setGalleryStatus("fallback");
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopRendering();
      } else {
        startRendering();
      }
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const getProjectAtPoint = (clientX: number, clientY: number) => {
      if (!renderer) return undefined;
      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(panels, true);
      return hits.find((hit) => Number.isInteger(hit.object.userData.projectIndex))?.object.userData.projectIndex as number | undefined;
    };

    const onCanvasClick = (event: MouseEvent) => {
      if (!renderer || stopped) return;
      if (ignoreNextClickRef.current) {
        ignoreNextClickRef.current = false;
        return;
      }
      const projectIndex = getProjectAtPoint(event.clientX, event.clientY);
      if (typeof projectIndex === "number") selectProject(projectIndex);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || detailOpenRef.current) return;
      dragStateRef.current = { pointerId: event.pointerId, startX: event.clientX, moved: false };
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragStateRef.current;
      if (drag && drag.pointerId === event.pointerId) {
        const delta = event.clientX - drag.startX;
        if (Math.abs(delta) > 5) drag.moved = true;
        if (drag.moved) {
          dragOffsetRef.current = THREE.MathUtils.clamp(-delta / Math.max(canvas.clientWidth * 0.36, 1), -1.5, 1.5);
          if (reducedMotion) drawFrame(performance.now());
        }
        return;
      }
      if (event.pointerType === "touch") return;
      const projectIndex = getProjectAtPoint(event.clientX, event.clientY);
      canvas.style.cursor = typeof projectIndex === "number" ? "pointer" : "grab";
    };

    const onPointerUp = (event: PointerEvent) => {
      const drag = dragStateRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      dragStateRef.current = null;
      canvas.style.cursor = "grab";
      if (!drag.moved) return;
      const nextIndex = Math.round(selectedIndexRef.current + dragOffsetRef.current);
      dragOffsetRef.current = 0;
      ignoreNextClickRef.current = true;
      window.setTimeout(() => { ignoreNextClickRef.current = false; }, 0);
      selectProject(nextIndex);
      if (reducedMotion) drawFrame(performance.now());
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!visible || event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        selectProject(selectedIndexRef.current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        selectProject(selectedIndexRef.current + 1);
      } else if (event.key === "Escape" && detailOpenRef.current) {
        event.preventDefault();
        closeDetails();
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      showFallback();
    };

    try {
      const mobile = section.clientWidth <= 760;
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !mobile,
        powerPreference: "low-power",
      });
      renderer.setClearColor("#08070b", 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.debug.checkShaderErrors = true;
      renderer.debug.onShaderError = () => queueMicrotask(showFallback);
      resize();

      scene.add(new THREE.HemisphereLight("#f2d8ec", "#08070b", 1.25));
      const overhead = new THREE.SpotLight("#f4d4ee", 150, 30, Math.PI / 4, 0.8, 1.2);
      overhead.position.set(0, 7, 1);
      overhead.target.position.set(0, 0, -3);
      scene.add(overhead, overhead.target);

      const sideLight = new THREE.PointLight("#b795db", 34, 22, 1.8);
      sideLight.position.set(-7, 1.5, -2);
      scene.add(sideLight);
      const warmLight = new THREE.PointLight("#efadd1", 27, 20, 1.8);
      warmLight.position.set(7, 0.4, -4);
      scene.add(warmLight);

      for (const [index, x] of [-7.5, 0, 7.5].entries()) {
        const beam = new THREE.Mesh(
          new THREE.ConeGeometry(2.5, 11, 20, 1, true),
          new THREE.MeshBasicMaterial({
            color: index === 1 ? "#e8c6e9" : "#b89bd4",
            transparent: true,
            opacity: 0.035,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        geometries.add(beam.geometry);
        materials.add(beam.material);
        beam.position.set(x, 3.9, -5.4);
        scene.add(beam);
      }

      const floor = new Reflector(new THREE.PlaneGeometry(52, 52), {
        clipBias: 0.003,
        textureWidth: mobile ? 256 : 512,
        textureHeight: mobile ? 256 : 512,
        color: "#3c3542",
        multisample: 0,
      });
      reflector = floor;
      geometries.add(floor.geometry);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, -1.96, -6);
      scene.add(floor);

      const floorTint = new THREE.Mesh(
        new THREE.PlaneGeometry(52, 52),
        new THREE.MeshStandardMaterial({
          color: "#211c25",
          metalness: 0.82,
          roughness: 0.25,
          transparent: true,
          opacity: 0.52,
        }),
      );
      geometries.add(floorTint.geometry);
      materials.add(floorTint.material);
      floorTint.rotation.x = -Math.PI / 2;
      floorTint.position.set(0, -1.945, -6);
      scene.add(floorTint);

      const particleTexture = createParticleTexture(textures);
      const floorParticleCount = mobile ? 190 : 420;
      const floorParticlePositions = new Float32Array(floorParticleCount * 3);
      for (let index = 0; index < floorParticleCount; index += 1) {
        floorParticlePositions[index * 3] = randomBetween(index + 4, -19, 19);
        floorParticlePositions[index * 3 + 1] = -1.9 + randomBetween(index + 10, 0, 0.035);
        floorParticlePositions[index * 3 + 2] = randomBetween(index + 20, -25, 7);
      }
      const floorParticleGeometry = new THREE.BufferGeometry();
      geometries.add(floorParticleGeometry);
      floorParticleGeometry.setAttribute("position", new THREE.BufferAttribute(floorParticlePositions, 3));
      const floorParticleMaterial = new THREE.PointsMaterial({
        color: "#f5a9d7",
        map: particleTexture,
        size: mobile ? 0.21 : 0.24,
        transparent: true,
        opacity: 0.54,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      materials.add(floorParticleMaterial);
      scene.add(new THREE.Points(floorParticleGeometry, floorParticleMaterial));

      const floaterCount = mobile ? 20 : 44;
      const floaterPositions = new Float32Array(floaterCount * 3);
      const baseY = new Float32Array(floaterCount);
      const seeds = new Float32Array(floaterCount);
      for (let index = 0; index < floaterCount; index += 1) {
        const y = randomBetween(index + 51, -1.45, 2.2);
        floaterPositions[index * 3] = randomBetween(index + 52, -10, 10);
        floaterPositions[index * 3 + 1] = y;
        floaterPositions[index * 3 + 2] = randomBetween(index + 53, -9, 3);
        baseY[index] = y;
        seeds[index] = randomBetween(index + 54, 0, Math.PI * 2);
      }
      floaterGeometry = new THREE.BufferGeometry();
      geometries.add(floaterGeometry);
      floaterGeometry.userData.baseY = baseY;
      floaterGeometry.userData.seed = seeds;
      floaterGeometry.setAttribute("position", new THREE.BufferAttribute(floaterPositions, 3));
      floaterGeometry.setDrawRange(0, floaterCount);
      const floaterMaterial = new THREE.PointsMaterial({
        color: "#ffd6ed",
        map: particleTexture,
        size: mobile ? 0.17 : 0.2,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      materials.add(floaterMaterial);
      scene.add(new THREE.Points(floaterGeometry, floaterMaterial));

      for (const [index, project] of projects.entries()) {
        const panel = new THREE.Group();
        const frameGeometry = new THREE.BoxGeometry(5.65, 3.68, 0.2);
        geometries.add(frameGeometry);
        const frameMaterial = new THREE.MeshStandardMaterial({
          color: "#f4f0ed",
          metalness: 0.16,
          roughness: 0.3,
          emissive: "#0b0a0d",
          emissiveIntensity: 0.1,
        });
        materials.add(frameMaterial);
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        panel.userData.frame = frame;
        panel.add(frame);

        const texture = createArtworkTexture(project, index, textures, () => {
          if (visible && !document.hidden && reducedMotion) drawFrame(performance.now());
        });
        const artworkGeometry = new THREE.PlaneGeometry(5.6, 3.5);
        geometries.add(artworkGeometry);
        const revealUniform = { value: detailOpenRef.current && index === selectedIndexRef.current ? 1 : 0 };
        transitionUniforms[index] = revealUniform;
        const artworkMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uMap: { value: texture },
            uReveal: revealUniform,
            uSeed: { value: index + 1 },
          },
          vertexShader: galleryVertexShader,
          fragmentShader: galleryFragmentShader,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          toneMapped: false,
        });
        materials.add(artworkMaterial);
        const artwork = new THREE.Mesh(artworkGeometry, artworkMaterial);
        artwork.position.z = 0.14;
        artwork.userData.projectIndex = index;
        panel.userData.projectIndex = index;
        panel.userData.revealUniform = revealUniform;
        panel.add(artwork);
        panels.push(panel);
        scene.add(panel);
      }

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(section);
      canvas.addEventListener("click", onCanvasClick);
      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
      canvas.addEventListener("webglcontextlost", onContextLost, false);
      canvas.style.touchAction = "pan-y";
      canvas.style.cursor = "grab";
      document.addEventListener("visibilitychange", onVisibilityChange);
      window.addEventListener("keydown", onKeyDown);
      renderOnceRef.current = () => {
        if (visible && !document.hidden) drawFrame(performance.now());
      };
      if ("IntersectionObserver" in window) {
        intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting && entry.intersectionRatio > 0.08;
          if (visible) {
            if (reducedMotion) drawFrame(performance.now());
            else startRendering();
          } else stopRendering();
        });
        intersectionObserver.observe(section);
      } else {
        visible = true;
        if (reducedMotion) drawFrame(performance.now());
        else startRendering();
      }
      statusFrame = window.requestAnimationFrame(() => {
        statusFrame = 0;
        if (!stopped) setGalleryStatus("ready");
      });
    } catch {
      showFallback();
    }

    return cleanup;
  }, [closeDetails, prefersReducedMotion, selectProject]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`projects-exhibition${detailsOpen ? " is-details-open" : ""}`}
      aria-label="Interactive projects exhibition"
      onKeyDown={(event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          selectProject(selectedIndexRef.current - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          selectProject(selectedIndexRef.current + 1);
        } else if (event.key === "Escape" && detailOpenRef.current) {
          event.preventDefault();
          closeDetails();
        }
      }}
      onPointerDown={(event) => {
        if (galleryStatus !== "fallback" || event.button !== 0) return;
        if (event.target instanceof HTMLElement && event.target.closest("button, a")) return;
        fallbackDragRef.current = { pointerId: event.pointerId, startX: event.clientX, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const drag = fallbackDragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (Math.abs(event.clientX - drag.startX) > 6) drag.moved = true;
      }}
      onPointerUp={(event) => {
        const drag = fallbackDragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        fallbackDragRef.current = null;
        if (!drag.moved) return;
        ignoreNextClickRef.current = true;
        window.setTimeout(() => { ignoreNextClickRef.current = false; }, 0);
        selectProject(selectedIndexRef.current + (event.clientX < drag.startX ? 1 : -1));
      }}
      onPointerCancel={() => { fallbackDragRef.current = null; }}
    >
      <div className="projects-exhibition-atmosphere" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="projects-exhibition-canvas"
        aria-hidden="true"
        data-gallery-state={galleryStatus}
      />

      {galleryStatus === "fallback" && (
        <div className="projects-exhibition-fallback" aria-label="Project exhibition displays">
          {projects.map((project, index) => {
            const offset = index - selectedIndex;
            const scale = 1 - Math.abs(offset) * 0.12;
            return (
              <button
                key={project.slug}
                type="button"
                aria-pressed={index === selectedIndex}
                aria-label={`Select ${project.title}`}
                onClick={() => {
                  if (ignoreNextClickRef.current) return;
                  selectProject(index);
                }}
                className={`projects-exhibition-fallback-panel${index === selectedIndex ? " is-selected" : ""}`}
                style={{
                  transform: `translate(-50%, -50%) translate3d(${offset * 28}vw, 0, ${-Math.abs(offset) * 70}px) rotateY(${-Math.sign(offset) * 18}deg) scale(${scale})`,
                  zIndex: projects.length - Math.abs(offset),
                }}
              >
                <ProjectPreviewImage
                  project={project}
                  sizes="70vw"
                  className="projects-exhibition-fallback-image"
                />
              </button>
            );
          })}
        </div>
      )}

      <header className="projects-exhibition-heading" aria-live="polite">
        <p>PROJECT EXHIBITION / {String(selectedIndex + 1).padStart(2, "0")}</p>
        <h2>{selectedProject?.title ?? "Projects"}</h2>
      </header>

      <button
        ref={openDetailsButtonRef}
        type="button"
        className="projects-exhibition-open"
        onClick={openDetails}
        aria-haspopup="dialog"
        aria-expanded={detailsOpen}
      >
        Open selected project
      </button>

      <nav className="projects-exhibition-hud" aria-label="Project exhibition navigation">
        <p className="projects-exhibition-count">
          PROJECTS&nbsp; | &nbsp;{String(selectedIndex + 1).padStart(2, "0")} OF {String(projects.length).padStart(2, "0")}
        </p>
        <div className="projects-exhibition-controls">
          <p className="projects-exhibition-instructions">DRAG / ARROW KEYS</p>
          <div className="projects-exhibition-markers" role="group" aria-label="Select a project">
            {projects.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                className="projects-exhibition-marker"
                aria-label={`Select ${project.title}`}
                aria-current={selectedIndex === index ? "true" : undefined}
                onClick={() => selectProject(index)}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="projects-exhibition-next"
          aria-label="Next project"
          onClick={() => selectProject(selectedIndexRef.current + 1)}
        >
          <span aria-hidden="true">›</span>
        </button>
      </nav>

      <aside
        ref={detailPanelRef}
        className={`projects-exhibition-details${detailsOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label={`${selectedProject?.title ?? "Project"} details`}
        aria-hidden={!detailsOpen}
        inert={!detailsOpen}
      >
        {selectedProject && (
          <>
            <div className="projects-exhibition-detail-top">
              <p className="projects-exhibition-detail-eyebrow">{selectedProject.eyebrow}</p>
              <button type="button" className="projects-exhibition-close" onClick={closeDetails}>
                × CLOSE
              </button>
            </div>
            <div className="projects-exhibition-preview">
              <ProjectPreviewImage
                project={selectedProject}
                sizes="(max-width: 640px) 100vw, 42vw"
                className="projects-exhibition-preview-image"
              />
            </div>
            <h3>{selectedProject.title}</h3>
            <p className="projects-exhibition-summary">{selectedProject.summary}</p>
            <span className="projects-exhibition-status">{selectedProject.status}</span>
            <div className="projects-exhibition-tags" aria-label="Project technologies and categories">
              {detailTags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="projects-exhibition-actions">
              <Link href={`/projects/${selectedProject.slug}`} className="projects-exhibition-link projects-exhibition-link-primary">
                View Project <span aria-hidden="true">↗</span>
              </Link>
              {repository && (
                <a className="projects-exhibition-link" href={repository} target="_blank" rel="noreferrer">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              )}
              {externalLinks.map((link) => (
                <a key={link.href} className="projects-exhibition-link" href={link.href} target="_blank" rel="noreferrer">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </>
        )}
      </aside>
    </section>
  );
}
