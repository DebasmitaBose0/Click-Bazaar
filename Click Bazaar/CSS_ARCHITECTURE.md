# Background Icons CSS Architecture

## File Location
`/styles/category-backgrounds.css`

## CSS Structure Overview

### 1. Core Container Classes

#### `.category-bg-container`
- Position: `relative`
- Overflow: `hidden`
- Serves as wrapper for background effects

#### `.category-bg-icons`
- Position: `absolute`
- Covers full viewport: `inset: 0`
- Pointer events: `none` (non-interactive)
- Z-index: `0` (behind content)
- Contains all floating icons

#### `.category-content`
- Position: `relative`
- Z-index: `1` (above background)
- Contains actual page content

### 2. Animation Definitions

#### `@keyframes float`
```css
0%, 100%:
  - translateY: 0px
  - rotate: 0deg

50%:
  - translateY: -20px
  - rotate: 10deg
```

Variant: `float-reverse` (inverted Y-axis movement)

Duration: 6s base, with variants:
- `.icon-float`: 6s
- `.icon-float-slow`: 8s
- `.icon-float-fast`: 4s

### 3. Category-Specific Classes

Each category has:
- `.bg-[category-name]`: Background gradient
- `.icon-[icon-name]`: Icon styling

#### Format
```css
.bg-[category] {
  background: linear-gradient(135deg, rgba(..., 0.05) 0%, rgba(..., 0.05) 100%);
}

.icon-[category] {
  width: 80px;
  height: 80px;
  color: #[hex-code];
}
```

### 4. Responsive Design

#### Mobile Breakpoint (max-width: 768px)
- Icon opacity: `0.05` (reduced from 0.08)
- Icon sizes: `60px` (reduced from 80px)
- Maintains visual hierarchy while reducing animation intensity

## Implementation Details

### Gradient Direction
- Primary: `135deg` (top-left to bottom-right)
- Secondary: Varied directions for depth
- Uses multiple color stops for smooth transitions

### Color Opacity Values
- Background gradients: `0.05-0.10`
- Icon colors: `0.08` (desktop), `0.05` (mobile)
- Ensures icons visible but not overwhelming

### Z-index Hierarchy
```
Content (relative): z-10+
Background icons: z-0
Other elements: z-1+
Modals/overlays: z-100
```

### Animation Delays
Random delays per element: `0-2s`
Creates staggered animation effect for visual interest

## Category Reference

### Men's Wear
```css
.bg-mens-wear {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%);
}

.icon-shirt {
  width: 80px;
  height: 80px;
  color: #3b82f6;
}
```

### Women's Wear
```css
.bg-womens-wear {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(219, 39, 119, 0.05) 100%);
}

.icon-dress {
  width: 80px;
  height: 80px;
  color: #ec4899;
}
```

### Kids' Wear
```css
.bg-kids-wear {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%);
}

.icon-toy {
  width: 80px;
  height: 80px;
  color: #f59e0b;
}
```

[Additional categories follow similar pattern]

## Advanced Features

### 1. Animation Chaining
Multiple elements with staggered delays create flowing motion:
```javascript
animationDelay: `${Math.random() * 2}s`
```

### 2. Multiple Background Layers
Page backgrounds use multiple gradient divs:
- Layer 1: Large blur (120px) at top-left
- Layer 2: Large blur (120px) at bottom-right
- Layer 3: Medium blur (100px) at center
- Creates depth without overwhelming content

### 3. Responsive Optimization
Mobile devices receive:
- Fewer animated elements
- Reduced opacity for battery/performance
- Smaller icon dimensions
- Same animation duration for consistency

## Performance Considerations

### GPU-Accelerated Properties
- `transform` (translateY, rotate)
- `opacity`
- Avoid repainting: use `will-change` sparingly

### Render Optimization
- Fixed positioning prevents layout shifts
- Pointer-events: none prevents hit testing
- Blur filters use modern browser APIs

### Memory Management
- Icons created once, animated continuously
- CSS-based animations (not JavaScript)
- No dynamic class additions during animation

## Browser Support

### Full Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallback Behavior
- Gradients degrade gracefully
- Animations pause on unsupported browsers
- Blur effects use progressive enhancement

## Customization Guide

### Add New Category
1. Create new category colors
2. Define `.bg-[category-name]` class
3. Define `.icon-[icon-name]` class
4. Update CategoryBackground.tsx with icon mapping
5. Update TypeScript ProductCategory enum

### Modify Animation Speed
Change animation duration in:
- `.icon-float`: Base duration
- `.icon-float-slow`: +2s
- `.icon-float-fast`: -2s

### Adjust Colors
Modify RGBA values in gradient definitions:
- First color: Main category color
- Second color: Complementary color
- Opacity: 0.05-0.10 range recommended

## Code Quality

### Naming Conventions
- Classes: kebab-case (`category-bg-icons`)
- Custom properties: camelCase (when used)
- Colors: Hex or RGBA format

### Organization
- Grouped by category
- Animations at top
- Responsive rules at bottom
- Comments for major sections

## Testing Checklist

- [ ] Animations smooth on target browsers
- [ ] Mobile optimization working
- [ ] Responsive breakpoints correct
- [ ] Color contrast WCAG compliant
- [ ] No layout shifts during animation
- [ ] Performance acceptable on low-end devices
- [ ] Accessibility standards met

## Maintenance Notes

### Regular Updates
- Monitor browser compatibility
- Test on new device sizes
- Update color values with brand changes
- Adjust animation timing based on user feedback

### Known Limitations
- Some older mobile devices may not support all blur effects
- Reduce Motion preference should be respected
- Very low-end devices may disable animations

### Future Improvements
- Convert icons to inline SVG for better control
- Implement dynamic color theming
- Add Reduce Motion support
- Create CSS variable system for easy customization
