# Feature: AuthFlowVisualizer

## Purpose & User Problem
Authgear's Authentication Flows are powerful but complex to configure manually in YAML. Users need a visual way to understand the branching logic of `steps`, `one_of`, and `target_step` to avoid configuration errors and speed up development.

## Success Criteria
- Interactive UI to build and visualize Authgear Authflow YAML.
- Real-time YAML generation that matches the [Authflow Spec](https://github.com/authgear/authgear-server/blob/main/docs/specs/authentication-flow.md).
- Support for complex branching (one_of) and nested steps.

## Scope
### In Scope
- Visual node-based editor for creating steps.
- Form-based property editing for each step/branch.
- Export to YAML.
- Support for `signup_flows`, `login_flows`, `signup_login_flows`, `reauth_flows`, and `account_recovery_flows`.
- **Pre-configured Recipes**: A library of sample flows (e.g., Uber, Google, Latte) to showcase Authgear's flexibility.

### Out of Scope
- Direct deployment to Authgear (standalone tool only for now).
- Multi-user collaboration/saving to cloud.

## Requirements
### Functional
- Users can add/remove steps.
- Users can define `one_of` branches for `identify` and `authenticate` steps.
- Visualization must show the flow direction and jump-backs (target_step).
- Validation of required fields per step type (e.g., `identification` or `authentication` values).

### Non-Functional
- Modern React SPA.
- Responsive layout with a side-by-side view (Visual Editor | YAML Output).

## Technical Considerations
- **React Flow** for the canvas.
- **js-yaml** for YAML generation.
- **Tailwind CSS** for styling.
- **Lucide React** for icons.

## User Scenarios
1. **Developer creating a new signup flow**: Developer adds an `identify` step, selects `email`, adds a `create_authenticator` step for password, and sees the YAML update in real-time.
2. **Visualizing existing logic**: Developer wants to see how a `target_step` jump looks visually to verify there are no infinite loops.

## Assumptions
- The tool follows the Authflow API spec v1.
