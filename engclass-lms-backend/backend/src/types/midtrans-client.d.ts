declare module 'midtrans-client' {
  interface MidtransConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  interface TransactionNotification {
    order_id: string;
    transaction_status: string;
    fraud_status?: string;
    gross_amount: string;
    payment_type: string;
    [key: string]: unknown;
  }

  interface SnapTransactionResult {
    token: string;
    redirect_url: string;
  }

  export class Snap {
    constructor(config: MidtransConfig);
    createTransaction(parameter: Record<string, unknown>): Promise<SnapTransactionResult>;
  }

  export class CoreApi {
    constructor(config: MidtransConfig);
    transaction: {
      notification(payload: Record<string, unknown>): Promise<TransactionNotification>;
    };
  }

  const _default: { Snap: typeof Snap; CoreApi: typeof CoreApi };
  export default _default;
}
