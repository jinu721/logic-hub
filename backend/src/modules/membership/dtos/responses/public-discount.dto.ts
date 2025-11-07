export interface PublicDiscountDTO {
  active: boolean;
  amount: string;
  type: "percentage" | "fixed";
  validUntil: string;
}