import { useState, useCallback } from 'react';
import { IAP } from '@apps-in-toss/web-framework';
import { grantCreditsFn } from '../lib/firebase';
import type { CreditProduct } from '../constants/emotions';

interface IapState {
  loading: boolean;
  error: string | null;
}

interface UseIapReturn extends IapState {
  purchase: (product: CreditProduct) => Promise<boolean>;
  restorePendingOrders: () => Promise<void>;
}

/**
 * 인앱결제 Hook
 * - 크레딧 상품 구매
 * - 미완료 주문 복원
 */
export function useIap(): UseIapReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 상품 구매 처리
   */
  const purchase = useCallback(async (product: CreditProduct): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      return await new Promise<boolean>((resolve) => {
        const cleanup = IAP.createOneTimePurchaseOrder({
          options: {
            sku: product.sku,
            processProductGrant: async ({ orderId }) => {
              // 서버에 크레딧 지급 요청
              try {
                const result = await grantCreditsFn({
                  orderId,
                  sku: product.sku,
                  credits: product.credits,
                });
                return result.data.success;
              } catch (err) {
                console.error('크레딧 지급 실패:', err);
                return false;
              }
            },
          },
          onEvent: async (event) => {
            if (event.type === 'success') {
              console.log('결제 성공:', event.data);
              setLoading(false);
              cleanup();
              resolve(true);
            }
          },
          onError: async (err) => {
            console.error('결제 오류:', err);
            setError('결제 중 오류가 발생했어요.');
            setLoading(false);
            cleanup();
            resolve(false);
          },
        });
      });
    } catch (err) {
      console.error('결제 처리 실패:', err);
      setError('결제를 처리할 수 없어요.');
      setLoading(false);
      return false;
    }
  }, []);

  /**
   * 미완료 주문 복원 (결제 완료되었으나 지급 실패한 경우)
   */
  const restorePendingOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await IAP.getPendingOrders();
      if (!result || result.orders.length === 0) {
        setLoading(false);
        return;
      }

      // 각 미완료 주문에 대해 지급 처리
      for (const order of result.orders) {
        try {
          // 서버에 크레딧 지급 요청
          const grantResult = await grantCreditsFn({
            orderId: order.orderId,
            sku: order.sku,
            credits: 0, // 서버에서 SKU로 크레딧 수량 확인
          });

          if (grantResult.data.success) {
            // 지급 완료 처리
            await IAP.completeProductGrant({
              params: { orderId: order.orderId },
            });
          }
        } catch (err) {
          console.error('주문 복원 실패:', order.orderId, err);
        }
      }
    } catch (err) {
      console.error('미완료 주문 조회 실패:', err);
      setError('주문 복원에 실패했어요.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, purchase, restorePendingOrders };
}
