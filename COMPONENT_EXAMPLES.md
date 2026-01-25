# 🎯 Mobile-Responsive Component Examples

## How to Use the New Responsive Features in Your Components

---

## 1. Product Grid (Shop Page)

### ✅ Responsive Grid Example
```tsx
{/* Before - Fixed 4 columns (breaks on mobile) */}
<div className="grid grid-cols-4 gap-6">
  {products.map(product => <ProductCard key={product.id} product={product} />)}
</div>

{/* After - Auto-fitting columns */}
<div className="grid-auto-fit">
  {products.map(product => <ProductCard key={product.id} product={product} />)}
</div>
```

**What Happens:**
- Mobile (320px): 1 column
- Tablet (768px): 2-3 columns
- Desktop (1280px): 4 columns
- **Automatically!** No media queries needed.

---

## 2. Hero Section with Image

### ✅ Responsive Hero
```tsx
{/* Before - Fixed height (breaks layout) */}
<section style={{ height: '600px' }}>
  <img src={heroImage} style={{ height: '100%' }} />
</section>

{/* After - Flexible height */}
<section className="min-h-fluid-lg py-fluid">
  <img src={heroImage} className="w-full h-auto object-cover" />
</section>
```

**CSS Used:**
```css
.min-h-fluid-lg { min-height: clamp(400px, 70vh, 700px); }
.py-fluid { padding: clamp(16px, 4vw, 32px) 0; }
```

---

## 3. Feature Cards

### ✅ Responsive Feature Cards
```tsx
{/* Before - Fixed 4 columns */}
<div className="grid grid-cols-4 gap-8">
  {features.map(feature => (
    <div key={feature.id} className="p-8">
      {feature.icon}
      <h3>{feature.title}</h3>
    </div>
  ))}
</div>

{/* After - Responsive grid */}
<div className="grid-auto-fit-lg gap-fluid">
  {features.map(feature => (
    <div key={feature.id} className="p-fluid">
      {feature.icon}
      <h3 className="text-fluid-lg">{feature.title}</h3>
    </div>
  ))}
</div>
```

**Responsive Behavior:**
- 320-768px: 1 column
- 768-1024px: 2 columns  
- 1024px+: 3 columns

---

## 4. Testimonials Carousel

### ✅ Responsive Carousel
```tsx
<div className="flex-container gap-fluid overflow-x-auto snap-x">
  {testimonials.map(testimonial => (
    <div key={testimonial.id} className="w-fluid-md flex-shrink-0 snap-start">
      <div className="p-fluid bg-white rounded-2xl">
        <p className="text-fluid-sm">{testimonial.text}</p>
        <p className="text-fluid-xs font-bold mt-4">{testimonial.author}</p>
      </div>
    </div>
  ))}
</div>
```

**Mobile Friendly:**
- Touch-scrollable on mobile
- Proper spacing maintained
- Readable text sizes

---

## 5. Call-to-Action Button

### ✅ Touch-Friendly Button
```tsx
{/* Before - Small button */}
<button style={{ padding: '5px 15px', fontSize: '14px' }}>
  Shop Now
</button>

{/* After - Touch-friendly */}
<button className="w-full sm:w-auto bg-indigo-600 text-white font-bold rounded-lg min-h-[44px] px-8 hover:bg-indigo-700">
  Shop Now
</button>
```

**Touch Features:**
- Minimum 44x44px tap target
- 16px font (prevents mobile zoom)
- Full-width on mobile
- Padding: 12px 18px

---

## 6. Navigation/Header

### ✅ Responsive Navigation
```tsx
{/* Navigation Items */}
<nav className="flex-container gap-fluid px-fluid">
  <a href="/" className="nav-link active">Home</a>
  <a href="/shop" className="nav-link">Shop</a>
  <a href="/about" className="nav-link">About</a>
</nav>

{/* Mobile Menu Button */}
<button className="navbar-icon-btn md:hidden">
  ☰
</button>
```

**Responsive:**
- Buttons stack on mobile
- 44x44px minimum size
- Adjust padding based on screen

---

## 7. Forms

### ✅ Responsive Form
```tsx
<form className="w-fluid-md mx-auto-fluid space-y-4">
  <div className="flex-container gap-fluid-sm">
    <input 
      type="text" 
      placeholder="First Name"
      className="flex-1"
    />
    <input 
      type="text" 
      placeholder="Last Name"
      className="flex-1"
    />
  </div>
  
  <input 
    type="email" 
    placeholder="Email"
    className="w-full"
  />
  
  <textarea 
    placeholder="Message"
    rows={5}
    className="w-full"
  />
  
  <button type="submit" className="w-full">
    Submit
  </button>
</form>
```

**Form Features:**
- Full-width on mobile
- Min-height 44px
- Font-size 16px (no zoom)
- Touch-friendly spacing

---

## 8. Stats/Metrics Section

### ✅ Responsive Stats
```tsx
{/* Before - Fixed 4 columns */}
<div className="grid grid-cols-4 gap-8">
  {stats.map(stat => (
    <div key={stat.id} className="text-center">
      <p className="text-4xl font-bold">{stat.value}</p>
      <p className="text-sm text-gray-600">{stat.label}</p>
    </div>
  ))}
</div>

{/* After - Responsive */}
<div className="grid-auto-fit gap-fluid text-center">
  {stats.map(stat => (
    <div key={stat.id}>
      <p className="text-fluid-4xl font-bold">{stat.value}</p>
      <p className="text-fluid-xs text-gray-600">{stat.label}</p>
    </div>
  ))}
</div>
```

---

## 9. Modal/Dialog

### ✅ Responsive Modal
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
  <div className="w-fluid-md bg-white rounded-2xl p-fluid">
    <h2 className="text-fluid-2xl mb-4">Modal Title</h2>
    <p className="text-fluid-base mb-6">Modal content here...</p>
    
    <div className="flex gap-fluid">
      <button className="flex-1 bg-gray-200 text-black rounded-lg p-3">
        Cancel
      </button>
      <button className="flex-1 bg-indigo-600 text-white rounded-lg p-3">
        Confirm
      </button>
    </div>
  </div>
</div>
```

**Responsive:**
- 90vw width on mobile (with max-width)
- Full-width buttons
- Proper padding on all screens

---

## 10. Image Gallery

### ✅ Responsive Image Gallery
```tsx
<div className="grid-auto-fit-sm gap-fluid">
  {images.map(image => (
    <div key={image.id} className="aspect-video overflow-hidden rounded-lg">
      <img 
        src={image.url} 
        alt={image.alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform"
      />
    </div>
  ))}
</div>
```

**Features:**
- Images scale down on mobile
- Aspect ratio maintained
- Touch-friendly sizing

---

## Common Responsive Patterns

### Pattern 1: Two-Column Layout (Collapses to 1)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-fluid">
  <div>{leftContent}</div>
  <div>{rightContent}</div>
</div>
```

### Pattern 2: Container with Max-Width
```tsx
<section className="w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
  {content}
</section>
```

### Pattern 3: Auto-Fit Cards
```tsx
<div className="grid-auto-fit gap-fluid">
  {items.map(item => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

### Pattern 4: Responsive Typography
```tsx
<h1 className="text-fluid-3xl font-bold">
  Scales from 2.25rem to 3rem
</h1>
<p className="text-fluid-base">
  Scales from 1rem to 1.125rem
</p>
```

### Pattern 5: Flexible Spacing
```tsx
<div className="p-fluid gap-fluid">
  {/* Padding and gap scale automatically */}
</div>
```

---

## Utility Classes Reference

### Grid
```css
.grid-auto-fit        /* 220px items */
.grid-auto-fit-sm     /* 150px items */
.grid-auto-fit-lg     /* 280px items */
.gap-fluid            /* clamp(16px, 3vw, 24px) */
.gap-fluid-sm         /* clamp(12px, 2vw, 18px) */
```

### Typography
```css
.text-fluid-xs        /* clamp(0.75rem, 1.5vw, 0.875rem) */
.text-fluid-sm        /* clamp(0.875rem, 2vw, 1rem) */
.text-fluid-base      /* clamp(1rem, 2.5vw, 1.125rem) */
.text-fluid-lg        /* clamp(1.125rem, 3vw, 1.5rem) */
.text-fluid-xl        /* clamp(1.5rem, 4vw, 2rem) */
.text-fluid-2xl       /* clamp(1.875rem, 5vw, 2.25rem) */
.text-fluid-3xl       /* clamp(2.25rem, 6vw, 3rem) */
.text-fluid-4xl       /* clamp(3rem, 7vw, 3.75rem) */
```

### Spacing
```css
.p-fluid              /* clamp(16px, 4vw, 32px) */
.p-fluid-sm           /* clamp(12px, 2vw, 20px) */
.p-fluid-lg           /* clamp(24px, 6vw, 48px) */
.px-fluid             /* horizontal padding */
.py-fluid             /* vertical padding */
.m-fluid              /* margin */
```

### Width/Height
```css
.w-fluid-sm           /* max-width: clamp(280px, 80vw, 400px) */
.w-fluid-md           /* max-width: clamp(320px, 90vw, 600px) */
.w-fluid-lg           /* max-width: clamp(400px, 95vw, 800px) */
.w-fluid-xl           /* max-width: clamp(480px, 98vw, 1200px) */
.min-h-fluid          /* clamp(300px, 60vh, 500px) */
.min-h-fluid-lg       /* clamp(400px, 70vh, 700px) */
```

### Containers
```css
.container            /* Responsive max-width container */
.mx-auto-fluid        /* Centered with responsive max-width */
.safe-area-inset      /* Respects phone notches */
.no-h-scroll          /* Prevents horizontal scroll */
```

---

## Pro Tips

✅ **Always test on real devices**
- Chrome DevTools is good, but real devices are better

✅ **Use 16px font size for inputs**
- Prevents mobile auto-zoom

✅ **Make touch targets 44x44px minimum**
- WCAG accessibility standard

✅ **Test with zoom at 200%**
- Ensures responsive layout holds up

✅ **Check both portrait and landscape**
- Different aspect ratios matter

✅ **Reduce animations on mobile**
- Already done in your CSS for performance

✅ **Test on slow 3G**
- Ensure images load properly

---

## 🚀 You're Ready!

Use these patterns and utilities in your components for a **fully responsive, mobile-friendly** experience across all devices! 📱💻✨
