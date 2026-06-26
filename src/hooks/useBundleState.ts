import { useCallback, useEffect, useMemo, useState } from 'react';
import { bundleData } from '../data';
import type {
  BundleState,
  BundleTotals,
  PersistedBundleConfig,
  Product,
  ReviewLine,
  SaveStatus,
} from '../types/bundle';
import {
  clearPersistedConfig,
  loadPersistedConfig,
  savePersistedConfig,
} from '../utils/persistence';
import {
  buildInitialActiveVariants,
  buildInitialQuantities,
  buildReviewLines,
  calculateActiveTotal,
  calculateCompareTotal,
  calculateSavings,
  canDecrementQuantity,
  canIncrementQuantity,
  clampQuantity,
  getDefaultVariantId,
  getProductTotalQuantity,
  getQuantityKey,
  getStoredQuantity,
} from '../utils/pricing';

const SAVE_CONFIRMATION_MS = 3000;

function createDefaultState(): BundleState {
  return {
    activeStepId: bundleData.steps[0]?.id ?? 'cameras',
    activeVariantByProductId: buildInitialActiveVariants(),
    quantities: buildInitialQuantities(),
    hasRestoredSavedConfig: false,
    saveStatus: 'idle',
  };
}

function createInitialState(): BundleState {
  const restored = loadPersistedConfig();

  if (restored) {
    return {
      activeStepId: restored.activeStepId,
      activeVariantByProductId: restored.activeVariantByProductId,
      quantities: restored.quantities,
      hasRestoredSavedConfig: true,
      saveStatus: 'idle',
    };
  }

  return createDefaultState();
}

function resolveVariantId(
  product: Product,
  activeVariantByProductId: Record<string, string>,
  variantId?: string,
): string {
  return variantId ?? activeVariantByProductId[product.id] ?? getDefaultVariantId(product);
}

export function useBundleState() {
  const [state, setState] = useState<BundleState>(createInitialState);

  useEffect(() => {
    if (state.saveStatus !== 'saved') {
      return;
    }

    const timer = window.setTimeout(() => {
      setState((current) =>
        current.saveStatus === 'saved'
          ? { ...current, saveStatus: 'idle' }
          : current,
      );
    }, SAVE_CONFIRMATION_MS);

    return () => window.clearTimeout(timer);
  }, [state.saveStatus]);

  const setActiveStep = useCallback((stepId: string) => {
    setState((current) => ({
      ...current,
      activeStepId: stepId,
    }));
  }, []);

  const goToNextStep = useCallback(() => {
    setState((current) => {
      const currentIndex = bundleData.steps.findIndex(
        (step) => step.id === current.activeStepId,
      );
      const nextStep = bundleData.steps[currentIndex + 1];

      if (!nextStep) {
        return current;
      }

      return {
        ...current,
        activeStepId: nextStep.id,
      };
    });
  }, []);

  const selectVariant = useCallback((productId: string, variantId: string) => {
    setState((current) => ({
      ...current,
      activeVariantByProductId: {
        ...current.activeVariantByProductId,
        [productId]: variantId,
      },
    }));
  }, []);

  const getActiveVariant = useCallback(
    (product: Product): string => {
      return (
        state.activeVariantByProductId[product.id] ??
        getDefaultVariantId(product)
      );
    },
    [state.activeVariantByProductId],
  );

  const getQuantity = useCallback(
    (product: Product, variantId?: string): number => {
      const resolvedVariantId = resolveVariantId(
        product,
        state.activeVariantByProductId,
        variantId,
      );

      return getStoredQuantity(state.quantities, product, resolvedVariantId);
    },
    [state.activeVariantByProductId, state.quantities],
  );

  const setQuantity = useCallback(
    (product: Product, quantity: number, variantId?: string) => {
      setState((current) => {
        const resolvedVariantId = resolveVariantId(
          product,
          current.activeVariantByProductId,
          variantId,
        );
        const nextQuantity = clampQuantity(product, quantity);
        const key = getQuantityKey(product, resolvedVariantId);

        return {
          ...current,
          quantities: {
            ...current.quantities,
            [key]: nextQuantity,
          },
        };
      });
    },
    [],
  );

  const increment = useCallback((product: Product, variantId?: string) => {
    setState((current) => {
      const resolvedVariantId = resolveVariantId(
        product,
        current.activeVariantByProductId,
        variantId,
      );
      const currentQuantity = getStoredQuantity(
        current.quantities,
        product,
        resolvedVariantId,
      );

      if (!canIncrementQuantity(product, currentQuantity)) {
        return current;
      }

      const key = getQuantityKey(product, resolvedVariantId);

      return {
        ...current,
        quantities: {
          ...current.quantities,
          [key]: currentQuantity + 1,
        },
      };
    });
  }, []);

  const decrement = useCallback((product: Product, variantId?: string) => {
    setState((current) => {
      const resolvedVariantId = resolveVariantId(
        product,
        current.activeVariantByProductId,
        variantId,
      );
      const currentQuantity = getStoredQuantity(
        current.quantities,
        product,
        resolvedVariantId,
      );

      if (!canDecrementQuantity(product, currentQuantity)) {
        return current;
      }

      const key = getQuantityKey(product, resolvedVariantId);

      return {
        ...current,
        quantities: {
          ...current.quantities,
          [key]: currentQuantity - 1,
        },
      };
    });
  }, []);

  const getStepSelectedCount = useCallback(
    (stepId: string): number => {
      const step = bundleData.steps.find((item) => item.id === stepId);
      if (!step) {
        return 0;
      }

      return step.products.filter(
        (product) => getProductTotalQuantity(state.quantities, product) > 0,
      ).length;
    },
    [state.quantities],
  );

  const getProductTotalQuantityForProduct = useCallback(
    (product: Product): number => {
      return getProductTotalQuantity(state.quantities, product);
    },
    [state.quantities],
  );

  const getReviewLines = useCallback((): ReviewLine[] => {
    return buildReviewLines(state.quantities);
  }, [state.quantities]);

  const getTotals = useCallback((): BundleTotals => {
    const lines = buildReviewLines(state.quantities);
    const activeTotal = calculateActiveTotal(lines);
    const compareTotal = calculateCompareTotal(lines);

    return {
      activeTotal,
      compareTotal,
      savings: calculateSavings(compareTotal, activeTotal),
    };
  }, [state.quantities]);

  const saveConfiguration = useCallback(() => {
    const payload: PersistedBundleConfig = {
      activeStepId: state.activeStepId,
      activeVariantByProductId: state.activeVariantByProductId,
      quantities: state.quantities,
    };

    try {
      savePersistedConfig(payload);
      setState((current) => ({
        ...current,
        saveStatus: 'saved' satisfies SaveStatus,
      }));
    } catch {
      setState((current) => ({
        ...current,
        saveStatus: 'error' satisfies SaveStatus,
      }));
    }
  }, [state.activeStepId, state.activeVariantByProductId, state.quantities]);

  const restoreSavedConfiguration = useCallback(() => {
    const restored = loadPersistedConfig();
    if (!restored) {
      return false;
    }

    setState((current) => ({
      ...current,
      activeStepId: restored.activeStepId,
      activeVariantByProductId: restored.activeVariantByProductId,
      quantities: restored.quantities,
      hasRestoredSavedConfig: true,
      saveStatus: 'idle',
    }));

    return true;
  }, []);

  const clearSavedConfiguration = useCallback(() => {
    clearPersistedConfig();
    setState(createDefaultState());
  }, []);

  const canIncrementForProduct = useCallback(
    (product: Product, variantId?: string): boolean => {
      return canIncrementQuantity(product, getQuantity(product, variantId));
    },
    [getQuantity],
  );

  const canDecrementForProduct = useCallback(
    (product: Product, variantId?: string): boolean => {
      return canDecrementQuantity(product, getQuantity(product, variantId));
    },
    [getQuantity],
  );

  const summary = useMemo(() => bundleData.summary, []);

  return {
    state,
    summary,
    setActiveStep,
    goToNextStep,
    selectVariant,
    getActiveVariant,
    getQuantity,
    increment,
    decrement,
    setQuantity,
    getStepSelectedCount,
    getProductTotalQuantity: getProductTotalQuantityForProduct,
    getReviewLines,
    getTotals,
    saveConfiguration,
    restoreSavedConfiguration,
    clearSavedConfiguration,
    canIncrement: canIncrementForProduct,
    canDecrement: canDecrementForProduct,
  };
}
