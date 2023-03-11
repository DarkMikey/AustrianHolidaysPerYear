export interface ChartOptions {
  showValue?: boolean,
  maxBarLength?: number;
}

const bar = (value: number, maxValue: number, maxBarLength: number) => {
  const fractions = ['▏', '▎', '▍', '▋', '▊', '▉'];
  const barLength = value * maxBarLength / maxValue;
  const wholeNumberPart = Math.floor(barLength);
  const fractionalPart = barLength - wholeNumberPart;
  let bar = fractions[fractions.length - 1].repeat(wholeNumberPart);
  if (fractionalPart > 0)
    bar += fractions[Math.floor(fractionalPart * fractions.length)];
  return bar;
};

export const drawChart = (data: { [key: string]: number; }, options: ChartOptions = {}) => {
  const formatted = Object.keys(data).map(key => ({ key: key, value: data[key] }));
  const maxValue = Math.max(...formatted.map(item => item.value));
  const maxKeyNameLength = Math.max(...formatted.map(item => item.key.length));
  return formatted.map(item => {
    const prefix = item.key + " ".repeat(maxKeyNameLength - item.key.length + 1);
    const barText = bar(item.value, maxValue, options.maxBarLength ?? 100);
    const suffix = options.showValue ? ` ${item.value}` : "";
    return prefix + barText + suffix;
  }).join('\n');
};