import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../state/CartContext';

const NAV_ITEMS = [
  { label: 'Showcase', path: '/' },
  { label: 'Configurator', path: '/product' },
  { label: 'Technology', path: '/technology' },
  { label: 'Craftsmanship', path: '/craftsmanship' },
  { label: 'Checkout', path: '/checkout' },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const { totals, openCart, lastAddedFeedback } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#06070A]/92 border-b border-[#DCE1EC]/10">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-[0.26em] text-[#F4F5F8] whitespace-nowrap shrink-0"
        >
          AURELION
        </Link>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.14em] uppercase"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b ${
                  isActive
                    ? 'text-[#F4F5F8] border-[#9DEBFF]'
                    : 'text-[#979CAB] border-transparent hover:text-[#F4F5F8]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Bag Drawer button + mobile menu trigger on small screens) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open shopping bag with ${totals.itemCount} items`}
            className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase text-[#F4F5F8] bg-[#131721] border border-[#DCE1EC]/20 hover:border-[#9DEBFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#9DEBFF]" />
            <span>Bag</span>
            <span
              data-testid="header-bag-count"
              className="font-mono-tech text-[#9DEBFF] tabular-nums"
            >
              ({totals.itemCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-[#F4F5F8] bg-[#131721] border border-[#DCE1EC]/15 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Subtle toast feedback when an item is added to bag */}
      {lastAddedFeedback && (
        <div
          role="status"
          className="bg-[#131721] border-b border-[#8B5CF6]/40 px-6 py-2 text-center font-mono-tech text-xs text-[#9DEBFF]"
        >
          {lastAddedFeedback}
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden bg-[#0C0F15] border-b border-[#DCE1EC]/15 px-6 py-5 space-y-3"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium tracking-[0.14em] uppercase ${
                  isActive ? 'text-[#9DEBFF]' : 'text-[#979CAB] hover:text-[#F4F5F8]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};
