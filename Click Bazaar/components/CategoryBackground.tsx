import React, { useMemo } from 'react';
import { 
  Shirt, Baby, Watch, Smartphone, Laptop, Home, Sparkles,
  Heart, ShoppingBag, Utensils
} from 'lucide-react';

interface CategoryBackgroundProps {
  category: string;
}

const getCategoryIcons = (category: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    "Men's Wear": Shirt,
    "Women's Wear": ShoppingBag,
    "Kids' Wear": Baby,
    "Men's Watches": Watch,
    "Women's Watches": Heart,
    "Mobile": Smartphone,
    "Electronics": Laptop,
    "Home": Home,
    "Grocery": Utensils,
    "Beauty": Sparkles,
  };

  return iconMap[category] || ShoppingBag;
};

const getCategoryBgClass = (category: string) => {
  const classMap: { [key: string]: string } = {
    "Men's Wear": 'bg-mens-wear',
    "Women's Wear": 'bg-womens-wear',
    "Kids' Wear": 'bg-kids-wear',
    "Men's Watches": 'bg-mens-watches',
    "Women's Watches": 'bg-womens-watches',
    "Mobile": 'bg-mobile',
    "Electronics": 'bg-electronics',
    "Home": 'bg-home',
    "Grocery": 'bg-grocery',
    "Beauty": 'bg-beauty',
  };

  return classMap[category] || 'bg-mens-wear';
};

// Generate random positions for floating icons
const generateIconPositions = (count: number = 24) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    top: Math.random() * 105 - 2.5, // Slightly wider range to bleed off edges
    left: Math.random() * 105 - 2.5,
    delay: Math.random() * 5,
    size: Math.random() > 0.5 ? 60 : 100,
    duration: 8 + Math.random() * 10,
  }));
};

export const CategoryBackground: React.FC<CategoryBackgroundProps> = ({ category }) => {
  const Icon = getCategoryIcons(category);
  const bgClass = getCategoryBgClass(category);
  const positions = useMemo(() => generateIconPositions(24), []);

  return (
    <div className={`category-bg-container ${bgClass}`}>
      <div className="category-bg-icons">
        {positions.map((pos) => (
          <div
            key={pos.id}
            className="icon-float"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
              width: pos.size,
              height: pos.size,
            }}
          >
            <Icon size={pos.size - 20} strokeWidth={0.5} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { getCategoryIcons, getCategoryBgClass };
