import { getPrice, getPriceImpact } from "./common";
import { AlcorPair, ArbitragePair } from "./models";

const generateNewPair = (
  pair: AlcorPair,
  ammount: number,
  slippage: number
) => {
  const { fee, token1, token2, name } = pair;
  const price = getPrice(token1, token2, fee + slippage * 10, ammount);
  const impact = getPriceImpact({
    ...token2,
    ammount: Number(price.toFixed(token2.precision)),
  });
  return {
    fee: fee,
    name: name,
    price: price,
    fullText: `${ammount.toFixed(token1.precision)} ${
      token1.name
    } = ${price.toFixed(token2.precision)} ${token2.name} impact: ${impact}`,
    token1: { ...token1, ammount: Number(ammount.toFixed(token1.precision)) },
    token2: { ...token2, ammount: Number(price.toFixed(token2.precision)) },
  };
};

export const createPairs = (
  pairs: Set<AlcorPair>,
  targetTokens: Set<string>,
  minArb: number = 2,
  slippage: number = 3,
  startAmmount: number = 1,
  allowInvalid: boolean = false
) => {
  const firstPairs: Set<AlcorPair> = new Set([]);
  const lastPairs: Set<AlcorPair> = new Set([]);
  const newArbs: Set<ArbitragePair> = new Set([]);

  // get Pairs with first Token is the Target Token
  pairs.forEach((firstPair) => {
    if (targetTokens.has(firstPair.token1.fullName)) {
      firstPairs.add(firstPair);
    }
  });

  // get Pairs with last Token is the Target Token
  pairs.forEach((lastPair) => {
    if (targetTokens.has(lastPair.token2.fullName)) {
      lastPairs.add(lastPair);
    }
  });

  // get Pivot pair imbetween and generate ArbPair
  pairs.forEach((pivotPair) => {
    if (firstPairs.has(pivotPair)) {
      return;
    }
    if (lastPairs.has(pivotPair)) {
      return;
    }
    firstPairs.forEach((firstPair) => {
      lastPairs.forEach((lastPair) => {
        if (firstPair.token2.fullName !== pivotPair.token1.fullName) {
          return;
        }
        if (lastPair.token1.fullName !== pivotPair.token2.fullName) {
          return;
        }

        if (firstPair.token1.fullName !== lastPair.token2.fullName) {
          return;
        }
        const newPair1 = generateNewPair(firstPair, startAmmount, slippage);
        if (getPriceImpact(newPair1.token2) > slippage) {
          return;
        }
        const newPair2 = generateNewPair(
          pivotPair,
          newPair1.token2.ammount,
          slippage
        );
        if (getPriceImpact(newPair2.token2) > slippage) {
          return;
        }
        const newPair3 = generateNewPair(
          lastPair,
          newPair2.token2.ammount,
          slippage
        );
        if (getPriceImpact(newPair3.token2) > slippage) {
          return;
        }

        let value = Number(
          (newPair3.price - newPair1.token1.ammount).toFixed(
            newPair1.token1.precision
          )
        );
        let percentage = value / newPair1.token1.ammount;

        if (value < 0 && !allowInvalid) {
          return;
        }

        if (percentage < -0.9) {
          return;
        }

        const newArb: ArbitragePair = {
          token1: newPair1.token1,
          token2: newPair1.token2,
          token3: newPair3.token1,
          trade1: newPair1,
          trade2: newPair2,
          trade3: newPair3,
          value: value,
          percentage: (percentage * 100).toFixed(2) + "%",
        };
        newArbs.add(newArb);
      });
    });
  });

  return newArbs;
};
