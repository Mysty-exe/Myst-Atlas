# Myst Atlas

A real time 3D satellite tracking and orbital visualization platform built with C++, WebAssembly, React, and Three.js.

Myst Atlas uses real satellite TLE data and the SGP4 propagation model to calculate and visualize satellite positions around Earth. The project combines accurate orbital calculations with an interactive 3D environment for exploring satellites, trajectories, and orbital information.

## Core Features

- Real satellite tracking using TLE data
- SGP4 orbital propagation
- Interactive 3D Earth visualization
- Satellite search and filtering
- Satellite information panels
- Orbit trajectory visualization
- Time controls with simulation speed adjustment
- Satellite following camera system
- Reverse geocoded satellite location tracking
- WebAssembly powered C++ orbital engine

## Technical Details

### Orbital Mechanics

- Uses SGP4 propagation for satellite position calculations
- Parses Two Line Element (TLE) data
- Calculates satellite position and velocity
- Converts orbital coordinates into latitude and longitude

### Rendering

- Three.js and WebGL based rendering
- Instanced rendering for large satellite groups
- Interactive camera controls
- Orbit path visualization

### Architecture

```
frontend/
React UI
Three.js rendering
User interaction

backend/
C++ orbital calculations
SGP4 propagation

wasm/
WebAssembly bindings
```

## Live Demo

Try Myst Atlas here: https://myst-atlas.vercel.app/

## Possible Future Work

- Ground station visualization
- Satellite pass predictions
- Satellite imagery integration
- Weather and cloud overlays

## Notes

- Accuracy depends on the quality and age of the TLE data.
- Rendering uses scaled visualization while maintaining orbital calculations.
- First load may take a while as a lot of data is being processed.
