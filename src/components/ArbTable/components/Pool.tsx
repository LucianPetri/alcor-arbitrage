import { FC } from "react";
import { AlcorPool } from "../../../utils";

export const Pool: FC<{ pool: AlcorPool }> = ({ pool }) => {
  return (
    <div>
      <label>{pool.id}</label>
      <label>{pool.fee}</label>
      <label>{pool.fee_contract}</label>
      <label>{pool.supply}</label>
      <label>{pool.token1.fullName}</label>
      <label>{pool.token2.fullName}</label>
    </div>
  );
};
