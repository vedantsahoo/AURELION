import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../state/CartContext';
import {
  COLORWAYS,
  EDITIONS,
  MATERIALS,
} from '../../data/productData';
import { formatCurrency } from '../../utils/commerce';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totals,
  } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end bg-black/75 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop click to close */}
      <div
        className="flex-1"
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside className="relative w-full max-w-md bg-[#0C0F15] border-l border-[#DCE1EC]/15 flex flex-col h-full justify-between text-[#F4F5F8] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE1EC]/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-4 h-4 text-[#9DEBFF]" />
            <h2 className="font-display text-base font-semibold tracking-wider uppercase">
              Acquisition Bag
            </h2>
            <span className="font-mono-tech text-xs text-[#979CAB] tabular-nums">
              ({totals.itemCount})
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag drawer"
            className="p-2 text-[#979CAB] hover:text-[#F4F5F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <ShoppingBag className="w-10 h-10 text-[#979CAB]/40 stroke-[1.25]" />
              <div className="space-y-1">
                <p className="font-display text-lg font-medium text-[#F4F5F8]">
                  Your bag is currently empty
                </p>
                <p className="text-sm text-[#979CAB] max-w-xs">
                  Configure your AURELION ONE finish, material architecture, and acoustic edition to begin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate('/product');
                }}
                className="mt-2 px-5 py-2.5 bg-[#131721] border border-[#DCE1EC]/20 text-xs font-semibold tracking-widest uppercase hover:border-[#9DEBFF] transition-colors cursor-pointer"
              >
                Configure AURELION ONE
              </button>
            </div>
          ) : (
            items.map((item) => {
              const mat = MATERIALS.find((m) => m.id === item.materialId) || MATERIALS[0];
              const col = COLORWAYS.find((c) => c.id === item.colorwayId) || COLORWAYS[0];
              const ed = EDITIONS.find((e) => e.id === item.editionId) || EDITIONS[0];

              return (
                <div
                  key={item.id}
                  className="p-4 bg-[#131721] border border-[#DCE1EC]/10 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border border-[#DCE1EC]/25 shrink-0"
                        style={{ background: col.swatchGradient }}
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="font-display text-sm font-semibold text-[#F4F5F8]">
                          AURELION ONE
                        </h3>
                        <p className="text-xs text-[#979CAB]">
                          {col.name} · {mat.shortName}
                        </p>
                        <p className="font-mono-tech text-[11px] text-[#9DEBFF] mt-0.5">
                          {ed.name}
                        </p>
                        {item.customEngraving && (
                          <p className="font-mono-tech text-[11px] text-[#979CAB] mt-0.5">
                            Engraving: “{item.customEngraving}”
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-mono-tech text-sm font-medium text-[#F4F5F8] tabular-nums">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#DCE1EC]/10">
                    <div className="flex items-center border border-[#DCE1EC]/15 bg-[#0C0F15]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity for ${col.name} ${mat.shortName}`}
                        className="p-1.5 text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono-tech text-xs tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity for ${col.name} ${mat.shortName}`}
                        className="p-1.5 text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${col.name} ${mat.shortName} from bag`}
                      className="inline-flex items-center gap-1 text-xs text-[#979CAB] hover:text-[#F4F5F8] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-[#131721] border-t border-[#DCE1EC]/15 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#979CAB]">
                <span>Complimentary White-Glove Freight</span>
                <span className="font-mono-tech text-[#F4F5F8]">INCLUDED</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#DCE1EC]/10">
                <span className="font-display font-medium text-[#F4F5F8]">Subtotal</span>
                <span className="font-mono-tech text-lg font-semibold text-[#F4F5F8] tabular-nums">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-6 bg-[#F4F5F8] text-[#06070A] hover:bg-[#9DEBFF] font-display text-xs font-semibold tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
