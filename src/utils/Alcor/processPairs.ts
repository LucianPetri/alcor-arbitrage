import { getPools } from "./getPools";
import { ArbitragePair } from "./models";

function isImpactHigh(quantity: number, poolQuantity: number) {
  const impact = (quantity / poolQuantity) * 100;
  return 3 < impact;
}

export const processPairs = async (pairs: ArbitragePair[], blackList: Set<string>, whiteList: Set<string>) => {
  // const alcorPools = await getPools();
  // const symbols = getSymbols(alcorPools, blackList, whiteList);
  // const values = getValues(symbols, alcorPools);
  // const processed = pairs;
  // //Perform calculation and send alerts
  // pairs.forEach((pair, index) => {
  //   //continue if price is not updated for any symbol
  //   if (values[pair.trade1].price && values[pair.trade2].price && values[pair.trade3].price) {
  //     let initialQuantity = values[pair.trade1].quantity * 3 * 0.01;
  //     if (initialQuantity <= 0) {
  //       return;
  //     }
  //     let trade1_calc = 0;
  //     let trade2_calc = 0;
  //     let trade3_calc = 0;
  //     // let lv_str = "START: " + initialQuantity + pair.token1.split("@")[0] + "<br/>";
  //     //Level 1 calculation
  //     trade1_calc = Number(Number(Number(initialQuantity) / values[pair.trade1].price).toFixed(4));
  //     // lv_str += "->" + trade1_calc + pair.token2.split("@")[0] + "<br/>";
  //     if (isImpactHigh(trade1_calc, values[pair.trade2].quantity)) {
  //       return;
  //     }
  //     //Level 2 calculation
  //     trade2_calc = Number(Number(Number(trade1_calc) / values[pair.trade2].price).toFixed(4));
  //     // lv_str += "->" + Number(trade2_calc).toFixed(4) + pair.token3.split("@")[0] + "<br/>";
  //     if (isImpactHigh(trade2_calc, values[pair.trade3].quantity)) {
  //       return;
  //     }
  //     trade3_calc = Number(Number(Number(trade2_calc) / values[pair.trade3].price).toFixed(4));
  //     // lv_str += "TOTAL ->" + Number(trade3_calc).toFixed(4) + pair.d1.split("@")[0];
  //     if (isImpactHigh(trade2_calc, values[pair.trade3].quantity)) {
  //       return;
  //     }
  //     let increase = trade3_calc - initialQuantity;
  //     let decrease = initialQuantity - trade3_calc;
  //     processed[index].value = 0;
  //     if ((increase / Number(initialQuantity)) * 100 < 0) {
  //       processed[index].value = (decrease / initialQuantity) * -100;
  //     } else {
  //       processed[index].value = (increase / initialQuantity) * 100;
  //     }
  //   } else {
  //     processed[index].value = -100;
  //   }
  // });
  // return processed;
};
