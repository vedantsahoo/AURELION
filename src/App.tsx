import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductProvider } from './state/ProductContext';
import { CartProvider } from './state/CartContext';
import { CursorProvider } from './state/CursorContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/layout/PageTransition';
import { CustomCursor } from './components/ui/CustomCursor';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CartDrawer } from './components/ui/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { CraftsmanshipPage } from './pages/CraftsmanshipPage';
import { CheckoutPage } from './pages/CheckoutPage';

export function App() {
  const [introComplete, setIntroComplete] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1';
  });

  return (
    <BrowserRouter>
      <CursorProvider>
        <ProductProvider>
          <CartProvider>
            {!introComplete && (
              <LoadingScreen onComplete={() => setIntroComplete(true)} />
            )}

            <CustomCursor />
            <Header />
            <CartDrawer />

            <PageTransition>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/technology" element={<TechnologyPage />} />
                <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageTransition>

            <Footer />
          </CartProvider>
        </ProductProvider>
      </CursorProvider>
    </BrowserRouter>
  );
}

export default App;
