# Visual Design Reference

**Last reviewed:** 2026-06-21  
**Status:** active  
**Use when:** starting a new UI, dashboard, site, game menu, or visual project unless the project has a stronger brand guide.

This is Kayden's preferred default color palette. The Command Information Center dashboard is the current working reference for the intended dark-mode feel.

## Authority

Use this order when design guidance conflicts:

1. Current user request.
2. Project-specific design docs, screenshots, or brand requirements.
3. This default visual design reference.
4. Generic framework defaults.

## Palette

### Neutrals

| Name | Hex | Role |
|---|---:|---|
| Onyx | `#0A0A0A` | Page background, deepest surfaces |
| Carbon Black | `#191919` | Main app surfaces, panels, cards |
| Iron Grey | `#474747` | Borders, dividers, muted fills |
| Bright Snow | `#F7F7F7` | Primary text and high-contrast foreground |

### Accents

| Name | Hex | Role |
|---|---:|---|
| Scarlet Rush | `#DE2B31` | Errors, urgent status, destructive actions |
| Vintage Lavender | `#885A89` | Secondary accent, creative/system identity |
| Medium Jungle | `#4DAA57` | Success, healthy status, positive movement |
| Cerulean | `#3A7CA5` | Primary action, links, selected state |
| Old Gold | `#E0BD3E` | Warnings, highlights, attention without danger |
| Rose Punch | `#CF4F84` | Personal/social/music/media accents |
| Blaze Orange | `#FF6201` | High-energy CTA, active automation, hot status |
| Vibrant Turquoise | `#1ABCBD` | Fresh data, live state, sync/connection status |

## Default Dark-Mode Usage

- Use `#0A0A0A` for the app/page background.
- Use `#191919` for primary panels and tool surfaces.
- Use `#474747` for borders, muted strokes, separators, and disabled fills.
- Use `#F7F7F7` for primary text.
- Pick one primary accent per project or screen, then reserve the rest for semantic status.
- Avoid using all accents at equal weight on the same screen; the result should feel controlled, not noisy.
- Keep red, yellow, and green tied to state unless the user asks for a more expressive palette.

## Iconography

- Do not use emoji as icons in apps, dashboards, sites, tools, or game UI.
- Use a real icon set when an interface needs icons. Prefer established free icon libraries already present in the project, such as Lucide, Heroicons, Material Symbols, Font Awesome, or framework-native icons.
- Icons should be visually identifiable before reading the label. Use recognizable shapes, clear contrast, and the palette accents above to make important actions and states stand out.
- Use color intentionally: status icons should match their state, primary actions should use the chosen project accent, and inactive icons should stay muted.
- If no icon library exists yet, add the smallest reasonable free icon dependency for the stack instead of substituting emoji.

## CSS Token Starter

```css
:root {
  --color-onyx: #0a0a0a;
  --color-carbon-black: #191919;
  --color-iron-grey: #474747;
  --color-bright-snow: #f7f7f7;

  --color-scarlet-rush: #de2b31;
  --color-vintage-lavender: #885a89;
  --color-medium-jungle: #4daa57;
  --color-cerulean: #3a7ca5;
  --color-old-gold: #e0bd3e;
  --color-rose-punch: #cf4f84;
  --color-blaze-orange: #ff6201;
  --color-vibrant-turquoise: #1abcbd;
}
```
