import { AlcorPair, ArbitragePair } from "./models";

export const createPairs = (pairs: Set<AlcorPair>) => {
  const newArbs: Set<ArbitragePair> = new Set([]);
  // symbols.forEach((d1) => {
  //   symbols.forEach((d2) => {
  //     symbols.forEach((d3) => {
  //       if (d1 == d2 || d2 == d3 || d3 == d1) {
  //         return;
  //       }

  //       let lv1 = [],
  //         lv2 = [],
  //         lv3 = [];
  //       if (values[d1 + d2]) {
  //         lv1.push(d1 + d2);
  //       }
  //       if (values[d2 + d1]) {
  //         lv1.push(d2 + d1);
  //       }

  //       if (values[d2 + d3]) {
  //         lv2.push(d2 + d3);
  //       }
  //       if (values[d3 + d2]) {
  //         lv2.push(d3 + d2);
  //       }

  //       if (values[d3 + d1]) {
  //         lv3.push(d3 + d1);
  //       }
  //       if (values[d1 + d3]) {
  //         lv3.push(d1 + d3);
  //       }

  //       if (lv1.length && lv2.length && lv3.length) {
  //         pairs.push({
  //           token1: d1,
  //           token2: d2,
  //           token3: d3,
  //           trade1: lv1[0],
  //           trade2: lv2[0],
  //           trade3: lv3[0],
  //           value: -100,
  //         });
  //       }
  //     });
  //   });
  // });

  return newArbs;
};
