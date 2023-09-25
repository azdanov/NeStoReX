export const priceFormat = (value: number, config?: { fraction?: number }) => {
  const { fraction = 2 } = config ?? {};
  value = value / 100;

  return new Intl.NumberFormat("et-EE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: fraction,
  }).format(value);
};

export function getCookie(key: string) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(key));

  if (!cookie) {
    return;
  }

  return cookie.split("=")[1];
}
