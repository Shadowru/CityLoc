# AGENTS.md

## Project Overview

This project is a mobile web AR experience for city tourism routes.

User flow:
1. A user scans a QR code placed at a real-world location.
2. The QR code opens a web page and provides a known entry point via `qrId`.
3. The app requests camera access.
4. The user scans the surroundings.
5. The system identifies the visible building / scene and shows AR overlays with facts and voice narration.
6. A timeline slider lets the user switch the environment to historical states (e.g. 50 / 100 / 150 years ago).

## Core Product Assumptions

- QR code gives an initial coarse location and route context.
- Real-time tracking on device is handled by **8th Wall**.
- More accurate scene/building localization is performed by a **server-side visual positioning service** using collected reference imagery.
- Server localization may be slower than on-device tracking, so the UX must remain responsive while waiting.
- The app must work in a mobile browser without requiring native app installation.

## Required Stack

- **Frontend:** Svelte only
- **Bundler / tooling:** Vite
- **Do not use:** SvelteKit
- **AR / tracking:** 8th Wall
- **Backend:** separate service(s), API-first
- **Transport:** prefer REST/JSON first; introduce WebSocket only if truly needed

## Non-Goals for Now

- No native iOS / Android apps
- No SvelteKit SSR
- No premature microservice split
- No heavy real-time server dependency for every frame

## High-Level Architecture

### Frontend Responsibilities
- Read `qrId` from URL or route params
- Initialize session from QR entry point
- Request camera permission
- Start 8th Wall tracking
- Display AR overlays anchored to current pose
- Show loading / scanning / localized / fallback states
- Play narration audio
- Provide timeline slider for historical mode switching
- Gracefully degrade if localization is delayed or unavailable

### Backend Responsibilities
- Resolve `qrId` to location / route / scene metadata
- Accept image frames or sampled snapshots for localization
- Return estimated pose, building/scene identity, confidence, and relevant content IDs
- Serve facts, audio metadata, and historical scene assets
- Store mapping data for buildings, viewpoints, and time layers

## Product Principles

1. **Fast first feedback**
   - The user should see scanning guidance immediately.
   - Never block the UI while waiting for server localization.

2. **Progressive localization**
   - Start with QR-based coarse context.
   - Use 8th Wall for immediate motion tracking.
   - Refine pose with server-side visual positioning when available.

3. **Confidence-aware UX**
   - All localization results should include confidence.
   - Low-confidence results must not trigger strong claims or unstable overlays.

4. **Battery and bandwidth awareness**
   - Do not upload full-resolution frames continuously.
   - Sample frames at controlled intervals.

5. **Privacy by default**
   - Minimize retained camera data.
   - Prefer transient processing unless storage is explicitly required.

## Recommended App States

The frontend should be structured around explicit states:

- `boot`
- `qr-resolved`
- `camera-request`
- `camera-ready`
- `tracking`
- `localizing`
- `localized`
- `low-confidence`
- `historical-mode`
- `error`

Agents should preserve clear state transitions and avoid hidden implicit state.

## Suggested Data Model

### QR Entry
{
  "qrId": "qr_001",
  "locationId": "loc_center_square",
  "routeId": "route_old_town",
  "startingPoseHint": {
    "lat": 0,
    "lng": 0,
    "heading": 0
  }
}

### Localization Response

{
  "sceneId": "scene_city_hall",
  "buildingId": "bld_city_hall",
  "confidence": 0.92,
  "pose": {
    "position": [0, 0, 0],
    "rotation": [0, 0, 0, 1]
  },
  "contentIds": ["fact_1", "fact_2"],
  "timelineAvailable": [0, 50, 100, 150]
}

### Historical Layer Descriptor

{
  "sceneId": "scene_city_hall",
  "yearOffset": 100,
  "assets": {
    "overlayModelUrl": "/assets/history/cityhall_100.glb",
    "textureSetUrl": "/assets/history/cityhall_100/"
  }
}

## Frontend Guidelines

Use Svelte, not SvelteKit.
Keep the app as a client-side SPA.
Prefer small, composable components.
Keep AR/session logic out of presentation components.
Put network calls behind a small API client layer.
Use stores for session state, localization state, and timeline state.
Avoid framework-specific server assumptions.

## Suggested Frontend Structure
src/
  main.ts
  App.svelte
  components/
  stores/
  services/
    api/
    ar/
    audio/
  features/
    qr-entry/
    localization/
    overlays/
    timeline/

## Backend Guidelines

Keep APIs simple and explicit.
Return confidence scores for all localization results.
Version endpoints if response shape is likely to evolve.
Separate:
QR/session bootstrap
localization
content delivery
historical assets metadata

## Performance Rules

Do not send every camera frame to the backend.
Downscale and sample frames before upload.
Cache route, scene, and content metadata when possible.
Keep initial bundle small.
Historical assets must load lazily.

## UX Rules

Always explain what the user should do:
"Point the camera at the building"
"Move slowly"
"Localization in progress"
If localization fails, provide a retry path.
If confidence is low, show a soft fallback instead of unstable AR anchors.
Audio should never auto-play without browser-permitted interaction.

## Code Style

Prefer TypeScript.
Prefer explicit types on API contracts and stores.
Keep functions small and testable.
Avoid magic numbers for sampling, confidence thresholds, and timing.
Put constants in dedicated config files.

## What Agents Should Do

Preserve the Svelte + Vite architecture.
Do not introduce SvelteKit.
Keep AR tracking and server localization loosely coupled.
Design for incremental delivery:
QR entry
camera permission
8th Wall tracking
mock localization API
content overlays
historical timeline switching

## What Agents Should Avoid

Do not tightly bind UI to one localization vendor.
Do not assume perfect GPS.
Do not assume immediate server response.
Do not hardcode route/building content in UI components.
Do not store unnecessary raw camera imagery.

## Definition of Done for New Features

A feature is considered done when:

- it works in the Svelte client app,
- it handles loading/error/fallback states,
- it does not block the scanning flow,
- it is typed,
- it is documented briefly if it adds a new API or state.

## First Implementation Priority

1. Basic Svelte SPA bootstrap
2. QR ID parsing
3.Session bootstrap API
4. Camera permission flow
5. 8th Wall initialization wrapper
6. Mock localization request/response
7. Simple fact overlay
8. Narration trigger
9. Timeline slider with mocked historical states