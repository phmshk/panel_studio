# Panel Studio (Technical Demo)

An interactive configuration tool designed for the precise positioning and layout of modular panels on defined surfaces.

## Context

This project is a technical demonstration. Originally developed as a specific test assignment, it has been refactored into an abstract planning tool to demonstrate architectural patterns, complex SVG interactions, and state management while preserving confidentiality.

## Live Demo

You can try the live application here: **[\[ Live Demo \]](http://phmshk.github.io/panel_studio/)**

## Project Overview

Panel Studio allows users to define surface dimensions, apply textures, and arrange panels within a grid system. It solves complex UI challenges such as coordinate mapping between the DOM and SVG, collision detection, and state persistence.

## Key Features

### Core Mechanics

- **SVG Coordinate System**: Implements bidirectional mapping between DOM pixels and SVG units to handle zooming and scaling correctly across different device sizes.
- **Custom Drag & Drop**: Built from scratch using the Pointer Events API and `setPointerCapture` to ensure stability and touch support without relying on heavy third-party drag-and-drop libraries.
- **Collision Detection**: A custom algorithm prevents panels from overlapping or being placed outside the surface boundaries in real-time.

### Smart Logic

- **Auto-placement**: An intelligent positioning system that automatically finds the nearest available slot for new panel groups.
- **Smart Tiling**: Automatically detects when a surface area exceeds the uploaded texture dimensions and generates a seamless pattern to maintain visual fidelity.
- **State Persistence**: Uses local storage synchronization to save the user's progress, including layout configuration and onboarding status.

## Tech Stack

**Core**

- React 19
- TypeScript
- Vite

**State Management**

- Zustand (Global state management)
- Immer (Immutable state updates)
- Zustand Persist (LocalStorage synchronization)

**Styling & UI**

- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- Lucide React (Iconography)

## Run locally

Ensure you have **Node.js** installed (v20+ recommended).

1.  **Clone the repository**

    ```bash
    git clone https://github.com/phmshk/panel_studio.git
    cd tech_task
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run development server**

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173`.

4.  **Build for production**
    ```bash
    npm run build
    ```
