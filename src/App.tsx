import { ChakraProvider } from "@chakra-ui/react";
import { ArbTable } from "./components/ArbTable";
import { Menu } from "./components/Menu";
import { ArbitrageProvider } from "./contexts/arbitrage";

function App() {
    return (
        <ChakraProvider>
            <ArbitrageProvider>
                <ArbTable />
                <Menu />
            </ArbitrageProvider>
        </ChakraProvider>
    );
}

export default App;
