import { AlcorPair, ArbitragePair, Token } from "./models";

export const createPairs = (pairs: Set<AlcorPair>, targetTokens: Set<string>, minArb: number) => {
  const firstPairs: Set<AlcorPair> = new Set([]);
  const pivotPairs: AlcorPair[] = [];
  const lastPairs: Set<AlcorPair> = new Set([]);
  const newArbs: Set<ArbitragePair> = new Set([]);

  pairs.forEach((pair) => {
    if (targetTokens.has(pair.token1.fullName)) {
      firstPairs.add(pair);
    }
  });
  pairs.forEach((pair) => {
    if (targetTokens.has(pair.token2.fullName)) {
      lastPairs.add(pair);
    }
  });
  pairs.forEach((pair) => {
    if (!firstPairs.has(pair) && !lastPairs.has(pair) && !targetTokens.has(pair.token1.fullName) && !targetTokens.has(pair.token2.fullName)) {
      const isInFirst = [...firstPairs].find((fp) => fp.token2.fullName === pair.token1.fullName);
      const isInLast = [...lastPairs].find((lp) => lp.token1.fullName === pair.token2.fullName);
      if (isInFirst && isInLast) {
        pivotPairs.push(pair);
      }
    }
  });
  firstPairs.forEach((firstPair) => {
    lastPairs.forEach((lastPair) => {
      if (firstPair.token1.fullName === lastPair.token2.fullName) {
        const pivotPair = pivotPairs.find((p) => p.token1.fullName === firstPair.token2.fullName && p.token2.fullName === lastPair.token1.fullName);
        if (pivotPair) {
          const divPrice = firstPair.price / lastPair.price;

          if (pivotPair.price > divPrice * (1 + minArb / 100)) {
            const newArb: ArbitragePair = {
              token1: firstPair.token1,
              token2: firstPair.token2,
              token3: lastPair.token1,
              trade1: firstPair,
              trade2: pivotPair,
              trade3: lastPair,
              value: pivotPair.price - divPrice,
            };
            newArbs.add(newArb);
          } else {
            const newArb: ArbitragePair = {
              token1: firstPair.token1,
              token2: firstPair.token2,
              token3: lastPair.token1,
              trade1: firstPair,
              trade2: pivotPair,
              trade3: lastPair,
              value: -100,
            };
            newArbs.add(newArb);
          }
        }
      }
    });
  });

  return newArbs;
};
