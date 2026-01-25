import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DevErrorBoundary from "./components/DevErrorBoundary";

/* তোমার pages */
import HomePage from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Tracking from "./pages/Tracking";
import OrderHistory from "./pages/OrderHistory";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import Brand from "./pages/Brand";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Dev error boundary — shows runtime errors instead of a blank screen */}
        <DevErrorBoundary>
          <React.Suspense fallback={null}>
            <React.Fragment>
              {/* wrapped Routes with DevErrorBoundary to surface render-time exceptions */}
              <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/orders" element={<OrderHistory />} />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />

              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<Shipping />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/brand" element={<Brand />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />

              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />

              {/* fallback */}
              <Route
                path="*"
                element={
                  <div className="p-10 text-center">
                    <h1 className="text-2xl font-black">404 😭</h1>
                    <p className="text-gray-500 mt-2">Page not found</p>
                  </div>
                }
              />
            </Routes>
          </React.Fragment>
        </React.Suspense>
        </DevErrorBoundary>
      </div>
    </BrowserRouter>
  );
}
