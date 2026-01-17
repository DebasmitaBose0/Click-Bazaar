# Category Background Icons - Visual Reference Guide

## Page-by-Page Background Design

### 🛍️ Shop Page (Category-Specific)
Dynamically changes based on selected category:
- **Men's Wear**: Blue gradient with shirt pattern icons
- **Women's Wear**: Pink gradient with dress silhouette icons
- **Kids' Wear**: Amber gradient with toy/child icons
- **Men's Watches**: Slate gray gradient with watch face icons
- **Women's Watches**: Rose gradient with elegant watch icons
- **Mobile**: Indigo gradient with smartphone icons
- **Electronics**: Violet gradient with laptop/device icons
- **Home**: Emerald gradient with house/furniture icons
- **Grocery**: Green gradient with food/fruit icons
- **Beauty**: Fuchsia gradient with cosmetics/sparkle icons

### 🛒 Cart Page
**Gradient**: Indigo → Purple
**Animation**: Dual floating layers with 2-second offset
**Icons**: Shopping bag, cart, gift icons
**Feel**: Calm, trustworthy, shopping-focused

**Empty State Special Styling**:
- Larger background effect
- Centered message with enhanced visibility
- Branded button styling

### ✅ Checkout Page
**Form State**:
- **Gradient**: Indigo → Blue
- **Animation**: Smooth flowing parallax
- **Icons**: Payment, security, delivery icons
- **Feel**: Professional, secure

**Success State** (Different Theme):
- **Gradient**: Green → Emerald
- **Animation**: Celebrating success with brighter colors
- **Icons**: Checkmark, celebration elements
- **Feel**: Positive, confirmatory
- **Interactive**: Close button and action buttons with enhanced styling

### ❤️ Wishlist Page
**Gradient**: Pink → Rose → Red
**Animation**: Gentle floating with heart-themed icons
**Icons**: Heart, love, favorites
**Feel**: Personal, emotional connection

**Empty State**:
- Pink-themed background with emphasis
- Heart icon in larger size
- Warm, inviting call-to-action button

### 📦 Tracking Page
**Loading State**:
- **Gradient**: Blue → Cyan → Indigo
- **Animation**: Smooth continuous animations

**Error State**:
- **Gradient**: Red → Orange → Yellow
- **Feel**: Alert but not alarming

**Content State**:
- **Gradient**: Blue → Cyan → Indigo
- **Icons**: Truck, package, location, delivery icons
- **Feel**: Movement, progress, delivery

### 📋 Order History Page
**Gradient**: Slate → Indigo → Purple
**Animation**: Multiple layer parallax effects
**Icons**: Package, delivery, tracking icons
**Feel**: Organized, historical view

**Empty State**:
- Subtle background with dashed border
- Package icon with reduced opacity
- Encouraging "Explore Market" button

**Guest Tracking**:
- Same indigo theme for consistency
- Input field with enhanced styling
- Easy search functionality

### 👤 Profile Page
**Gradient**: Purple → Blue
**Animation**: Gentle floating animations
**Icons**: User, profile, data-related icons
**Feel**: Personal, user-focused

**Loading State**:
- Animated spinner with matching gradient background
- Smooth transitions

## Animation Specifications

### Floating Animation
```css
Duration: 4-8 seconds (variable per element)
Easing: ease-in-out
Movement: Vertical (±20px)
Rotation: ±10 degrees
Opacity: 0.05-0.08 on backgrounds
```

### Color Gradients
**Format**: `from-[color]-[shade]/[opacity] via-[color]-[shade]/[opacity] to-[color]-[shade]/[opacity]`

**Opacity Levels**:
- Background shapes: 10-20% opacity
- Icons: 5-8% opacity
- Prevents distraction while adding visual depth

### Responsive Behavior
- **Desktop**: Full animations, standard size icons
- **Tablet**: Slightly reduced animation intensity
- **Mobile**: Reduced opacity (5%), smaller icons (60px vs 80px)

## Icon Mapping by Category

| Category | Primary Icon | Secondary Icons |
|----------|-------------|-----------------|
| Men's Wear | Shirt | Coat, Pants |
| Women's Wear | Dress | Skirt, Heart |
| Kids' Wear | Baby | Toy, Gift |
| Men's Watches | Watch | Clock, Time |
| Women's Watches | Heart | Watch, Sparkles |
| Mobile | Smartphone | Mobile, Signal |
| Electronics | Laptop | TV, Camera, Gadget |
| Home | Home | Chair, Door, House |
| Grocery | Utensils | Apple, Carrot, Food |
| Beauty | Sparkles | Heart, Flower, Shine |

## Color Palette Reference

### Primary Colors
- **Blue**: #3b82f6 (Men's Wear, Mobile)
- **Pink**: #ec4899 (Women's Wear, Wishlist)
- **Amber**: #f59e0b (Kids' Wear)
- **Slate**: #64748b (Men's Watches)
- **Rose**: #e11d48 (Women's Watches)
- **Violet**: #8b5cf6 (Electronics)
- **Green**: #22c55e (Grocery)
- **Emerald**: #10b981 (Home)
- **Fuchsia**: #d946ef (Beauty)
- **Indigo**: #6366f1 (Checkout, Default)

### Gradient Opacity
- **Background Fill**: 5-10% opacity
- **Accent Elements**: 15-20% opacity
- **Text Overlay**: 80-100% opacity for readability

## Implementation Notes

### CSS Classes Used
- `.category-bg-container`: Main wrapper
- `.category-bg-icons`: Icon container
- `.icon-float`: Individual floating icon
- `.icon-float-slow`: Slow animation variant
- `.icon-float-fast`: Fast animation variant
- `.bg-[category]`: Category-specific background

### Tailwind Classes
- Gradients: `bg-gradient-to-br`, `bg-gradient-to-tr`, `from-*`, `via-*`, `to-*`
- Animations: `animate-pulse`, custom `float` animations
- Effects: `blur-[120px]`, `backdrop-blur-xl`
- Positioning: `fixed`, `absolute`, `relative`

## Performance Considerations

1. **GPU Acceleration**: Animations use `transform` and `opacity` for best performance
2. **Reduced Motion**: Respects `prefers-reduced-motion` preference
3. **Mobile Optimization**: Reduced number of floating elements on mobile
4. **Viewport**: Background animations fixed to viewport, not scrolling

## Accessibility

- Animations are subtle and not distracting
- Text contrast maintained (WCAG AA compliant)
- No critical information conveyed through animation alone
- Color not the only distinguishing feature
- Alt text available for all interactive elements

## Future Enhancement Ideas

1. **Season-Based Themes**: Update colors for holidays
2. **Time-Based Variations**: Different themes for day/night
3. **User Preference**: Dark mode support
4. **Interactive Elements**: Mouse-tracking animations
5. **Custom Icons**: SVG icons for better performance
6. **Accessibility**: Reduced motion preference support
