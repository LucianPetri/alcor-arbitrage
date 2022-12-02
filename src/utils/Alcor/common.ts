import { AlcorLiquidityPool, AlcorPair, AlcorPool, AlcorToken } from "./models";

/**
 *
 * @param token Alcor pool token containing quantity and contract
 * @returns token quantity@contract name ex: WAX@eosio.token
 */
export const getName = (token: AlcorToken) => `${token.quantity.split(" ")[1]}`;

/**
 *
 * @param token Alcor pool token containing quantity and contract
 * @returns token quantity@contract name ex: WAX@eosio.token
 */
export const getFullName = (token: AlcorToken) => `${token.quantity.split(" ")[1]}@${token.contract}`;

/**
 *
 * @param token Alcor Token
 * @returns quantity as number
 */
export const getQuantity = (token: AlcorToken) => Number(token.quantity.split(" ")[0]);

/**
 *
 * @param set Either blackList or whiteList filter
 * @param token1 Token 1 in Alcor Pool
 * @param token2 Token2 in Alcor Pool
 * @returns if Either Token is in Set
 */
export const TokenNameInSet = (set: Set<string>, token1: string, token2: string) => set.has(token1) || set.has(token2);

const generatePair = (pool: AlcorLiquidityPool) => {
  const { pool1, pool2 } = pool;
  const token1 = {
      contract: pool1.contract,
      name: getName(pool1),
      fullName: getFullName(pool1),
      quantity: getQuantity(pool1),
    },
    token2 = {
      contract: pool2.contract,
      name: getName(pool2),
      fullName: getFullName(pool2),
      quantity: getQuantity(pool2),
    };
  const token1Price = (token1.quantity + 3 * (token1.quantity / 100)) / (token2.quantity - 3 * (token2.quantity / 100));
  const token2Price = (token2.quantity + 3 * (token2.quantity / 100)) / (token1.quantity - 3 * (token1.quantity / 100));
  const fee1 = token1Price * (4 + 0.3) * 0.01;
  const fee2 = token2Price * (4 + 0.3) * 0.01;
  const estimatedPrice1 = token1Price + fee1;
  const estimatedPrice2 = token2Price + fee2;
  const pair1: AlcorPair = { name: token1.fullName + "|" + token2.fullName, fee: fee1, price: estimatedPrice1, quantity: token1.quantity, token1: token1, token2: token2 };
  const pair2: AlcorPair = { name: token2.fullName + "|" + token1.fullName, fee: fee2, price: estimatedPrice2, quantity: token2.quantity, token1: token2, token2: token1 };
  return { token1, token2, pair1, pair2 };
};

/**
 *
 * @param pools Alcor Pool from API
 * @returns optimized Set of AlcorPools
 */
const TransformPool: (pools: AlcorLiquidityPool[]) => Set<AlcorPool> = (pools: AlcorLiquidityPool[]) => {
  const newPools: Set<AlcorPool> = new Set([]);
  pools.forEach((pool) => {
    const { pair1, pair2, token1, token2 } = generatePair(pool);
    const newPool: AlcorPool = {
      fee: pool.fee,
      fee_contract: pool.fee_contract,
      id: pool.id,
      supply: Number(Number(pool.supply.split(" ")[0])),
      pair1,
      pair2,
      token1,
      token2,
    };
    newPools.add(newPool);
  });
  return newPools;
};

/**
 *
 * @param pools Alcor Liquidity Pools
 * @param blackList Filter through blacklist
 * @param whiteList Filter through whiteList
 * @returns Unique Symbols Set
 */
export const filterPairs = (pools: Set<AlcorPool>, blackList: Set<string>, whiteList: Set<string>) => {
  const pairs: Set<AlcorPair> = new Set([]);
  pools.forEach((pool) => {
    const { pair1, pair2, token1, token2 } = pool;
    if (blackList.size > 0 && TokenNameInSet(blackList, token1.fullName, token2.fullName)) {
      return;
    }

    if (whiteList.size > 0 && !TokenNameInSet(whiteList, token1.fullName, token2.fullName)) {
      return;
    }

    pairs.add(pair1);
    pairs.add(pair2);
  });
  return pairs;
};

/**
 *
 * @returns Creates a optimized Set of AlcorPools from Alcor API
 */
export const createPools = async () => {
  try {
    const body = {
      json: true,
      code: "alcorammswap",
      scope: "alcorammswap",
      table: "pairs",
      table_key: "",
      lower_bound: "",
      upper_bound: "",
      index_position: 1,
      key_type: "",
      limit: 200,
      reverse: false,
      show_payer: false,
    };

    const resp = await (
      await fetch("https://wax.eosn.io/v1/chain/get_table_rows", {
        body: JSON.stringify(body),
        method: "POST",
      })
    ).json();

    const newPools = TransformPool(resp.rows);
    return newPools;
  } catch (error) {
    console.error("Cannot get Alcor Pairs: ", error);
    throw error;
  }
};
