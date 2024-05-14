// DataManipulator.ts

import { ServerRespond } from './DataStreamer';

interface Row {
  stock: string;
  top_ask_price: number;
  top_bid_price: number;
  timestamp: Date;
  ratio: number;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined; // Change to allow undefined value for trigger_alert
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const price_abc = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const price_def = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = price_abc / price_def;
    const upper_bound = 1.05;
    const lower_bound = 0.95;
    const trigger_alert = ratio > upper_bound || ratio < lower_bound ? ratio : undefined;

    return {
      stock: 'ratio',
      top_ask_price: NaN,
      top_bid_price: NaN,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
      ratio,
      upper_bound,
      lower_bound,
      trigger_alert
    };
  }
}
