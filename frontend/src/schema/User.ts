export interface User {
  id: number;
  userhandle: string;
  phoneNumber: string;
  bonusCoins: number;
  earnedCoins: number;
  isBanned?: boolean;
  email?: string;
  state?: string;

  // This is not some coin which is owned by the user but more
  // of a custom field and hence keeping it separate.
  maxOpinionCoins?: number;
}

export interface UserResponse {
  bonus_coins: number;
  earned_coins: number;
  id: number;
  is_banned: boolean;
  phone_number: string;
  username: string;
  email?: string;
  state?: string;
  max_opinion_coins?: number;
}
