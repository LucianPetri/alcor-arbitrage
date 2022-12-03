import { createContext, FC, useContext, useEffect, useState } from "react";
import {
  createPairs,
  AlcorPair,
  AlcorPool,
  createPools,
  filterPairs,
  ArbitragePair,
} from "../utils";
import { DEFAULT_BLACKLIST, DEFAULT_WHITELIST } from "../utils/Alcor/config";

interface ArbitrageContextType {
  pools: Set<AlcorPool>;
  pairs: Set<AlcorPair>;
  minArb: number;
  limit: number;
  arbPairs: Set<ArbitragePair>;
  whiteList: Set<string>;
  blackList: Set<string>;
  targetList: Set<string>;
  setMinArb: (minArb: number) => void;
  setLimit: (limit: number) => void;
  setBlackList: (blackList: Set<string>) => void;
  setWhiteList: (witeList: Set<string>) => void;
  setTargetList: (witeList: Set<string>) => void;
}

const ArbitrageContext = createContext<ArbitrageContextType>(
  {} as ArbitrageContextType
);

const useArbitrageHook: () => ArbitrageContextType = () => {
  const [pools, setPools] = useState<Set<AlcorPool>>(new Set([]));
  const [pairs, setPairs] = useState<Set<AlcorPair>>(new Set([]));
  const [arbPairs, setArbPairs] = useState<Set<ArbitragePair>>(new Set([]));

  const [whiteList, setWhiteList] = useState<Set<string>>(
    new Set(DEFAULT_WHITELIST)
  );
  const [blackList, setBlackList] = useState<Set<string>>(
    new Set(DEFAULT_BLACKLIST)
  );
  const [targetList, setTargetList] = useState<Set<string>>(
    new Set(["WAX@eosio.token"])
  );

  const [minArb, setMinArb] = useState<number>(0.1);
  const [limit, setLimit] = useState<number>(100000);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [startAmmount, setStartAmmount] = useState<number>(1);

  const generatePairs = async () => {
    try {
      const newPools: Set<AlcorPool> = await createPools(limit);
      const newPairs = filterPairs(newPools, blackList, whiteList);
      const newArbPairs = createPairs(
        newPairs,
        targetList,
        minArb,
        slippage,
        startAmmount,
        true
      );
      setPools(newPools);
      setPairs(newPairs);
      setArbPairs(newArbPairs);
    } catch (error) {
      console.error("Cannot generate pairs: ", error);
    }
  };

  useEffect(() => {
    (async () => {
      const newPools: Set<AlcorPool> = await createPools(limit);
      setPools(newPools);
    })();
  }, []);

  useEffect(() => {
    if (pools.size > 0) {
      const newPairs = filterPairs(pools, blackList, whiteList);
      setPairs(newPairs);
    }
  }, [pools]);

  useEffect(() => {
    if (pairs.size > 0) {
      const newArbPairs = createPairs(
        pairs,
        targetList,
        minArb,
        slippage,
        startAmmount,
        true
      );
      setArbPairs(newArbPairs);
    }
  }, [pairs]);

  return {
    pools,
    pairs,
    minArb,
    limit,
    arbPairs,
    whiteList,
    blackList,
    targetList,
    setMinArb,
    setLimit,
    setBlackList,
    setWhiteList,
    setTargetList,
  };
};

export const ArbitrageProvider: FC = ({ children }) => {
  const ArbitrageHook: ArbitrageContextType = useArbitrageHook();
  return (
    <ArbitrageContext.Provider value={ArbitrageHook}>
      {children}
    </ArbitrageContext.Provider>
  );
};

export const useArbitrage = () => useContext(ArbitrageContext);
