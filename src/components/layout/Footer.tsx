import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../../data/productData';

export const Footer: React.FC = () => {
  const [conciergeModalOpen, setConciergeModalOpen] = useState(false);
  const [conciergeSubmitted, setConciergeSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleConciergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setConciergeSubmitted(true);
  };

  return (
    <footer className="bg-[#06070A] border-t border-[#DCE1EC]/10 text-[#979CAB]">
      <div className="max-w-[1440px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3 md:col-span-2">
          <p className="font-display text-lg font-semibold tracking-[0.26em] text-[#F4F5F8]">
            {BRAND_CONFIG.brandName}
          </p>
          <p className="text-sm text-[#979CAB] max-w-md leading-relaxed">
            Autonomous spatial acoustic instruments sculpted from aerospace-grade titanium, vapor-deposited boron-silicate crystal, and sintered zirconia ceramic.
          </p>
          <p className="font-mono-tech text-xs text-[#979CAB]/80 pt-2">
            ZURICH ACOUSTIC FOUNDRY · KYOTO CERAMICS LAB · JENA OPTICAL WORKS
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-mono-tech text-xs uppercase tracking-[0.18em] text-[#F4F5F8]">
            Navigation
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[#F4F5F8] transition-colors">
                Showcase Home
              </Link>
            </li>
            <li>
              <Link to="/product" className="hover:text-[#F4F5F8] transition-colors">
                3D Studio Configurator
              </Link>
            </li>
            <li>
              <Link to="/technology" className="hover:text-[#F4F5F8] transition-colors">
                Acoustic Technology
              </Link>
            </li>
            <li>
              <Link to="/craftsmanship" className="hover:text-[#F4F5F8] transition-colors">
                Materials & Craftsmanship
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-[#F4F5F8] transition-colors">
                Acquisition & Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-mono-tech text-xs uppercase tracking-[0.18em] text-[#F4F5F8]">
            Private Salon & Concierge
          </h3>
          <p className="text-sm leading-relaxed">
            Schedule an acoustic audition or request custom architectural integration blueprints.
          </p>
          <button
            type="button"
            onClick={() => {
              setConciergeSubmitted(false);
              setConciergeModalOpen(true);
            }}
            className="inline-block px-4 py-2.5 text-xs font-mono-tech uppercase tracking-widest text-[#F4F5F8] bg-[#131721] border border-[#DCE1EC]/20 hover:border-[#9DEBFF] transition-colors cursor-pointer"
          >
            Contact Acoustic Concierge
          </button>
        </div>
      </div>

      <div className="border-t border-[#DCE1EC]/10">
        <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#979CAB]">
          <span>
            © {BRAND_CONFIG.releaseYear} {BRAND_CONFIG.brandName} ACOUSTIC SYSTEMS. ALL RIGHTS RESERVED.
          </span>
          <span className="font-mono-tech">
            CONCEPT SHOWCASE · MODEL {BRAND_CONFIG.modelCode}
          </span>
        </div>
      </div>

      {conciergeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Private Acoustic Concierge Inquiry"
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/80 p-6"
        >
          <div className="bg-[#0C0F15] border border-[#DCE1EC]/20 max-w-md w-full p-6 space-y-4 text-[#F4F5F8]">
            <div className="flex items-center justify-between border-b border-[#DCE1EC]/10 pb-3">
              <h4 className="font-display text-base font-semibold tracking-wider uppercase">
                Private Salon Audition
              </h4>
              <button
                type="button"
                onClick={() => setConciergeModalOpen(false)}
                className="text-xs font-mono-tech text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            {conciergeSubmitted ? (
              <div className="space-y-3 py-4">
                <p className="text-sm text-[#9DEBFF] font-medium">
                  Dossier Request Registered
                </p>
                <p className="text-xs text-[#979CAB] leading-relaxed">
                  Our Zurich acoustic specialist will dispatch the architectural CAD package and private audition schedule to {emailInput}.
                </p>
                <button
                  type="button"
                  onClick={() => setConciergeModalOpen(false)}
                  className="w-full py-2.5 bg-[#F4F5F8] text-[#06070A] text-xs font-semibold uppercase tracking-widest cursor-pointer"
                >
                  Return to Showroom
                </button>
              </div>
            ) : (
              <form onSubmit={handleConciergeSubmit} className="space-y-4">
                <p className="text-xs text-[#979CAB] leading-relaxed">
                  Enter your email to receive the AURELION ONE room-calibration specification sheet or book a private listening appointment.
                </p>
                <div>
                  <label
                    htmlFor="concierge-email"
                    className="block font-mono-tech text-xs text-[#979CAB] mb-1.5"
                  >
                    CLIENT EMAIL ADDRESS
                  </label>
                  <input
                    id="concierge-email"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="client@architecture.studio"
                    className="w-full px-3.5 py-2.5 bg-[#131721] border border-[#DCE1EC]/20 text-sm text-[#F4F5F8] focus:border-[#9DEBFF]"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConciergeModalOpen(false)}
                    className="px-4 py-2 text-xs text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#F4F5F8] text-[#06070A] text-xs font-semibold uppercase tracking-widest hover:bg-[#9DEBFF] transition-colors cursor-pointer"
                  >
                    Request Dossier
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
