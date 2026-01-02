# Tasks: AuthFlowVisualizer

## Status Legend
- [ ] Not Started
- [~] In Progress
- [X] Completed
- [!] Blocked/Needs Clarification

## Notes & Clarifications
- Using **React Flow** for the canvas and node management.
- Using **js-yaml** for YAML handling.
- Using **Tailwind CSS** for styling.

## Phase 1: Setup
- [X] Initialize React + Vite project with Tailwind CSS and Lucide React
- [X] Install dependencies: `reactflow`, `js-yaml`, `clsx`, `tailwind-merge`
- [X] Define core TypeScript interfaces for Authflow steps based on the spec
- [X] Create basic layout: Sidebar (Forms/Controls), Canvas (Visual), Header (Flow selector)

## Phase 2: Core Engine & YAML Logic
- [X] Implement `AuthflowConverter`: Logic to convert between YAML and React Flow Nodes/Edges
- [X] Implement YAML Preview component with syntax highlighting (or basic pre/code)
- [X] Test: Verify that a basic JSON/JS object can be converted to YAML correctly

## Phase 3: Visual Canvas (React Flow)
- [X] Setup `FlowCanvas` component with custom Node types for different step types
- [X] Implement `StepNode`: A custom React Flow node showing step name and type
- [X] Implement branching logic: Nodes with multiple output handles for `one_of`
- [X] Implement edge logic: Standard flow and special `target_step` jump-back edges

## Phase 4: Property Editor (Sidebar)
- [X] Create `StepForm` to edit selected node properties (id, type, identification, authentication)
- [X] Implement dropdowns for valid `identification` and `authentication` types
- [X] Add logic to update the global flow state when form values change

## Phase 5: Flow Management & Export
- [X] Implement state management to handle multiple flows (signup, login, etc.)
- [X] Add "Export to YAML" button
- [X] Add "Import from YAML" functionality [depends on Phase 2]
- [X] Add "Reset" and "Clear" flow actions

## Phase 6: Polish & Testing
- [X] Add drag-and-drop from sidebar to add new steps
- [X] Style the canvas nodes to match Authgear branding
- [X] Verify all use case examples from the spec can be reconstructed in the tool
- [X] Final UI/UX polish (loading states, empty states)

## Phase 7: Recipes & Semantic Readability
- [X] Create `src/data/recipes.ts` with templates for Latte, Uber, and Google flows
- [X] Implement a "Recipe Browser" in the sidebar
- [X] Enhance node visualization to show more semantic data (e.g. "Primary Authentication")
- [X] Add "Load Recipe" logic to replace current flow state
