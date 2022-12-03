export const POOLS_BODY = (
  limit: number = 200,
  token1: string = "",
  token2: string = "",
  reverse: boolean = false,
  show_payer: boolean = false
) => ({
  json: true,
  code: "alcorammswap",
  scope: "alcorammswap",
  table: "pairs",
  table_key: "",
  lower_bound: token1,
  upper_bound: token2,
  index_position: 1,
  key_type: "",
  limit,
  reverse,
  show_payer,
});

export const DEFAULT_WHITELIST = [
  "eosio.token",
  "alien.worlds",
  "e.rplanet",
  "xtokens",
  "eth.token",
];
export const DEFAULT_BLACKLIST = [
  "usdcoinchain",
  "pornhubgames",
  "createtokens",
  "getweedtoken",
  "machine.army",
  "onfederation",
  "martaintoken",
  "martiantoken",
  "superruncoin",
];

export const DEFAULT_TARGETLIST = ["WAX@eosio.token"];
