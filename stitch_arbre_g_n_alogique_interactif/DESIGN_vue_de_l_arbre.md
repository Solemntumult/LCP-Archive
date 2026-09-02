---
name: Heritage Modern
colors:
  surface: '#fff8f4'
  surface-dim: '#e1d8d2'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2eb'
  surface-container: '#f5ece5'
  surface-container-high: '#f0e7df'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#424844'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f8efe8'
  outline: '#727973'
  outline-variant: '#c2c8c2'
  surface-tint: '#496455'
  primary: '#173124'
  on-primary: '#ffffff'
  primary-container: '#2d4739'
  on-primary-container: '#98b5a3'
  inverse-primary: '#b0cdbb'
  secondary: '#7a5739'
  on-secondary: '#ffffff'
  secondary-container: '#fdcea9'
  on-secondary-container: '#795638'
  tertiary: '#2c2c26'
  on-tertiary: '#ffffff'
  tertiary-container: '#42423c'
  on-tertiary-container: '#b0aea6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ccead6'
  primary-fixed-dim: '#b0cdbb'
  on-primary-fixed: '#062014'
  on-primary-fixed-variant: '#324c3e'
  secondary-fixed: '#ffdcc1'
  secondary-fixed-dim: '#ebbe99'
  on-secondary-fixed: '#2d1601'
  on-secondary-fixed-variant: '#5f4024'
  tertiary-fixed: '#e5e2da'
  tertiary-fixed-dim: '#c9c6be'
  on-tertiary-fixed: '#1c1c17'
  on-tertiary-fixed-variant: '#474741'
  background: '#fff8f4'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Literata
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Literata
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is built on the concept of "Living History." It bridges the gap between dusty archives and modern digital storytelling. The brand personality is scholarly yet accessible, evoking the feeling of a well-preserved family heirloom. 

The aesthetic blends **Minimalism** with **Tactile/Skeuomorphic** accents. While the layout remains clean and systematic to handle complex data, the surfaces utilize subtle paper grains and soft depth to create an emotional, grounded experience. It targets users seeking to preserve their legacy with a sense of reverence and clarity.

## Colors
The palette is rooted in the natural world and historical materials.
- **Primary (Forest Green):** Used for primary actions, navigation headers, and representing the "growth" of the family tree.
- **Secondary (Walnut):** Used for accents, specialized buttons, and borders that signify strength and permanence.
- **Tertiary (Parchment):** The foundational surface color. It replaces pure white to reduce eye strain and provide a tactile, historical feel.
- **Neutral (Charcoal/Stone):** Used for secondary text and structural UI elements to ensure high legibility against the parchment background.
- **Status Colors:** Use a desaturated Sage for success, a muted Terracotta for errors, and an Ochre for warnings to maintain the "Heritage" aesthetic.

## Typography
The typography strategy employs a "History and Utility" contrast. 
- **Headings (Literata):** A scholarly serif that conveys authority and legacy. Use this for names, chapter titles, and major section headers.
- **Data & UI (Work Sans):** A grounded sans-serif designed for clarity. Use this for dates, descriptions, family tree nodes, and navigational elements. 
- **Hierarchy:** Maintain generous line heights to ensure long-form family stories are readable. Use the uppercase label style for metadata categories (e.g., "BORN," "DIED," "RELATIONSHIP").

## Layout & Spacing
This design system uses a **Fixed Grid** approach for content pages to maintain an "editorial" look, while the family tree visualization uses a **Fluid/Canvas** model.

- **Desktop:** 12-column grid with a 1280px max-width. 48px margins.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing should be generous to allow the "Parchment" background to act as negative space, preventing the complex hierarchical data from feeling overwhelming. Use `lg` and `xl` spacing to separate different family branches or historical eras.

## Elevation & Depth
Depth is handled through **Tonal Layers** and **Soft Ambient Shadows**. 
1. **The Base:** The lowest level is the Parchment (`#F5F2E9`) background, occasionally textured with a faint noise pattern.
2. **Cards & Nodes:** Family nodes and content cards are slightly lighter than the base or use a very thin Walnut (`#7D5A3C`) border at 10% opacity. 
3. **Shadows:** Use extremely soft, blurred shadows with a slight brown tint (`rgba(74, 69, 64, 0.08)`) to suggest paper sitting on a desk. Avoid heavy black shadows.
4. **Interactive States:** On hover, elements should lift slightly (increasing shadow spread) or transition to a slightly warmer fill.

## Shapes
The shape language is "Refined Organic." 
- Use **Soft (0.25rem)** corners for most UI components like input fields and small buttons to maintain a structured, professional feel.
- Use **Rounded (0.5rem)** for profile cards and image containers to evoke the look of vintage photo corners.
- **Decorative Elements:** Use circular frames for primary ancestor portraits to create a focal point within the geometric grid.

## Components
- **Tree Nodes:** Rectangular cards with a 1px Walnut border. Use a vertical Walnut line to indicate lineage. The primary name uses `headline-sm` in Forest Green.
- **Primary Buttons:** Solid Forest Green with white `label-md` text. Use a subtle "pressed" inner shadow effect to feel tactile.
- **Secondary Buttons:** Walnut outline with `label-md` text.
- **Photo Frames:** Images should have a 4px Parchment border and a soft outer shadow, mimicking a physical photograph.
- **Input Fields:** Bottom-border only or very light Parchment-tinted fills. Focused states use a Forest Green underline.
- **Timeline Markers:** Small Walnut circles connected by a thin Forest Green line, using `body-sm` for date labels.
- **Chips/Tags:** Used for "Verified Record" or "DNA Match." Use a desaturated Sage background with Forest Green text.