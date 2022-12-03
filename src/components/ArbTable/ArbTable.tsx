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

export const ArbTable: FC = () => {
  const { pools, pairs, arbPairs } = useArbitrage();

  return (
    <Accordion fontSize={"md"}>
      {arbPairs.size > 0
        ? [...arbPairs].map((pair, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {pair.token1.name +
                      "-" +
                      pair.token2.name +
                      "-" +
                      pair.token3.name +
                      " value: " +
                      pair.value.toFixed(2) +
                      "%"}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
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
