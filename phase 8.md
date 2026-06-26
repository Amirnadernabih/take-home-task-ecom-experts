# Phase 8 — Plan, Sensors, and Extra Protection Step Content

**Recommended Cursor model:** Claude Sonnet / Auto.

## Goal
Complete the content inside steps 2, 3, and 4 while preserving the design and data-driven approach.

## Context
The screenshots mostly emphasize the camera step, but the task still requires a 4-step accordion:
1. Choose your cameras
2. Choose your plan
3. Choose your sensors
4. Add extra protection

The Notion task says the review panel loads with pre-populated sensors, accessory, and plan. It also says those have no add-control in this particular view. That means they must exist in state and review. For the accordion content, implement simple, polished cards or rows for these steps without overcomplicating the design.

## Exact work
1. Reuse existing `ProductGrid`, `ProductCard`, and `QuantityStepper` where possible.
2. Render step content by category:
   - cameras
   - plan
   - sensors
   - accessories
3. For the plan card:
   - show `Cam Unlimited`
   - show compare price `$12.99/mo`
   - show active price `$9.99/mo`
   - show selected state by default
   - keep quantity fixed to 1 unless the data says otherwise
4. For sensor cards:
   - show Wyze Sense Motion Sensor
   - show Wyze Sense Hub (Required)
   - required hub cannot drop below 1
5. For extra protection:
   - show Wyze MicroSD Card (256GB)
6. Use generated simple placeholder icons for sensors/accessory if no dedicated images exist.
   - Do not use unrelated remote images.
   - Do not use the Figma screenshots as thumbnails.
   - Simple inline SVG or CSS icon blocks are fine.

## Fidelity
- These steps should look like part of the same UI system.
- Keep card style consistent with the camera cards.
- Keep spacing compact.
- The open step must end with a `Next:` button unless it is the final step.
- The final step can show a button like `Review your system`.

## State and counts
- Step selected counts must update for plan/sensors/accessory too.
- Required selected items count as selected.
- If quantity becomes 0, the item should disappear from review unless required/min quantity prevents that.

## Acceptance checklist
- Steps 2, 3, and 4 have meaningful content.
- Counts are correct for all steps.
- Review panel updates when quantities change from these steps.
- Required hub stays selected.
- Build passes.
