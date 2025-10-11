// Tipos para Wompi Widget
declare global {
  interface Window {
    WompiWidget?: new (config: {
      container: HTMLElement;
      publicKey: string;
      amount: number;
      currency: string;
      reference: string;
      customerEmail: string;
      customerName: string;
      onSuccess: (transaction: any) => void;
      onError: (error: any) => void;
    }) => any;
    Wompi?: any;
  }
}

export {};
