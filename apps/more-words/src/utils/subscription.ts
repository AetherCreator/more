// RevenueCat subscription helpers for the More. bundle

export const PRODUCT_IDS = {
  monthly: 'more_bundle_monthly',
  annual: 'more_bundle_annual',
} as const;

export const PRICING = {
  monthly: '$4.99/month',
  annual: '$29.99/year',
  trialDays: 7,
} as const;

export interface SubscriptionStatus {
  isActive: boolean;
  plan: 'monthly' | 'annual' | null;
  expiresAt: string | null;
}

/**
 * Initialize RevenueCat SDK.
 * Call once on app launch.
 */
export async function initSubscriptions(): Promise<void> {
  // In production:
  // import Purchases from 'react-native-purchases';
  // Purchases.configure({ apiKey: process.env.REVENUECAT_API_KEY! });
  console.log('[Subscriptions] RevenueCat initialized (stub)');
}

/**
 * Check if user has active More. bundle subscription.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  // In production:
  // const customerInfo = await Purchases.getCustomerInfo();
  // const isActive = customerInfo.entitlements.active['more_bundle'] !== undefined;
  return {
    isActive: false,
    plan: null,
    expiresAt: null,
  };
}

/**
 * Present the purchase flow for a product.
 */
export async function purchaseProduct(
  productId: string,
): Promise<boolean> {
  // In production:
  // const { customerInfo } = await Purchases.purchaseProduct(productId);
  // return customerInfo.entitlements.active['more_bundle'] !== undefined;
  console.log(`[Subscriptions] Purchase attempted: ${productId}`);
  return false;
}

/**
 * Restore previous purchases.
 */
export async function restorePurchases(): Promise<boolean> {
  // In production:
  // const customerInfo = await Purchases.restorePurchases();
  // return customerInfo.entitlements.active['more_bundle'] !== undefined;
  console.log('[Subscriptions] Restore attempted');
  return false;
}
