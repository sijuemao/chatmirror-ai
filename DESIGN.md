# ChatMirror visual system

## Direction

ChatMirror is an operate-first conversation tool, not a marketing dashboard. The interface is a digital cutting bench: a conversation is a sequence of editable frames, the current point is marked by orange tape, and the inspector exposes the style decisions behind a reply.

## Palette

- Workbench: `#101113`, `#17191B`, `#1D2023`
- Paper: `#EEE9DF`, `#E2DCD1`
- One accent tape orange: `#F27B3D`
- Semantic online green: `#63D5A4`
- Error: `#E06B70`

## Type

- UI text: DM Sans with Noto Sans SC fallback
- Labels and metadata: IBM Plex Mono

## Components

- Dark workbench shell with three zones: object rail, conversation bench, style inspector.
- Orange is reserved for the active frame, primary action, and focused controls.
- Conversation bubbles use a 10px radius. Sender messages use paper-orange; simulated messages use a raised dark frame.
- The conversation rail uses persistent frame stops and one current tape marker.
- Inspector sections use dividers and proximity instead of nested cards.
- Import workbench uses source chips, a drop zone, live stats, and a consent gate to make batch input legible before analysis.
- Media files appear as compact evidence rows; the interface distinguishes selected source material from generated chat output.

## Motion and states

- Motion is limited to message entry, modal entry, hover, and focus.
- Reduced motion is supported.
- Empty emoji, typing, API error toast, destructive data action, and AI warning are visible states.

## Responsive behavior

- Desktop uses three zones.
- Tablet narrows the object rail and inspector.
- Mobile hides the rail and inspector to protect the core chat task while keeping the composer and primary controls reachable.
