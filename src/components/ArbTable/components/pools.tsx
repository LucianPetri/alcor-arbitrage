import { FC } from "react";
import { useArbitrage } from "../../../contexts/arbitrage";
import { Pool } from "./Pool";

export const Pools: FC = () => {
  const { pools } = useArbitrage();

  return (
    <div>
      <ul>
        {[...pools].map((pool, index) => (
          <li key={index}>
            <Pool pool={pool} />
          </li>
        ))}
      </ul>
    </div>
  );
};
