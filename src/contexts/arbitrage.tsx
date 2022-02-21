import { createContext, FC, useContext, useState } from "react";
import { createPairs, ArbitragePair, processPairs } from "../utils/AlcorUtils";
import { useAsync } from "../utils/useAsyncEffect";

interface ArbitrageContextType {}

const ArbitrageContext = createContext({} as ArbitrageContextType);

const useArbitrageHook: () => ArbitrageContextType = () => {
    const [pairs, setPairs] = useState<ArbitragePair[]>([]);
    const [whiteList, setWhiteList] = useState<string[]>([]);
    const [blackList, setBlackList] = useState<string[]>([]);

    const generatePairs = async () => {
        try {
            const newPairs = await createPairs(blackList, whiteList);
            setPairs(newPairs);
        } catch (error) {
            console.error("Cannot generate pairs: ", error);
        }
    };

    const process = async () => {
        try {
            const processedPairs = await processPairs(pairs);
            setPairs(processedPairs);
        } catch (e) {
            throw (e);
        }
    };

    useAsync(async () => {
        
    },[])

    return {
        pairs,
        whiteList,
        blackList,
        setBlackList,
        setWhiteList,
        process
    };
};

export const ArbitrageProvider: FC = ({ children }) => {
    const ArbitrageHook = useArbitrageHook();
    return <ArbitrageContext.Provider value={ArbitrageHook}>{children}</ArbitrageContext.Provider>;
};

export const useArbitrage = () => useContext(ArbitrageContext);
