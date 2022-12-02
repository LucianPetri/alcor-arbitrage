import { createContext, FC, useContext, useEffect, useState } from "react";
import { createPairs, AlcorPair, AlcorPool, createPools, filterPairs, ArbitragePair } from "../utils";

interface ArbitrageContextType {
  pools: Set<AlcorPool>;
  pairs: Set<AlcorPair>;
  minArb: number;
  arbPairs: Set<ArbitragePair>;
  whiteList: Set<string>;
  blackList: Set<string>;
  targetList: Set<string>;
  setMinArb: (minArb: number) => void;
  setBlackList: (blackList: Set<string>) => void;
  setWhiteList: (witeList: Set<string>) => void;
  setTargetList: (witeList: Set<string>) => void;
}

const ArbitrageContext = createContext<ArbitrageContextType>({} as ArbitrageContextType);

const useArbitrageHook: () => ArbitrageContextType = () => {
  const [pairs, setPairs] = useState<Set<AlcorPair>>(new Set([]));
  const [pools, setPools] = useState<Set<AlcorPool>>(new Set([]));
  const [arbPairs, setArbPairs] = useState<Set<ArbitragePair>>(new Set([]));
  const [whiteList, setWhiteList] = useState<Set<string>>(new Set([]));
  const [blackList, setBlackList] = useState<Set<string>>(new Set([]));
  const [targetList, setTargetList] = useState<Set<string>>(new Set(["WAX@eosio.token"]));
  const [minArb, setMinArb] = useState<number>(2);

  const generatePairs = async () => {
    try {
      const newPools: Set<AlcorPool> = await createPools();
      const newPairs = filterPairs(newPools, blackList, whiteList);
      const newArbPairs = createPairs(newPairs, targetList, minArb);
      setPools(newPools);
      setPairs(newPairs);
      setArbPairs(newArbPairs);
    } catch (error) {
      console.error("Cannot generate pairs: ", error);
    }
  };

  useEffect(() => {
    (async () => {
      await generatePairs();
    })();
  }, []);

  return {
    pools,
    pairs,
    minArb,
    arbPairs,
    whiteList,
    blackList,
    targetList,
    setMinArb,
    setBlackList,
    setWhiteList,
    setTargetList,
  };
};

export const ArbitrageProvider: FC = ({ children }) => {
  const ArbitrageHook: ArbitrageContextType = useArbitrageHook();
  return <ArbitrageContext.Provider value={ArbitrageHook}>{children}</ArbitrageContext.Provider>;
};

export const useArbitrage = () => useContext(ArbitrageContext);
