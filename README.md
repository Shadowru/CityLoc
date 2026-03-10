# CityLoc AR

Mobile web AR experience for city tourism routes. Built with Svelte, Vite, and 8th Wall integration.

## Overview

CityLoc AR transforms city exploration by overlaying historical information and facts on real-world buildings through augmented reality. Users scan QR codes at locations to unlock context-aware AR experiences.

## Features

- ✅ QR code entry point resolution
- ✅ Camera permission flow with fallback
- ✅ Mock 8th Wall AR tracking simulation
- ✅ Server-side localization simulation
- ✅ Fact overlays with text content
- ✅ Audio narration support
- ✅ Historical timeline slider (0, 50, 100, 150 years ago)
- ✅ Progressive confidence-aware UX
- ✅ Error handling and fallback states

## Architecture

Follows the specifications from `AGENTS.md`:
- **Frontend**: Svelte SPA (not SvelteKit)
- **Bundler**: Vite
- **AR Tracking**: 8th Wall (mock implementation)
- **State Management**: Svelte stores
- **API**: REST/JSON with TypeScript types

## App States

The application follows explicit state transitions:
- `boot` → `qr-resolved` → `camera-request` → `camera-ready`
- → `tracking` → `localizing` → `localized` (or `low-confidence`)
- → `historical-mode` (via timeline slider)

## Project Structure

```
src/
├── main.ts                    # App entry point
├── App.svelte                 # Root component with state router
├── components/                # Reusable UI components
├── stores/                    # Svelte stores for app state
│   ├── appState.ts           # Main state machine
│   ├── session.ts            # QR, localization, timeline data
│   └── localization.ts       # Localization progress
├── services/
│   ├── api/                  # API client and types
│   ├── ar/                   # 8th Wall integration
│   └── audio/                # Narration service
└── features/
    ├── qr-entry/             # Boot, camera permission, error
    ├── localization/         # Tracking, localizing, localized states
    ├── overlays/             # AR overlay components
    └── timeline/             # Historical mode and slider
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

### Development

The app runs at `http://localhost:5173`

#### HTTPS Development (for camera access testing)

Some browser features (camera, microphone, geolocation) require HTTPS in production. For local testing with HTTPS:

```bash
# Generate self-signed SSL certificates (first time)
npm run generate-cert

# Start development server with HTTPS
npm run dev:https
```

Then open `https://localhost:5173` in your browser.

**Note:** You'll need to accept the security warning for the self-signed certificate.

#### URL Parameters

- `qrId` - QR code identifier (e.g., `?qrId=demo_qr_001`)
- `demo` - Enable demo mode (e.g., `?demo=true`)
- `error` - Simulate error (e.g., `?error=Test+error+message`)

#### Mock Data

The app uses mock implementations for:
- 8th Wall AR tracking (simulated frames)
- Localization API (800ms delay with 92% confidence)
- Historical layer data
- Content facts and narration

## Implementation Notes

### AR Integration
The `src/services/ar/eighthWall.ts` provides a mock implementation of 8th Wall. In a real deployment, you would:
1. Obtain an 8th Wall API key
2. Load the 8th Wall script
3. Initialize XR session with camera feed
4. Handle real frame callbacks

### Localization Service
The mock localization service:
- Samples frames every 30 simulated frames
- Uploads to mock API with pose hints
- Returns confidence scores
- Triggers state transitions based on confidence

### Audio Narration
The audio service respects browser autoplay policies:
- Requires user interaction before playing
- Handles loading and error states
- Supports play/pause/stop

### Timeline Feature
The historical timeline:
- Slider with snap points (0, 50, 100, 150 years)
- Loads historical layer data on change
- Shows comparison between present and past
- Uses mock 3D model and texture URLs

## Next Steps for Production

1. **Real 8th Wall Integration**: Replace mock with actual 8th Wall initialization
2. **Backend API**: Implement real QR resolution and localization endpoints
3. **Content Management**: Connect to CMS for facts and narration
4. **Asset Pipeline**: Set up historical 3D model processing
5. **Analytics**: Add usage tracking and performance monitoring
6. **PWA**: Make installable with service workers
7. **Performance**: Optimize bundle size and AR rendering

## Browser Support

- Chrome 79+ (recommended for AR)
- Safari 13+ (iOS AR support)
- Edge 79+
- Firefox 72+ (limited AR support)

Mobile browsers with camera access required for full functionality.

## License

Proprietary - All rights reserved.

---

Built following the AGENTS.md specification for mobile web AR tourism experiences.