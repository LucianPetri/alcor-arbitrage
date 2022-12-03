import { AlcorLiquidityPool } from "./models";

export const price = (
  input: any,
  output: any,
  inputAmount: string,
  outputAmount: string
) => {
  if (!(parseFloat(inputAmount) && parseFloat(outputAmount))) return "0.0000";

  const rate = (parseFloat(outputAmount) / parseFloat(inputAmount)).toFixed(4);

  return `${input.symbol} = ${rate} ${output.symbol}`;
};

export const fee = (pair: any) => {
  return pair ? (pair.fee * 100) / 10000 : 0.3;
};

export const priceImpact = (
  token2: any,
  inputAmount: string,
  outputAmount: string
) => {
  if (!(parseFloat(inputAmount) && parseFloat(outputAmount))) return 0.0;

  return parseFloat(
    (
      ((parseFloat(outputAmount) * 0.97) / parseFloat(token2.quantity)) *
      100
    ).toFixed(2)
  );
};

export function get_amount_out(
  amount_in: number,
  reserve_in: number,
  reserve_out: number,
  fee = 30
) {
  const amount_in_with_fee = amount_in * (10000 - fee);
  const numerator = amount_in_with_fee * reserve_out;
  const denominator = reserve_in * 10000 + amount_in_with_fee;

  return numerator / denominator;
}
