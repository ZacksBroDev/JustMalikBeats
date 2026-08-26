import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { BlogProvider } from "./context/BlogContext";
import { MusicProvider } from "./context/MusicContext";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedesign from "./pages/home/HomeRedesign";
import BlogRedesign from "./pages/blog/BlogRedesign";
import BlogPost from "./pages/blog/BlogPost";
import NewBlogPost from "./pages/blog/NewBlogPost";
import CatalogRedesign from "./pages/catalog/CatalogRedesign";
import AccountDashboard from "./pages/account/AccountDashboard";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import PaymentSuccess from "./components/music/PaymentSuccess";
import UnifiedAdmin from "./components/admin/UnifiedAdmin";
import NavbarRedesign from "./components/organisms/NavbarRedesign";
import FooterRedesign from "./components/organisms/FooterRedesign";
import UserModal from "./components/user/UserModal";
import stripePromise from "./config/stripe";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Elements stripe={stripePromise}>
        <UserProvider>
          <BlogProvider>
            <MusicProvider>
                <NavbarRedesign />
                <main>
                  <Routes>
                    <Route path="/" element={<HomeRedesign />} />
                    <Route path="/blog" element={<BlogRedesign />} />
                    <Route
                      path="/blog/new"
                      element={
                        <ProtectedRoute adminOnly>
                          <NewBlogPost />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly>
                          <UnifiedAdmin />
                        </ProtectedRoute>
                      }
                    />
                    {/* Redirect old admin routes to new unified admin */}
                    <Route
                      path="/blog/admin"
                      element={<Navigate to="/admin" replace />}
                    />
                    <Route
                      path="/music/admin"
                      element={<Navigate to="/admin" replace />}
                    />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/catalog" element={<CatalogRedesign />} />
                    <Route path="/music" element={<CatalogRedesign />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/payment-success"
                      element={<PaymentSuccess onContinueShopping={() => window.location.href = '/catalog'} />}
                    />
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <AccountDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <FooterRedesign />
                <UserModal />
            </MusicProvider>
          </BlogProvider>
        </UserProvider>
      </Elements>
    </Suspense>
  );
}

export default App;
