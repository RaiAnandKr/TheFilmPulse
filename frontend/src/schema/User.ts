import type { Coin } from './Coin';

export interface User {
  username: string;
  email?: string;
  state?: string;
  coins: Coin[];
  // This is not some coin which is owned by the user but more
  // of a custom field and hence keeping it separate.
  maxOpinionCoins: number;
}