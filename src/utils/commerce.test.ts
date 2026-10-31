import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addOrIncrementCartItem,
  calculateCartTotals,
  formatCurrency,
  getConfigurationDetails,
  removeCartItem,
  updateCartItemQuantity,
  validateCheckoutForm,
} from './commerce';

test('getConfigurationDetails computes accurate pricing across material, colorway, and edition', () => {
  const baseDetails = getConfigurationDetails({
    materialId: 'titanium',
    colorwayId: 'obsidian',
    editionId: 'standard',
  });
  assert.equal(baseDetails.unitPrice, 4800);

  const upgradedDetails = getConfigurationDetails({
    materialId: 'ceramic', // +600
    colorwayId: 'chrome', // +400
    editionId: 'bespoke', // +950
  });
  assert.equal(upgradedDetails.unitPrice, 4800 + 600 + 400 + 950);
  assert.equal(
    upgradedDetails.summaryLabel,
    'Liquid Chrome · Ceramic Composite · Bespoke Acoustic Calibration Edition'
  );
});

test('cart operations add, increment, update quantity, and remove items accurately', () => {
  let cart = addOrIncrementCartItem([], {
    materialId: 'titanium',
    colorwayId: 'obsidian',
    editionId: 'standard',
  });
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 1);
  assert.equal(cart[0].unitPrice, 4800);

  // Adding same configuration increments quantity
  cart = addOrIncrementCartItem(cart, {
    materialId: 'titanium',
    colorwayId: 'obsidian',
    editionId: 'standard',
  });
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);

  // Adding distinct configuration creates second line item
  cart = addOrIncrementCartItem(cart, {
    materialId: 'smoked-glass',
    colorwayId: 'gunmetal',
    editionId: 'bespoke',
  });
  assert.equal(cart.length, 2);

  // Updating quantity
  const firstId = cart[0].id;
  cart = updateCartItemQuantity(cart, firstId, 4);
  assert.equal(cart[0].quantity, 4);

  // Updating quantity to 0 removes item
  cart = updateCartItemQuantity(cart, firstId, 0);
  assert.equal(cart.length, 1);

  // Explicit remove
  cart = removeCartItem(cart, cart[0].id);
  assert.equal(cart.length, 0);
});

test('calculateCartTotals computes subtotal, promo discount, shipping, and tax', () => {
  const cart = addOrIncrementCartItem(
    [],
    {
      materialId: 'titanium',
      colorwayId: 'obsidian',
      editionId: 'standard',
    },
    2
  );
  const totals = calculateCartTotals(cart, '', false);
  assert.equal(totals.itemCount, 2);
  assert.equal(totals.subtotal, 9600);
  assert.equal(totals.discountAmount, 0);
  assert.equal(totals.shippingCost, 0);
  assert.equal(totals.estimatedTax, 768);
  assert.equal(totals.total, 10368);

  const promoTotals = calculateCartTotals(cart, 'aurelion2035', true);
  assert.equal(promoTotals.discountAmount, 480); // 5% of 9600
  assert.equal(promoTotals.shippingCost, 180);
  assert.equal(promoTotals.total, (9600 - 480) + 180 + Math.round((9600 - 480) * 0.08));
});

test('validateCheckoutForm enforces required customer fields', () => {
  const invalid = validateCheckoutForm({
    fullName: '',
    email: 'invalid-email',
    address: '12',
    city: '',
    postalCode: '',
    country: '',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.address);

  const valid = validateCheckoutForm({
    fullName: 'Elena Vance',
    email: 'elena.vance@aurelion.studio',
    address: '740 Bahnhofstrasse Penthouse',
    city: 'Zurich',
    postalCode: '8001',
    country: 'Switzerland',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
  assert.equal(formatCurrency(4800), '$4,800');
});
