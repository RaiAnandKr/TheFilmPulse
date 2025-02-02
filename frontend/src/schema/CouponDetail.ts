export interface CouponDetail {
  couponId: string;
  worthCoins: number;
  couponLogoSrc: string;
  couponInfo: string;
  couponBrandName: string;
  couponExpiryDate: string;
  couponTnCs?: string[];
}

export interface CouponCode {
  codeId: string;
  code: string;
  expiryDate: string;
}
