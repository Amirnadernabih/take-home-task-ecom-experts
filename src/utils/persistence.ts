import { bundleData, getAllProducts } from '../data';
import type { PersistedBundleConfig, QuantitiesRecord } from '../types/bundle';
import {
  buildInitialActiveVariants,
  buildInitialQuantities,
  clampQuantity,
  getQuantityKey,
  usesVariantQuantityKeys,
} from './pricing';

export const STORAGE_KEY = 'wyze-bundle-builder-config';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidStepId(stepId: string): boolean {
  return bundleData.steps.some((step) => step.id === stepId);
}

function isValidQuantityKey(key: string): boolean {
  for (const product of getAllProducts()) {
    if (!usesVariantQuantityKeys(product)) {
      if (key === product.id) {
        return true;
      }
      continue;
    }

    for (const variant of product.variants) {
      if (key === getQuantityKey(product, variant.id)) {
        return true;
      }
    }
  }

  return false;
}

function mergeQuantities(saved: unknown): QuantitiesRecord {
  const merged = buildInitialQuantities();

  if (!isRecord(saved)) {
    return merged;
  }

  for (const [key, value] of Object.entries(saved)) {
    if (!isValidQuantityKey(key)) {
      continue;
    }

    if (typeof value !== 'number' || Number.isNaN(value)) {
      continue;
    }

    const product = getAllProducts().find((item) => {
      if (!usesVariantQuantityKeys(item)) {
        return item.id === key;
      }

      return key.startsWith(`${item.id}::`);
    });

    if (!product) {
      continue;
    }

    merged[key] = clampQuantity(product, Math.round(value));
  }

  return merged;
}

function mergeActiveVariants(saved: unknown): Record<string, string> {
  const merged = buildInitialActiveVariants();

  if (!isRecord(saved)) {
    return merged;
  }

  for (const [productId, variantId] of Object.entries(saved)) {
    if (typeof variantId !== 'string') {
      continue;
    }

    const product = getAllProducts().find((item) => item.id === productId);
    if (!product) {
      continue;
    }

    const variantExists = product.variants.some((variant) => variant.id === variantId);
    if (!variantExists) {
      continue;
    }

    merged[productId] = variantId;
  }

  return merged;
}

export function parsePersistedConfig(raw: string): PersistedBundleConfig | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return null;
    }

    const activeStepId =
      typeof parsed.activeStepId === 'string' && isValidStepId(parsed.activeStepId)
        ? parsed.activeStepId
        : bundleData.steps[0]?.id ?? 'cameras';

    return {
      activeStepId,
      activeVariantByProductId: mergeActiveVariants(parsed.activeVariantByProductId),
      quantities: mergeQuantities(parsed.quantities),
    };
  } catch {
    return null;
  }
}

export function loadPersistedConfig(): PersistedBundleConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return parsePersistedConfig(raw);
  } catch {
    return null;
  }
}

export function savePersistedConfig(config: PersistedBundleConfig): void {
  const payload: PersistedBundleConfig = {
    activeStepId: isValidStepId(config.activeStepId)
      ? config.activeStepId
      : bundleData.steps[0]?.id ?? 'cameras',
    activeVariantByProductId: mergeActiveVariants(config.activeVariantByProductId),
    quantities: mergeQuantities(config.quantities),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearPersistedConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}
