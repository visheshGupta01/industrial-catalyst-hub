export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

// Back-compat alias — currency switched from USD to INR.
export const formatUSD = formatINR;

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}
