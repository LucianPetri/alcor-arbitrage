import { getPrice } from "./common";
import { AlcorPair, ArbitragePair } from "./models";

const generateNewPair = (pair: AlcorPair, ammount: number) => {
  const { fee, token1, token2, name } = pair;
  const price = getPrice(token1, token2, fee, ammount);
  return {
    fee: fee,
    name: name,
    price: price,
    fullText: `${ammount.toFixed(token1.precision)} ${token1.name} = ${price.toFixed(token2.precision)} ${token2.name}`,
    token1: { ...token1, ammount: Number(ammount.toFixed(token1.precision)) },
    token2: { ...token2, ammount: price },
  };
};

export const createPairs = (pairs: Set<AlcorPair>, targetTokens: Set<string>, minArb: number = 2, slippage: number = 3, startAmmount: number = 1, allowInvalid: boolean = false) => {
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

        const newPair1 = generateNewPair(firstPair, startAmmount);
        const newPair2 = generateNewPair(pivotPair, newPair1.token2.ammount);
        const newPair3 = generateNewPair(lastPair, newPair2.token2.ammount);

        let winValue = newPair3.price - startAmmount;

        if (winValue < 0 && !allowInvalid) {
          return;
        }

        const newArb: ArbitragePair = {
          token1: newPair1.token1,
          token2: newPair1.token2,
          token3: newPair3.token1,
          trade1: newPair1,
          trade2: newPair2,
          trade3: newPair3,
          value: winValue,
        };
        newArbs.add(newArb);
      });
    });
  });

  return newArbs;
};
