import {
  getFullName,
  getName,
  getPrecision,
  getPrice,
  getQuantity,
} from "./common";
import { POOLS_BODY } from "./config";
import { AlcorLiquidityPool, AlcorPair, AlcorPool, Token } from "./models";

/**
 * @name createPools
 * @param limit maximum number or pools requested
 * @param token1 limit to 1 pair
 * @param token2 limit to 1 pair
 * @returns Creates a optimized Set of AlcorPools from Alcor API
 */
export async function createPools(
  limit?: number,
  token1?: string,
  token2?: string
) {
  try {
    const body = POOLS_BODY(limit, token1, token2);
    const resp = await (
      await fetch("https://wax.eosn.io/v1/chain/get_table_rows", {
        body: JSON.stringify(body),
        method: "POST",
      })
    ).json();

    const newPools = TransformPools(resp.rows);
    return newPools;
  } catch (error) {
    console.error("Cannot get Alcor Pairs: ", error);
    throw error;
  }
}

const generateTokens = (pool: AlcorLiquidityPool) => {
  const { pool1, pool2 } = pool;
  const token1: Token = {
      ammount: 1,
      contract: pool1.contract,
      name: getName(pool1),
      fullName: getFullName(pool1),
      quantity: getQuantity(pool1),
      precision: getPrecision(pool1.quantity),
    },
    token2: Token = {
      ammount: 1,
      contract: pool2.contract,
      name: getName(pool2),
      fullName: getFullName(pool2),
      quantity: getQuantity(pool2),
      precision: getPrecision(pool2.quantity),
    };

  return { token1, token2 };
};

const generatePairs = (token1: Token, token2: Token, fee: number) => {
  const pair1Price = getPrice(token1, token2, fee, 1);
  const pair1Name = `${token1.name}/${token2.name}`;
  const pair1FullText = `1 ${token1.name} = ${pair1Price} ${token2.name}`;

  const pair2Price = getPrice(token2, token1, fee, 1);
  const pair2Name = `${token2.name}/${token1.name}`;
  const pair2FullText = `1 ${token2.name} = ${pair2Price} ${token1.name}`;

  const pair1: AlcorPair = {
    name: pair1Name,
    fullText: pair1FullText,
    fee: fee,
    price: pair1Price,
    token1: token1,
    token2: token2,
  };
  const pair2: AlcorPair = {
    name: pair2Name,
    fullText: pair2FullText,
    fee: fee,
    price: pair2Price,
    token1: token2,
    token2: token1,
  };
  return { pair1, pair2 };
};

/**
 * @description transforms Array from AlcorLiquidityPool[] to a more optimized Set of AlcorPools
 * @param pools Alcor Pools from API
 * @returns optimized Set of AlcorPools
 */
function TransformPools(pools: AlcorLiquidityPool[]) {
  const newPools: Set<AlcorPool> = new Set([]);
  pools.forEach((pool) => {
    const poolFee = pool.fee ? (pool.fee * 100) / 10000 : 0.3;
    const { token1, token2 } = generateTokens(pool);
    const { pair1, pair2 } = generatePairs(token1, token2, poolFee);
    const newPool: AlcorPool = {
      fee: poolFee,
      fee_contract: pool.fee_contract,
      id: pool.id,
      supply: parseFloat(pool.supply.split(" ")[0]),
      pair1,
      pair2,
      token1,
      token2,
    };
    newPools.add(newPool);
  });
  return newPools;
}
