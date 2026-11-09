# Dhyan portfolio — hybrid immersive hero starter

This is a **drop-in first milestone**, not a replacement for your whole portfolio. It creates an original real-time 3D floating island with a stylized blossom tree, reflective water, drifting fireflies, mouse parallax and cinematic typography. It takes visual cues from the screen recording, but does not reuse the reference site's assets or code.

## 1. Install dependencies

From your existing Next.js repository:

```bash
npm install three @react-three/fiber @react-three/drei gsap
npm install -D @types/three
```

The code assumes a Next.js App Router project and React 18/19.

## 2. Copy the files

Copy:
- `src/components/hero/Hero.tsx`
- `src/components/hero/HeroScene.tsx`
- `src/styles/dhyan-redesign.css`
- `public/images/dhyan-floating-island.png` — generated full-screen island background

If your project does not use a `src/` directory, place the files in the equivalent existing folders and adjust imports.

## 3. Add the CSS

In your `src/app/globals.css`, add:

```css
@import "../styles/dhyan-redesign.css";
```

If your global CSS already has `@import` statements, keep all imports at the top. Alternatively, paste the contents of `dhyan-redesign.css` at the end of your existing global stylesheet.

## 4. Mount the hero

In `src/app/page.tsx`, temporarily render the new hero:

```tsx
import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Keep your existing sections below this line */}
    </main>
  );
}
```

If your project does not have the `@/` alias, use a relative import.

The navigation anchors expect these IDs elsewhere on your page:
- `work`
- `about`
- `experiments`
- `contact`

Add the matching IDs to your existing sections.

## 5. Run and verify

```bash
npm run dev
```

Then:

```bash
npm run lint
npm run build
```

## Important notes

- The hero now uses the generated floating-island artwork at `public/images/dhyan-floating-island.png` as its full-screen background, with a transparent Three.js canvas layered above it for drifting particles. The earlier procedural island geometry remains in the source as a starting point for a later fully 3D version.
- The current scene uses real-time shadows and instancing. If performance is poor, lower Canvas `dpr` to `[1, 1.25]`, reduce the blossom and firefly counts, or disable shadows.
- The CSS imports Google Fonts. If you want fully self-hosted fonts, replace those imports with `next/font/local` or your existing font setup.
- Keep your current site sections and project data. This milestone changes only the hero and its visual system.
- Do not overwrite your existing `globals.css` or `page.tsx`; merge the indicated changes.
- Test on a physical phone and a lower-powered laptop before deploying.

## Next milestone

After this hero is integrated, build the project-gallery transition and project showcase environment as a separate component. Keep the hero scene isolated so it can be optimized independently.
