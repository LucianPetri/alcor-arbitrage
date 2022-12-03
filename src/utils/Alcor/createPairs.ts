import { getPrice } from "./common";
import { AlcorPair, ArbitragePair, Token } from "./models";

const generateNewPair = (startPair: AlcorPair, ammount: number) => {
  const price = getPrice(
    startPair.token1,
    startPair.token2,
    startPair.fee,
    ammount
  );
  return {
    fee: startPair.fee,
    name: startPair.name,
    price: price,
    fullText: `${ammount} ${startPair.token1.name} = ${price} ${startPair.token2.name}`,
    token1: { ...startPair.token1, ammount: ammount },
    token2: { ...startPair.token2, ammount: price },
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

        const newPair1 = generateNewPair(firstPair, startAmmount);
        const newPair2 = generateNewPair(pivotPair, newPair1.token2.ammount);
        const newPair3 = generateNewPair(lastPair, newPair2.token2.ammount);

        if (newPair1.token1.ammount > newPair3.token2.ammount) {
          return;
        }

        const DIV_PRICE = newPair1.price / newPair3.price;

        if (
          pivotPair.price > DIV_PRICE * (1 + minArb + slippage / 100) &&
          pivotPair.price - DIV_PRICE < 100
        ) {
          const newArb: ArbitragePair = {
            token1: newPair1.token1,
            token2: newPair1.token2,
            token3: newPair3.token1,
            trade1: newPair1,
            trade2: newPair2,
            trade3: newPair3,
            value: newPair2.price - DIV_PRICE,
          };
          newArbs.add(newArb);
        } else if (
          newPair2.price < DIV_PRICE * (1 + minArb + slippage / 100) &&
          DIV_PRICE - newPair2.price < 100
        ) {
          const newArb: ArbitragePair = {
            token1: newPair1.token1,
            token2: newPair1.token2,
            token3: newPair3.token1,
            trade1: newPair1,
            trade2: newPair2,
            trade3: newPair3,
            value: DIV_PRICE - newPair2.price,
          };
          newArbs.add(newArb);
        } else if (allowInvalid) {
          const newArb: ArbitragePair = {
            token1: newPair1.token1,
            token2: newPair1.token2,
            token3: newPair3.token1,
            trade1: newPair1,
            trade2: newPair2,
            trade3: newPair3,
            value: -100,
          };
          newArbs.add(newArb);
        }
      });
    });
  });

  return newArbs;
};
