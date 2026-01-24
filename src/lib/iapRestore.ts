import { IAP } from '@apps-in-toss/web-framework';
import { grantCreditsFn } from './firebase';

/**
 * 미완료 IAP 주문 복원
 * - 앱 시작 시 자동 호출되어 미지급된 크레딧을 복원
 * - 결제는 완료되었으나 서버 지급이 실패한 경우 처리
 */
export async function restorePendingIapOrders(): Promise<void> {
  try {
    const result = await IAP.getPendingOrders();

    if (!result || result.orders.length === 0) {
      return;
    }

    console.log(`[IAP Restore] ${result.orders.length}개의 미완료 주문 발견`);

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
          console.log(`[IAP Restore] 주문 ${order.orderId} 복원 완료`);
        }
      } catch (err) {
        console.error('[IAP Restore] 주문 복원 실패:', order.orderId, err);
        // 개별 주문 실패는 무시하고 다음 주문 처리
      }
    }
  } catch (err) {
    console.error('[IAP Restore] 미완료 주문 조회 실패:', err);
    throw err;
  }
}
