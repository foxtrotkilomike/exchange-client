export enum ClientMessageType {
  subscribeMarketData = 1,
  unsubscribeMarketData,
  placeOrder,
  cancelOrder,
}

export enum ServerMessageType {
  success = 'success',
  error = 'error',
  executionReport = 'executionReport',
  marketDataUpdate = 'marketDataUpdate',
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

export enum WSEvent {
  close = 'close',
  error = 'error',
  message = 'message',
  open = 'open',
}
