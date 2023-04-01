export enum ClientMessageType {
  subscribeMarketData = 1,
  unsubscribeMarketData,
  placeOrder,
}

export enum ServerMessageType {
  success = 1,
  error,
  executionReport,
  marketDataUpdate,
}

export enum OrderSide {
  buy = 'Buy',
  sell = 'Sell',
}

export enum OrderStatus {
  active = 'Active',
  filled = 'Filled',
  rejected = 'Rejected',
  cancelled = 'Cancelled',
}

export enum Instrument {
  eur_usd = 'EUR/USD',
  eur_rub = 'EUR/RUB',
  usd_rub = 'USD/RUB',
}
