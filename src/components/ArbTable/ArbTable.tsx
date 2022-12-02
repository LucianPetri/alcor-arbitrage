import { AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Accordion, Box } from "@chakra-ui/react";

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
                    {pair.token1.name + "-" + pair.token2.name + "-" + pair.token3.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <div>Trade1 name: {pair.trade1.name}</div>
                <div>Trade1 Price: {pair.trade1.price}</div>
                <div>Trade2 name: {pair.trade2.name}</div>
                <div>Trade2 Price: {pair.trade2.price}</div>
                <div>Trade3 name: {pair.trade3.name}</div>
                <div>Trade2 Price: {pair.trade3.price}</div>
              </AccordionPanel>
            </AccordionItem>
          ))
        : null}
    </Accordion>
  );
};
