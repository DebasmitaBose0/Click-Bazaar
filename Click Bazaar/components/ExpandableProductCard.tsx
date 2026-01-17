import React, { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../types';
import { AppContext, formatCurrency } from '../shared';
import { Heart, ShoppingCart, Loader2, Minus, Plus, Star, X, Eye, Truck, Check, Sparkles } from 'lucide-react';

interface ExpandableProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

export const ExpandableProductCard: React.FC<ExpandableProductCardProps> = ({ product }) => {
  const context = useContext(AppContext);
  const [adding, setAdding] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Auto-scroll to top when preview is opened
  React.useEffect(() => {
    if (showQuickView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuickView]);
  
  const averageRating = product.reviews && product.reviews.length > 0 
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length 
    : 4.5; // Default for products without reviews

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    context?.addToCart(product.id, 1);
    setTimeout(() => {
      setAdding(false);
    }, 800);
  };

  return (
    <>
      <style>{`
        .ultra-flex-main {
          height: 25em;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2em;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }

        .card {
          position: relative;
          top: 2em;
          width: 12.5em;
          height: 7.5em;
          background: white;
          transition: .4s ease-in-out;
          border-radius: 15px;
          box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px;
          overflow: hidden;
          z-index: 2;
        }

        .heading {
          position: relative;
          color: black;
          font-weight: bold;
          font-size: 0.95em;
          padding-top: 4.5em;
          padding-left: 1em;
          padding-right: 1em;
          transition: .4s ease-in-out;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          box-sizing: border-box;
          z-index: 2;
        }

        .details {
          position: relative;
          color: #4b5563;
          font-size: 0.65em;
          padding-top: 1em;
          padding-left: 0.8em;
          padding-right: 0.8em;
          transition: .4s ease-in-out;
          line-height: 1.5;
          opacity: 0;
          height: 0;
          overflow: hidden;
        }

        .price {
          position: relative;
          color: black;
          font-weight: bold;
          font-size: 0.8em;
          padding-top: 0;
          padding-left: 1.5em;
          transition: .4s ease-in-out;
          opacity: 0;
          height: 0;
          overflow: hidden;
        }

        .btn1 {
          position: relative;
          border: none;
          outline: none;
          background-color: black;
          color: white;
          font-size: 0.65em;
          width: 85%;
          padding: 0.8em 0.6em;
          border-radius: 10px;
          left: auto;
          right: auto;
          margin: 0 auto;
          top: auto;
          transition: .4s ease-in-out;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          white-space: nowrap;
          opacity: 0;
          height: 0;
          overflow: hidden;
        }

        .btn1:hover {
          background-color: limegreen;
        }

        .btn2 {
          position: relative;
          border: none;
          outline: none;
          background-color: black;
          color: white;
          font-size: 0.65em;
          width: 85%;
          padding: 0.8em 0.6em;
          border-radius: 10px;
          left: auto;
          right: auto;
          margin: 0 auto;
          top: auto;
          transition: .4s ease-in-out;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          white-space: nowrap;
          opacity: 0;
          height: 0;
          overflow: hidden;
        }

        .btn2:hover {
          background-color: limegreen;
        }

        .glasses {
          position: relative;
          top: -4em;
          left: 9.5em;
          width: 70px;
          height: 70px;
          transition: .4s ease-in-out;
          z-index: 3;
          pointer-events: none;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
        }

        .card:hover {
          width: 12.5em;
          height: 24em;
          transform: translateY(1.25em);
        }

        .card:hover + .glasses {
          transform: rotateX(360deg);
          height: 100px;
          width: 100px;
          left: 1.5em; 
          top: -18em;
        }

        .card:hover .heading {
          transform: translateY(0) translateX(0);
          white-space: normal;
          padding-top: 4.5em;
        }

        .card:hover .details {
          opacity: 1;
          height: auto;
          overflow: visible;
          transform: translateY(0);
        }

        .card:hover .price {
          opacity: 1;
          height: auto;
          overflow: visible;
          padding-top: 1em;
        }

        .card:hover .btn1 {
          opacity: 1;
          height: auto;
          overflow: visible;
          padding: 0.8em 0.6em;
          margin-top: 0.8em;
        }

        .card:hover .btn2 {
          opacity: 1;
          height: auto;
          overflow: visible;
          padding: 0.8em 0.6em;
          margin-top: 0.6em;
        }

        .wishlist-tab {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 5;
          background: white;
          border-radius: 50%;
          padding: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: .3s;
        }

        .wishlist-tab:hover {
          transform: scale(1.2);
        }
        
        .preview-trigger {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 5;
          background: white;
          border-radius: 50%;
          padding: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: .3s;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .preview-trigger:hover {
          transform: scale(1.2);
          color: #4f46e5;
        }

        .quick-view-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(12px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fade-in-ql 0.3s ease;
        }

        @keyframes fade-in-ql {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          width: 100%;
          max-width: 1000px;
          height: auto;
          max-height: 90vh;
          border-radius: 32px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
          animation: modal-up-ql 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        @media (min-width: 768px) {
          .modal-content {
            flex-direction: row;
            height: 650px;
          }
        }

        @keyframes modal-up-ql {
          from { transform: translateY(60px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .modal-left {
          flex: 1;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
        }

        .modal-right {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .modal-close {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 20;
          padding: 10px;
          background: white;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .modal-close:hover {
          background: #f1f5f9;
          transform: rotate(90deg);
        }

        .q-image {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
          filter: drop-shadow(0 30px 40px rgba(0,0,0,0.15));
        }

        .q-tag {
          display: inline-block;
          padding: 4px 12px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 99px;
          margin-bottom: 16px;
        }

        .q-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .q-price {
          font-size: 1.8rem;
          font-weight: 900;
          color: #4f46e5;
          margin-bottom: 24px;
        }

        .q-section-title {
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #94a3b8;
          margin-bottom: 12px;
          margin-top: 24px;
        }

        .q-desc {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.6;
          font-weight: 500;
        }

        .q-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .q-feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #334155;
          font-weight: 700;
        }

        .q-reviews {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .q-review-card {
          padding: 16px;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
        }

        .q-btn-group {
          margin-top: auto;
          padding-top: 32px;
          display: flex;
          gap: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .q-main-btn {
          flex: 1;
          background: #4f46e5;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 16px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }

        .q-main-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(79, 70, 229, 0.3);
        }

        .q-wish-btn {
          padding: 16px;
          border-radius: 16px;
          border: 2px solid #f1f5f9;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .q-wish-btn:hover {
          background: white;
          border-color: #e2e8f0;
        }

        .q-wish-btn.active {
          background: #fff1f2;
          border-color: #ffe4e6;
          color: #f43f5e;
        }
      `}</style>

      <div className="ultra-flex-main">
        <div className="card">
          <div className="wishlist-tab" onClick={(e) => { e.stopPropagation(); context?.toggleWishlist(product.id); }}>
            <Heart size={14} className={context?.wishlist.includes(product.id) ? "fill-pink-500 text-pink-500" : "text-gray-400"} />
          </div>
          <div className="preview-trigger" onClick={(e) => { e.stopPropagation(); setShowQuickView(true); }}>
            <Eye size={14} />
          </div>

          <div className="heading">{product.name}</div>
          <div className="details">
            {product.description.length > 70 
              ? product.description.substring(0, 70) + '...' 
              : product.description}
          </div>
          <div className="price">{formatCurrency(product.price)}</div>
          
          <button className="btn1" onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}>
            {adding ? <Loader2 size={12} className="animate-spin mr-2" /> : <ShoppingCart size={12} className="mr-2" />}
            Buy Now
          </button>
          
          <button className="btn2" onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}>
            <Plus size={12} className="mr-2" /> Add to Cart
          </button>
        </div>

        <div className="glasses">
          <img src={product.image} alt={product.name} className="product-img" />
        </div>
      </div>

      {showQuickView && createPortal(
        <div className="quick-view-overlay" onClick={() => setShowQuickView(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-left">
               <button 
                onClick={() => setShowQuickView(false)}
                className="modal-close"
               >
                <X size={20} />
               </button>
               <img src={product.image} alt={product.name} className="q-image" />
            </div>
            
            <div className="modal-right">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="q-tag">{product.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  <span style={{ fontWeight: 900, color: '#0f172a' }}>{averageRating.toFixed(1)}</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>({product.reviews?.length} reviews)</span>
                </div>
              </div>

              <h2 className="q-title">{product.name}</h2>
              <div className="q-price">{formatCurrency(product.price)}</div>
              
              <div className="q-desc-container" style={{ flexGrow: 1 }}>
                <div>
                  <h4 className="q-section-title">Description</h4>
                  <p className="q-desc">{product.description}</p>
                </div>

                {product.features && (
                  <div>
                    <h4 className="q-section-title">Key Features</h4>
                    <div className="q-features">
                      {product.features.map((f, i) => (
                        <div key={i} className="q-feature-item">
                          <Check size={14} style={{ color: '#10b981' }} /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.reviews && product.reviews.length > 0 && (
                  <div>
                    <h4 className="q-section-title">Recent Reviews</h4>
                    <div className="q-reviews">
                      {product.reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="q-review-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}>{review.userName}</span>
                            <div style={{ display: 'flex' }}>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} style={{ color: i < review.rating ? '#f59e0b' : '#cbd5e1', fill: i < review.rating ? '#f59e0b' : 'transparent' }} />
                              ))}
                            </div>
                          </div>
                          <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>"{review.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="q-btn-group">
                <button 
                  onClick={handleAddToCart}
                  className="q-main-btn"
                >
                  <ShoppingCart size={20} /> Add to Bag
                </button>
                <button 
                  onClick={() => context?.toggleWishlist(product.id)}
                  className={`q-wish-btn ${context?.wishlist.includes(product.id) ? 'active' : ''}`}
                >
                  <Heart size={20} className={context?.wishlist.includes(product.id) ? "fill-pink-500" : ""} />
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
