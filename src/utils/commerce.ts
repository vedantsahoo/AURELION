import {
  BRAND_CONFIG,
  COLORWAYS,
  EDITIONS,
  MATERIALS,
  ColorwayId,
  EditionId,
  MaterialId,
} from '../data/productData';

export interface ProductConfiguration {
  materialId: MaterialId;
  colorwayId: ColorwayId;
  editionId: EditionId;
  customEngraving?: string;
}

export interface CartItem {
  id: string;
  materialId: MaterialId;
  colorwayId: ColorwayId;
  editionId: EditionId;
  customEngraving?: string;
  unitPrice: number;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  estimatedTax: number;
  total: number;
}

export interface CheckoutFormInput {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof CheckoutFormInput, string>>;
}

export function getConfigurationDetails(config: ProductConfiguration) {
  const material = MATERIALS.find((m) => m.id === config.materialId) || MATERIALS[0];
  const colorway = COLORWAYS.find((c) => c.id === config.colorwayId) || COLORWAYS[0];
  const edition = EDITIONS.find((e) => e.id === config.editionId) || EDITIONS[0];

  const unitPrice =
    BRAND_CONFIG.basePrice +
    material.priceDelta +
    colorway.priceDelta +
    edition.priceDelta;

  const variantId = `${material.id}__${colorway.id}__${edition.id}__${(config.customEngraving || '').trim().toUpperCase()}`;

  return {
    material,
    colorway,
    edition,
    unitPrice,
    variantId,
    summaryLabel: `${colorway.name} · ${material.shortName} · ${edition.name}`,
  };
}

export function addOrIncrementCartItem(
  items: CartItem[],
  config: ProductConfiguration,
  quantityToAdd = 1
): CartItem[] {
  if (quantityToAdd <= 0) return items;
  const details = getConfigurationDetails(config);
  const existingIndex = items.findIndex((item) => item.id === details.variantId);

  if (existingIndex > -1) {
    return items.map((item, idx) =>
      idx === existingIndex
        ? { ...item, quantity: Math.min(10, item.quantity + quantityToAdd) }
        : item
    );
  }

  return [
    ...items,
    {
      id: details.variantId,
      materialId: details.material.id,
      colorwayId: details.colorway.id,
      editionId: details.edition.id,
      customEngraving: config.customEngraving?.trim().toUpperCase() || undefined,
      unitPrice: details.unitPrice,
      quantity: Math.min(10, quantityToAdd),
    },
  ];
}

export function updateCartItemQuantity(
  items: CartItem[],
  variantId: string,
  newQuantity: number
): CartItem[] {
  if (newQuantity <= 0) {
    return items.filter((item) => item.id !== variantId);
  }
  const clamped = Math.min(10, Math.floor(newQuantity));
  return items.map((item) =>
    item.id === variantId ? { ...item, quantity: clamped } : item
  );
}

export function removeCartItem(items: CartItem[], variantId: string): CartItem[] {
  return items.filter((item) => item.id !== variantId);
}

export function calculateCartTotals(
  items: CartItem[],
  promoCode = '',
  expressArmoredCourier = false
): CartTotals {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  if (itemCount === 0) {
    return {
      itemCount: 0,
      subtotal: 0,
      discountAmount: 0,
      shippingCost: 0,
      estimatedTax: 0,
      total: 0,
    };
  }

  const normalizedPromo = promoCode.trim().toUpperCase();
  const discountAmount =
    normalizedPromo === 'AURELION2035' ? Math.round(subtotal * 0.05) : 0;

  const shippingCost = expressArmoredCourier ? 180 : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const estimatedTax = Math.round(taxableAmount * 0.08);
  const total = taxableAmount + shippingCost + estimatedTax;

  return {
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    estimatedTax,
    total,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: BRAND_CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function validateCheckoutForm(input: CheckoutFormInput): CheckoutValidationResult {
  const errors: Partial<Record<keyof CheckoutFormInput, string>> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter the recipient full name.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address for acoustic dossier delivery.';
  }

  if (!input.address || input.address.trim().length < 5) {
    errors.address = 'Please enter a street delivery address.';
  }

  if (!input.city || input.city.trim().length < 2) {
    errors.city = 'Please enter a city.';
  }

  if (!input.postalCode || input.postalCode.trim().length < 3) {
    errors.postalCode = 'Please enter a valid postal code.';
  }

  if (!input.country || input.country.trim().length < 2) {
    errors.country = 'Please specify a destination country.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
