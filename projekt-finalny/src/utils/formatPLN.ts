export function formatPLN(cents: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
  }).format(cents / 100);
}

