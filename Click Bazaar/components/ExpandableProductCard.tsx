import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { Product } from "../types";
import { AppContext, formatCurrency } from "../shared";
import { Heart, ShoppingCart, Loader2, Star, X, Eye } from "lucide-react";

interface ExpandableProductCardProps {
  product: Product;
}

export const ExpandableProductCard: React.FC<ExpandableProductCardProps> = ({ product }) => {
  const context = useContext(AppContext);
  const [adding, setAdding] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 4.5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    context?.addToCart(product.id, 1);
    setTimeout(() => setAdding(false), 700);
  };

  React.useEffect(() => {
    if (showQuickView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showQuickView]);

  return (
    <>
      {/* CARD */}
      <div className="w-full max-w-[340px] sm:max-w-[320px] bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden relative">
        {/* top buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            context?.toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
        >
          <Heart
            size={16}
            className={
              context?.wishlist.includes(product.id)
                ? "fill-pink-500 text-pink-500"
                : "text-gray-400"
            }
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickView(true);
          }}
          className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
        >
          <Eye size={16} className="text-gray-700" />
        </button>

        {/* image */}
        <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
        </div>

        {/* content */}
        <div className="p-4">
          <h3 className="font-extrabold text-gray-900 text-sm sm:text-base line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-gray-800">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviews?.length || 0})</span>
          </div>

          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="font-black text-indigo-600 text-base">
              {formatCurrency(product.price)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-4 w-full py-3 rounded-xl bg-black text-white font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {adding ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {showQuickView &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowQuickView(false)}
          >
            <div
              className="bg-white w-full max-w-[900px] rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQuickView(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-gray-50 p-6 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full max-h-[320px] object-contain"
                  />
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {product.category}
                  </p>

                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                    {product.name}
                  </h2>

                  <p className="text-indigo-600 font-black text-lg mt-3">
                    {formatCurrency(product.price)}
                  </p>

                  <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                    {product.description}
                  </p>

                  <button
                    onClick={(e) => handleAddToCart(e)}
                    disabled={adding}
                    className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {adding ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ShoppingCart size={16} />
                    )}
                    {adding ? "Adding..." : "Add to Bag"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
