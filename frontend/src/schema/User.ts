export interface User {
  username: string;
  email?: string;
  state?: string;
  bonusCoins: number;
  earnedCoins: number;
  maxOpinionCoins: number;
}