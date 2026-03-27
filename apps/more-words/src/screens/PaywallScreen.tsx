import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PRICING, PRODUCT_IDS, purchaseProduct, restorePurchases} from '../utils/subscription';
import {defaultTheme} from '../theme';

interface PaywallScreenProps {
  onDismiss: () => void;
  onPurchased: () => void;
}

const t = defaultTheme;

const FEATURES = [
  'AI-curated words matched to your interests',
  'Unlimited profiles for the whole family',
  'All future More. apps included',
  'Premium themes + art widget backgrounds',
];

export default function PaywallScreen({
  onDismiss,
  onPurchased,
}: PaywallScreenProps): React.JSX.Element {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    setLoading(true);
    const productId = plan === 'annual' ? PRODUCT_IDS.annual : PRODUCT_IDS.monthly;
    const success = await purchaseProduct(productId);
    setLoading(false);
    if (success) onPurchased();
  }

  async function handleRestore() {
    setLoading(true);
    const success = await restorePurchases();
    setLoading(false);
    if (success) onPurchased();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock More.</Text>

      <View style={styles.features}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Plan toggle */}
      <View style={styles.planToggle}>
        <TouchableOpacity
          style={[styles.planBtn, plan === 'annual' && styles.planActive]}
          onPress={() => setPlan('annual')}>
          <Text style={[styles.planLabel, plan === 'annual' && styles.planLabelActive]}>
            Annual
          </Text>
          <Text style={[styles.planPrice, plan === 'annual' && styles.planPriceActive]}>
            {PRICING.annual}
          </Text>
          <Text style={styles.planSave}>Save 50%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planBtn, plan === 'monthly' && styles.planActive]}
          onPress={() => setPlan('monthly')}>
          <Text style={[styles.planLabel, plan === 'monthly' && styles.planLabelActive]}>
            Monthly
          </Text>
          <Text style={[styles.planPrice, plan === 'monthly' && styles.planPriceActive]}>
            {PRICING.monthly}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.ctaBtn, loading && styles.ctaDisabled]}
        disabled={loading}
        onPress={handlePurchase}>
        <Text style={styles.ctaText}>
          {loading ? 'Processing...' : `Start ${PRICING.trialDays}-Day Free Trial`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRestore}>
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.dismissText}>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingHorizontal: 28,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: t.colors.word,
    marginBottom: 28,
  },
  features: {
    width: '100%',
    marginBottom: 28,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  check: {
    fontSize: 16,
    color: t.colors.accent,
  },
  featureText: {
    fontSize: 16,
    color: t.colors.word,
    flex: 1,
  },
  planToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  planBtn: {
    flex: 1,
    backgroundColor: t.colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planActive: {
    borderColor: t.colors.accent,
  },
  planLabel: {
    fontSize: 15,
    color: t.colors.secondary,
    marginBottom: 4,
  },
  planLabelActive: {
    color: t.colors.word,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: t.colors.muted,
  },
  planPriceActive: {
    color: t.colors.accent,
  },
  planSave: {
    fontSize: 11,
    color: t.colors.accent,
    marginTop: 4,
  },
  ctaBtn: {
    backgroundColor: t.colors.accent,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    color: t.colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
  restoreText: {
    color: t.colors.secondary,
    fontSize: 14,
    marginBottom: 12,
  },
  dismissText: {
    color: t.colors.muted,
    fontSize: 14,
    marginBottom: 32,
  },
});
