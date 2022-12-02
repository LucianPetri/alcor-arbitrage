/**
 * @name AlcorToken
 * @param contract eosio.token
 * @param quantity "1230424.3240234 WAX"
 */
export interface AlcorToken {
  contract: string;
  quantity: string;
}

/**
 * @name Token
 * @param name WAX
 * @param contract eosio.token
 * @param fullName WAX@eosio.token
 * @param quantity Number(234324.235256)
 */
export interface Token {
  name: string;
  contract: string;
  fullName: string;
  quantity: number;
}

/**
 * @name AlcorPair
 * @param name "WAX@eosio.token|TLM@alien.worlds"
 * @param price 0.234234
 * @param fee 0.0023423
 * @param quantity 234324.235256
 */
export type AlcorPair = {
  name: string;
  price: number;
  fee: number;
  quantity: number;
};

/**
 * @name AlcorLiquidityPool
 * @param id 0
 * @param supply "32894562.3242 WAX"
 * @param fee 30
 * @param fee_contract "aw.aq.waa"
 * @param pool1 {contract: "eosio.token", quantity: "2304.3242 WAX"}
 * @param pool2 {contract: "alien.worlds", quantity: "2304.3242 TLM"}
 *
 */
export interface AlcorLiquidityPool {
  id: number;
  supply: string;
  fee: number;
  fee_contract: string;
  pool1: AlcorToken;
  pool2: AlcorToken;
}

/**
 * @name AlcoorPool
 * @param id 0
 * @param supply Number(32894562.3242)
 * @param fee 30
 * @param fee_contract "aw.aq.waa"
 * @param pair1 {name: "WAX@eosio.token|TLM@alien.worlds", price: 0.234234, fee: 0.0023423, quantity: 234324.235256}
 * @param pool2 {name: "TLM@alien.worlds|WAX@eosio.token", price: 0.234234, fee: 0.0023423, quantity: 234324.235256}
 * @param token1 {name: "WAX", contract: "eosio.token" fullName: "WAX@eosio.token" quantity: 139845.23245}
 * @param token2 {name: "TLM", contract: "alien.worlds" fullName: "TLM@alien.worlds" quantity: 139845.23245}
 */
export interface AlcorPool {
  supply: number;
  id: number;
  fee: number;
  fee_contract: string;
  pair1: AlcorPair;
  pair2: AlcorPair;
  token1: Token;
  token2: Token;
}

/**
 * @name ArbitragePair
 * @param token1 {name: "WAX", contract: "eosio.token" fullName: "WAX@eosio.token" quantity: 139845.23245}
 * @param token2 {name: "TLM", contract: "aliend.worlds" fullName: "TLM@aliend.worlds" quantity: 139845.23245}
 * @param token3 {name: "EAR", contract: "aliend.worlds" fullName: "EAR@aliend.worlds" quantity: 139845.23245}
 * @param trade1 {name: "WAX@eosio.token|TLM@alien.worlds", price: 0.234234, fee: 0.0023423, quantity: 234324.235256}
 * @param trade2 {name: "TLM@eosio.token|EAR@alien.worlds", price: 0.234234, fee: 0.0023423, quantity: 234324.235256}
 * @param trade3 {name: "EAR@alien.worlds|WAX@eosio.token", price: 0.234234, fee: 0.0023423, quantity: 234324.235256}
 * @param value TOTAL VALUE OF TRADE
 */
export type ArbitragePair = {
  token1: Token;
  token2: Token;
  token3: Token;
  trade1: AlcorPair;
  trade2: AlcorPair;
  trade3: AlcorPair;
  value: number;
};
