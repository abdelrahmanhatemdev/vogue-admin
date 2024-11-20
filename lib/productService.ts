export const discountPrice = ({
  price,
  discount,
}: {
  price: number;
  discount: number;
}): number => {
  return price - price * (discount / 100);
};

export const currencyPrice = ({
  price,
  currency,
}: {
  price: number;
  currency?: string;
}): string => {
  
  console.log("currency", currency);
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ? currency : "USD",
  }).format(price);
};
