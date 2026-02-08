# Panel Studio (Technical Demo)

An interactive tool for configuring and arranging modular elements on 2D surfaces.

## Context

This project is a reworked version of a technical assignment I completed for a Junior Frontend Developer position.

I decided to refactor the original task into an abstract planning tool. My goal was to remove any specific business logic or design belonging to the company and focus purely on the engineering challenges. This allows me to demonstrate my skills in architecture, state management, and complex UI interactions in a neutral environment.

### What are we placing? ###
In this demo, the draggable elements represent abstract mounts (size 5x5 cm). 

### Where are we placing them? ###
We are placing them on a custom configurable surface, similar to a display panel you might find in a shop. The goal was to completely decouple the tool from its original context to focus on the abstract technical implementation.

This application is a small CAD-like tool that handles geometry, coordinate systems, and collision detection in the browser.

## Live Demo

You can try the live application here: **[\[ Live Demo \]](http://phmshk.github.io/panel_studio/)**

## Technical Challenges

Building this tool required solving several interesting problems beyond standard web development:

1. **SVG Coordinate System**: The application uses SVG for rendering to ensure perfect scaling between internal browser units and real-world centimeters. A major challenge was synchronizing the mouse position (screen pixels) with the internal SVG coordinate system. I wrote utilities to handle this translation so that drag-and-drop works accurately at any zoom level or screen size.
2. **Custom Drag & Drop**: Instead of using heavy external libraries, I built the drag-and-drop logic from scratch using the Pointer Events API. This gives me full control over the performance and ensures the app works smoothly on both mouse-based computers and touch-screen devices.
3. **Logic and Validation**: The app prevents users from making mistakes. It includes:
   - **Collision Detection**: Panels cannot be placed on top of each other.
   - **Boundary Checks**: Panels cannot be placed outside the surface area.
   - **Auto-placement**: If a user adds a panel without dragging it, the app automatically calculates the next available free space in the grid.

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
- shadcn/ui 
- Lucide React

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
