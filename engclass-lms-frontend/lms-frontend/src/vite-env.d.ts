/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_MIDTRANS_CLIENT_KEY: string;
}

interface Window {
  snap?: {
    pay: (
      token: string,
      options: {
        onSuccess: (result: { order_id?: string }) => void;
        onPending: (result: { order_id?: string }) => void;
        onError: (result: { status_message?: string }) => void;
        onClose: () => void;
      }
    ) => void;
  };
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
