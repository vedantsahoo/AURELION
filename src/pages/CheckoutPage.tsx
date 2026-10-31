import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
} from 'lucide-react';
import {
  COLORWAYS,
  EDITIONS,
  MATERIALS,
} from '../data/productData';
import { useCart } from '../state/CartContext';
import { useProduct } from '../state/ProductContext';
import {
  CheckoutFormInput,
  formatCurrency,
  validateCheckoutForm,
} from '../utils/commerce';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    promoCode,
    setPromoCode,
    expressCourier,
    setExpressCourier,
    totals,
    addToBag,
  } = useCart();
  const { config, details } = useProduct();

  const [formInput, setFormInput] = useState<CheckoutFormInput>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Switzerland',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormInput, string>>>({});
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderId: string;
    totalFormatted: string;
    recipient: string;
    email: string;
    itemCount: number;
  } | null>(null);

  const handleFieldChange = (field: keyof CheckoutFormInput, value: string) => {
    setFormInput((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const validation = validateCheckoutForm(formInput);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const orderNum = `AUR-${203500 + Math.floor((totals.total % 899) + 100)}`;
    setOrderConfirmed({
      orderId: orderNum,
      totalFormatted: formatCurrency(totals.total),
      recipient: formInput.fullName.trim(),
      email: formInput.email.trim(),
      itemCount: totals.itemCount,
    });
    clearCart();
  };

  if (orderConfirmed) {
    return (
      <main className="bg-[#06070A] text-[#F4F5F8] pt-24 pb-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-6">
          <div
            data-testid="order-confirmation-card"
            className="bg-[#0C0F15] border border-[#9DEBFF]/50 p-8 md:p-12 space-y-6"
          >
            <div className="flex items-center gap-3 text-[#9DEBFF]">
              <CheckCircle className="w-6 h-6" />
              <span className="font-mono-tech text-xs uppercase tracking-widest">
                DEMO RESERVATION CONFIRMED · NO REAL PAYMENT CHARGED
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-semibold">
              Commission Reference #{orderConfirmed.orderId}
            </h1>

            <p className="text-sm text-[#979CAB] leading-relaxed">
              Thank you, <span className="text-[#F4F5F8] font-medium">{orderConfirmed.recipient}</span>. Your demonstration acquisition dossier for {orderConfirmed.itemCount} unit(s) ({orderConfirmed.totalFormatted}) has been prepared for <span className="text-[#F4F5F8]">{orderConfirmed.email}</span>.
            </p>

            <div className="p-4 bg-[#131721] border border-[#DCE1EC]/15 font-mono-tech text-xs text-[#979CAB] space-y-1">
              <p className="text-[#F4F5F8]">DEMO ENVIRONMENT NOTICE:</p>
              <p>
                This is a functional frontend showcase demonstration. No payment gateway is connected and no financial transaction has occurred.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#F4F5F8] text-[#06070A] text-xs font-display font-semibold uppercase tracking-widest hover:bg-[#9DEBFF] transition-colors cursor-pointer"
              >
                Return to Showcase
              </button>
              <button
                type="button"
                onClick={() => navigate('/product')}
                className="px-6 py-3 bg-[#131721] border border-[#DCE1EC]/20 text-[#F4F5F8] text-xs font-display font-semibold uppercase tracking-widest hover:border-[#9DEBFF] transition-colors cursor-pointer"
              >
                Configure Another Unit
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#06070A] text-[#F4F5F8] pt-24 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 space-y-10">
        {/* Top Header & Transparent Demo Checkout Notice */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DCE1EC]/10 pb-6">
          <div>
            <button
              type="button"
              onClick={() => navigate('/product')}
              className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#979CAB] hover:text-[#F4F5F8] mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO 3D CONFIGURATOR</span>
            </button>
            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
              Acquisition & Demo Checkout
            </h1>
          </div>

          <div className="bg-[#131721] border border-[#8B5CF6]/40 px-4 py-3 max-w-md">
            <div className="flex items-center gap-2 font-mono-tech text-xs text-[#9DEBFF]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>DEMO CHECKOUT MODE — NO LIVE PAYMENT CONNECTED</span>
            </div>
            <p className="text-xs text-[#979CAB] mt-1">
              Simulates bespoke order reservation without processing real credit cards or billing.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#0C0F15] border border-[#DCE1EC]/15 p-12 text-center max-w-2xl mx-auto space-y-6">
            <ShoppingBag className="w-12 h-12 text-[#979CAB]/50 mx-auto stroke-[1.25]" />
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold">
                Your Acquisition Bag is Empty
              </h2>
              <p className="text-sm text-[#979CAB]">
                Add your currently configured AURELION ONE ({details.summaryLabel}) or return to the 3D Studio to customize your finish.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => addToBag(config, 1, false)}
                className="px-6 py-3.5 bg-[#F4F5F8] text-[#06070A] hover:bg-[#9DEBFF] text-xs font-display font-semibold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Add Current Configuration ({formatCurrency(details.unitPrice)})
              </button>
              <button
                type="button"
                onClick={() => navigate('/product')}
                className="px-6 py-3.5 bg-[#131721] border border-[#DCE1EC]/20 text-xs font-display font-semibold uppercase tracking-widest hover:border-[#9DEBFF] transition-colors cursor-pointer"
              >
                Open 3D Configurator
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Selected Items & Customer Reservation Form */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-[#0C0F15] border border-[#DCE1EC]/15 p-6 space-y-4">
                <h2 className="font-mono-tech text-xs uppercase tracking-widest text-[#9DEBFF]">
                  01. Configured Instruments ({totals.itemCount})
                </h2>

                <div className="divide-y divide-[#DCE1EC]/10">
                  {items.map((item) => {
                    const mat = MATERIALS.find((m) => m.id === item.materialId) || MATERIALS[0];
                    const col = COLORWAYS.find((c) => c.id === item.colorwayId) || COLORWAYS[0];
                    const ed = EDITIONS.find((e) => e.id === item.editionId) || EDITIONS[0];

                    return (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-full border border-[#DCE1EC]/30 shrink-0 mt-1"
                            style={{ background: col.swatchGradient }}
                          />
                          <div>
                            <h3 className="font-display text-base font-semibold">
                              AURELION ONE · {col.name}
                            </h3>
                            <p className="text-xs text-[#979CAB]">
                              Shell: {mat.name} · Edition: {ed.name}
                            </p>
                            {item.customEngraving && (
                              <p className="font-mono-tech text-xs text-[#9DEBFF] mt-1">
                                Plinth Engraving: “{item.customEngraving}”
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="flex items-center border border-[#DCE1EC]/15 bg-[#06070A]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity for ${col.name}`}
                              className="p-2 text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 font-mono-tech text-xs tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity for ${col.name}`}
                              className="p-2 text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-mono-tech text-sm font-semibold tabular-nums min-w-[80px] text-right">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${col.name}`}
                            className="p-2 text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Client Dispatch Details Form */}
              <form
                onSubmit={handleSubmitOrder}
                noValidate
                className="bg-[#0C0F15] border border-[#DCE1EC]/15 p-6 md:p-8 space-y-6"
              >
                <h2 className="font-mono-tech text-xs uppercase tracking-widest text-[#9DEBFF]">
                  02. Client Dispatch & Acoustic Dossier Registration
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkout-fullname"
                      className="block font-mono-tech text-xs text-[#979CAB] mb-1.5"
                    >
                      FULL NAME *
                    </label>
                    <input
                      id="checkout-fullname"
                      type="text"
                      value={formInput.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      placeholder="Elena Vance"
                      className="w-full px-3.5 py-2.5 bg-[#06070A] border border-[#DCE1EC]/20 text-sm text-[#F4F5F8]"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-[#9DEBFF] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-email"
                      className="block font-mono-tech text-xs text-[#979CAB] mb-1.5"
                    >
                      EMAIL ADDRESS *
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      value={formInput.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="elena@vance.studio"
                      className="w-full px-3.5 py-2.5 bg-[#06070A] border border-[#DCE1EC]/20 text-sm text-[#F4F5F8]"
                    />
                    {errors.email && (
                      <p className="text-xs text-[#9DEBFF] mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block font-mono-tech text-xs text-[#979CAB] mb-1.5"
                  >
                    STREET ADDRESS *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={formInput.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="Bahnhofstrasse 74, Penthouse"
                    className="w-full px-3.5 py-2.5 bg-[#06070A] border border-[#DCE1EC]/20 text-sm text-[#F4F5F8]"
                  />
                  {errors.address && (
                    <p className="text-xs text-[#9DEBFF] mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block font-mono-tech text-xs text-[#979CAB] mb-1.5"
                    >
                      CITY *
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      value={formInput.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      placeholder="Zurich"
                      className="w-full px-3.5 py-2.5 bg-[#06070A] border border-[#DCE1EC]/20 text-sm text-[#F4F5F8]"
                    />
                    {errors.city && (
                      <p className="text-xs text-[#9DEBFF] mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-postal"
                      className="block font-mono-tech text-xs text-[#979CAB] mb-1.5"
                    >
                      POSTAL CODE *
                    </label>
                    <input
                      id="checkout-postal"
                      type="text"
                      value={formInput.postalCode}
                      onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                      placeholder="8001"
                      className="w-full px-3.5 py-2.5 bg-[#06070A] border border-[#DCE1EC]/20 text-sm text-[#F4F5F8]"
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-[#9DEBFF] mt-1">{errors.postalCode}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-country"
                      className="block font-mono-tech text-xs text-[#979CAB] mb-1.5"
                    >
                      COUNTRY *
                    </label>
                    <input
                      id="checkout-country"
                      type="text"
                      value={formInput.country}
                      onChange={(e) => handleFieldChange('country', e.target.value)}
                      placeholder="Switzerland"
                      className="w-full px-3.5 py-2.5 bg-[#06070A] border border-[#DCE1EC]/20 text-sm text-[#F4F5F8]"
                    />
                    {errors.country && (
                      <p className="text-xs text-[#9DEBFF] mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#F4F5F8] text-[#06070A] hover:bg-[#9DEBFF] font-display text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer"
                >
                  Complete Demo Commission Reservation · {formatCurrency(totals.total)}
                </button>
              </form>
            </div>

            {/* Right Column: Financial Summary & Logistics Options */}
            <aside className="lg:col-span-5 bg-[#0C0F15] border border-[#DCE1EC]/15 p-6 md:p-8 space-y-6">
              <h2 className="font-mono-tech text-xs uppercase tracking-widest text-[#9DEBFF]">
                Order Summary
              </h2>

              <div className="space-y-3">
                <label
                  htmlFor="promo-code-input"
                  className="block font-mono-tech text-xs text-[#979CAB]"
                >
                  PRIVATE SALON CODE (TRY: AURELION2035 FOR 5% OFF)
                </label>
                <input
                  id="promo-code-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="AURELION2035"
                  className="w-full px-3.5 py-2 bg-[#06070A] border border-[#DCE1EC]/20 font-mono-tech text-xs text-[#F4F5F8] uppercase"
                />
              </div>

              <div className="pt-3 border-t border-[#DCE1EC]/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expressCourier}
                    onChange={(e) => setExpressCourier(e.target.checked)}
                    className="mt-1 accent-[#9DEBFF]"
                  />
                  <span className="text-xs text-[#979CAB]">
                    <strong className="text-[#F4F5F8] block">
                      Dedicated Climate-Controlled Air Freight (+$180)
                    </strong>
                    Direct flight-case dispatch from Zurich within 72 hours.
                  </span>
                </label>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-[#DCE1EC]/10 text-sm">
                <div className="flex justify-between text-[#979CAB]">
                  <span>Instruments Subtotal ({totals.itemCount})</span>
                  <span className="font-mono-tech text-[#F4F5F8] tabular-nums">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>

                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-[#9DEBFF]">
                    <span>Salon Privilege (AURELION2035 · 5%)</span>
                    <span className="font-mono-tech tabular-nums">
                      -{formatCurrency(totals.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#979CAB]">
                  <span>Logistics & Freight</span>
                  <span className="font-mono-tech text-[#F4F5F8] tabular-nums">
                    {totals.shippingCost === 0 ? 'INCLUDED' : formatCurrency(totals.shippingCost)}
                  </span>
                </div>

                <div className="flex justify-between text-[#979CAB]">
                  <span>Estimated Acoustic Duty / VAT (8%)</span>
                  <span className="font-mono-tech text-[#F4F5F8] tabular-nums">
                    {formatCurrency(totals.estimatedTax)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-[#DCE1EC]/15">
                  <span className="font-display text-base font-semibold">Total Valuation</span>
                  <span
                    data-testid="checkout-total-amount"
                    className="font-mono-tech text-2xl font-semibold text-[#F4F5F8] tabular-nums"
                  >
                    {formatCurrency(totals.total)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};
