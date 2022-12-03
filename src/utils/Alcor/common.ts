import {
  AlcorLiquidityPool,
  AlcorPair,
  AlcorPool,
  AlcorToken,
  Token,
} from "./models";

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
export const getFullName = (token: AlcorToken) =>
  `${token.quantity.split(" ")[1]}@${token.contract}`;

/**
 *
 * @param token Alcor Token
 * @returns quantity as number
 */
export const getQuantity = (token: AlcorToken) =>
  parseFloat(token.quantity.split(" ")[0]);

/**
 *
 * @param token Alcor Token
 * @returns token precision as number
 */
export const getPrecision = (quantity: string) =>
  quantity.split(" ")[0].split(".")[1]?.length || 4;

/**
 *
 * @param token1 Alcor Token
 * @param token2 Alcor Token
 * @returns price as number
 */
export const getPrice = (
  token1: Token,
  token2: Token,
  fee: number,
  ammount?: number
) => {
  const TokenWithFee = ammount
    ? ammount * (10000 - fee)
    : token1.ammount * (10000 - fee);
  const numerator = TokenWithFee * token2.quantity;
  const denominator = token1.quantity * 10000 + TokenWithFee;
  return numerator / denominator;
};

/**
 *
 * @param set Either blackList or whiteList filter
 * @param token1 Token 1 in Alcor Pool
 * @param token2 Token2 in Alcor Pool
 * @returns if Either Token is in Set
 */
export const TokenNameInSet = (
  set: Set<string>,
  token1: string,
  token2: string
) => set.has(token1) || set.has(token2);

/**
 *
 * @param pools Alcor Liquidity Pools
 * @param blackList Filter through blacklist
 * @param whiteList Filter through whiteList
 * @returns Unique Symbols Set
 */
export const filterPairs = (
  pools: Set<AlcorPool>,
  blackList: Set<string>,
  whiteList: Set<string>
) => {
  const pairs: Set<AlcorPair> = new Set([]);
  pools.forEach((pool) => {
    const { pair1, pair2, token1, token2 } = pool;
    if (
      blackList.size > 0 &&
      TokenNameInSet(blackList, token1.contract, token2.contract)
    ) {
      return;
    }

    if (
      whiteList.size > 0 &&
      !TokenNameInSet(whiteList, token1.contract, token2.contract)
    ) {
      return;
    }

    pairs.add(pair1);
    pairs.add(pair2);
  });
  return pairs;
};
