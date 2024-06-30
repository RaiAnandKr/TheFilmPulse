import type { CoinType } from './CoinType';

export interface Coin {
  type: CoinType;
  coins: number;
  isRedeemable: boolean;
}