# Sharayah Portfolio

Personal portfolio built with Vite, React, and TypeScript.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open the URL shown in the terminal to view the app.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Repository

GitHub: https://github.com/SharayahDesigns/SharayahPortfolio

## State Architecture

The portfolio deliberately avoids a global client-side store because it has no shared mutable product data. State is separated by responsibility:

- **Durable content:** typed modules in `src/data/portfolio.ts` and `src/data/caseStudies.ts` keep portfolio content independent from UI components.
- **Navigation state:** React Router owns the URL, route, and case-study slug so every primary view has a shareable source of truth.
- **Interaction state:** menus, disclosures, loaders, WebGL capability checks, and other temporary UI state stay in the closest owning component.
- **Motion state:** Framer Motion values and scroll progress remain inside the presentation that consumes them, separated from navigation and content.
- **Analytics state:** route tracking and event helpers live behind `src/lib/analytics.ts`; analytics never becomes application state.

This keeps updates local, avoids duplicated sources of truth, and leaves room to introduce a server cache or global store later if the product gains genuinely shared mutable data.

## Public and Private Work

This repository and its commit history are public for implementation review. Client production repositories remain private, so client work is represented through case studies and live releases rather than unverifiable source-code claims. Public community contributions will be linked from the portfolio when they are independently reviewable.

## Structure

- `src/` contains the React app, page data, and component logic.
- `public/images/` contains only runtime image assets that are referenced by the app or SEO scripts.
- `public/models/` contains only the active 3D models used by the hero experience:
  - `codingChick-2-optimized.glb`
  - `Meshy_AI_Snowy_Shepherd_with_B_0725220024_texture-optimized.glb`
  - `compressed-Hero-Avatar.glb`
- `dist/` is generated build output and should not be treated as source.
