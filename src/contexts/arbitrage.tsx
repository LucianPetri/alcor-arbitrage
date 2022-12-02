import { createContext, FC, useContext, useEffect, useState } from "react";
import { createPairs, AlcorPair, AlcorPool, createPools, filterPairs, ArbitragePair } from "../utils";

interface ArbitrageContextType {}

const ArbitrageContext = createContext({} as ArbitrageContextType);

const useArbitrageHook: () => ArbitrageContextType = () => {
  const [pairs, setPairs] = useState<Set<AlcorPair>>(new Set([]));
  const [pools, setPools] = useState<Set<AlcorPool>>(new Set([]));
  const [arbPairs, setArbPairs] = useState<Set<ArbitragePair>>(new Set([]));
  const [whiteList, setWhiteList] = useState<Set<string>>(new Set(["WAX@eosio.token"]));
  const [blackList, setBlackList] = useState<Set<string>>(new Set([]));

  const generatePairs = async () => {
    try {
      const newPools: Set<AlcorPool> = await createPools();
      const newPairs = filterPairs(newPools, blackList, new Set([]));
      const newArbPairs = createPairs(newPairs, new Set(["WAX@eosio.token"]));
      setPools(newPools);
      setPairs(newPairs);
      setArbPairs(newArbPairs);
    } catch (error) {
      console.error("Cannot generate pairs: ", error);
    }
  };

  const process = async () => {
    try {
      // const processedPairs = await processPairs(pairs, blackList, whiteList);
      // console.log(processedPairs);
      // setPairs(processedPairs);
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    (async () => {
      await generatePairs();
    })();
  }, []);

  return {
    pairs,
    whiteList,
    blackList,
    setBlackList,
    setWhiteList,
    process,
  };
};

export const ArbitrageProvider: FC = ({ children }) => {
  const ArbitrageHook = useArbitrageHook();
  return <ArbitrageContext.Provider value={ArbitrageHook}>{children}</ArbitrageContext.Provider>;
};

export const useArbitrage = () => useContext(ArbitrageContext);
