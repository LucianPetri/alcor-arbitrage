import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Accordion,
  Box,
} from "@chakra-ui/react";

import { FC } from "react";
import { useArbitrage } from "../../contexts/arbitrage";
import { ArbitragePair } from "../../utils";

export const ArbTable: FC = () => {
  const { arbPairs } = useArbitrage();

  const title = (pair: ArbitragePair) => {
    const text = `${pair.trade1.name} -> ${pair.trade2.name} -> ${pair.trade3.name} `;
    const value = ` `;
    const coins = `${pair.value < 0 ? "lost" : "won"} ${pair.percentage} - ${
      pair.token1.name
    } ${pair.trade3.price.toFixed(pair.token1.precision)} `;
    return text + value + coins;
  };
  return (
    <Accordion fontSize={"md"}>
      {arbPairs.size > 0
        ? [...arbPairs]
            .sort((pair) => Math.abs(Number(pair.percentage.split("%")[0])))
            .map((pair, index) => (
              <AccordionItem key={index}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="center">
                      {title(pair)}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} textAlign="center">
                  <div>{pair.trade1.fullText}</div>
                  <div>{pair.trade2.fullText}</div>
                  <div>{pair.trade3.fullText}</div>
                </AccordionPanel>
              </AccordionItem>
            ))
        : null}
    </Accordion>
  );
};
