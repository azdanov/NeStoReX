const locale = "et-EE";

export const priceFormat = (value: number, config?: { fraction?: number }) => {
  const { fraction = 2 } = config ?? {};
  value = value / 100;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: fraction,
  }).format(value);
};

export const dateFormat = (date: Date) => {
  return new Intl.DateTimeFormat(locale).format(date);
};

export function wait<T>(ms: number, value?: T) {
  return new Promise<T>((resolve) => setTimeout(resolve, ms, value));
}
