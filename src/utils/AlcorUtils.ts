export type AlcorLiquidityPool = {
    supply: string;
    id: number;
    fee: number;
    fee_contract: string;
    pool1: { quantity: string; contract: string };
    pool2: { quantity: string; contract: string };
};

export type ArbitragePair = {
    token1: string;
    token2: string;
    token3: string;
    trade1: string;
    trade2: string;
    trade3: string;
    value: number;
};

function onlyUnique(value: any, index: number, self: any[]) {
    return self.indexOf(value) === index;
}

function isImpactHigh(quantity: number, poolQuantity: number) {
    const impact = (quantity / poolQuantity) * 100;
    return 3 < impact;
}

const getSymbols = (pools: AlcorLiquidityPool[], blackList?: string[], whiteList?: string[]) => {
    const symbols: string[] = [];
    pools.forEach((pool) => {
        const pool1Name = `${pool.pool1.quantity.split(" ")[1]}@${pool.pool1.contract}`;
        const pool2Name = `${pool.pool2.quantity.split(" ")[1]}@${pool.pool2.contract}`;

        if (blackList && (blackList.includes(pool1Name) || blackList.includes(pool2Name))) {
            return;
        }

        if (whiteList && (!whiteList.includes(pool1Name) || !whiteList.includes(pool2Name))) {
            return;
        }

        symbols.push(pool1Name);
        symbols.push(pool2Name);
    });
    return symbols;
};

const getValues = (symbols: string[], pools: AlcorLiquidityPool[]) => {
    let values: any = {};
    pools.forEach((pool) => {
        const pool1Quantity = Number(pool.pool1.quantity.split(" ")[0]);
        const pool2Quantity = Number(pool.pool2.quantity.split(" ")[0]);

        const pool1Name = `${pool.pool1.quantity.split(" ")[1]}@${pool.pool1.contract}`;
        const pool2Name = `${pool.pool2.quantity.split(" ")[1]}@${pool.pool2.contract}`;

        const pool1Price = (pool1Quantity + 3 * (pool1Quantity / 100)) / (pool2Quantity - 3 * (pool2Quantity / 100));
        const pool2Price = (pool2Quantity + 3 * (pool2Quantity / 100)) / (pool1Quantity - 3 * (pool1Quantity / 100));

        const pair1 = pool1Name + pool2Name;
        const pair2 = pool2Name + pool1Name;

        const fee1 = pool1Price * (4 + 0.3) * 0.01;
        const fee2 = pool2Price * (4 + 0.3) * 0.01;

        const estimatedPrice1 = pool1Price + fee1;
        const estimatedPrice2 = pool2Price + fee2;

        if (estimatedPrice1 && symbols.includes(pair1)) values[pair1].price = estimatedPrice1;
        if (estimatedPrice2 && symbols.includes(pair2)) values[pair2].price = estimatedPrice2;
        if (pool1Quantity && symbols.includes(pair1)) values[pair1].quantity = pool1Quantity;
        if (pool2Quantity && symbols.includes(pair2)) values[pair2].quantity = pool2Quantity;
    });
    return values;
};

const getAlcorLiquidityPools: () => Promise<AlcorLiquidityPool[]> = async () => {
    try {
        const body = {
            json: true,
            code: "alcorammswap",
            scope: "alcorammswap",
            table: "pairs",
            table_key: "",
            lower_bound: "",
            upper_bound: "",
            index_position: 1,
            key_type: "",
            limit: 100000,
            reverse: false,
            show_payer: false,
        };

        const resp = await (
            await fetch("https://wax.eosn.io/v1/chain/get_table_rows", {
                body: JSON.stringify(body),
                method: "POST",
            })
        ).json();
        return resp.rows;
    } catch (error) {
        console.error("Cannot get Alcor Pairs: ", error);
        throw error;
    }
};

export const createPairs = async (blackList?: string[], whiteList?: string[]) => {
    const alcorPools = await getAlcorLiquidityPools();
    const symbols = getSymbols(alcorPools, blackList, whiteList);
    const values = getValues(symbols, alcorPools);
    const pairs: ArbitragePair[] = [];

    symbols.forEach((d1) => {
        symbols.forEach((d2) => {
            symbols.forEach((d3) => {
                if (d1 == d2 || d2 == d3 || d3 == d1) {
                    return;
                }
                let lv1 = [],
                    lv2 = [],
                    lv3 = [];
                if (values[d1 + d2]) {
                    lv1.push(d1 + d2);
                }
                if (values[d2 + d1]) {
                    lv1.push(d2 + d1);
                }

                if (values[d2 + d3]) {
                    lv2.push(d2 + d3);
                }
                if (values[d3 + d2]) {
                    lv2.push(d3 + d2);
                }

                if (values[d3 + d1]) {
                    lv3.push(d3 + d1);
                }
                if (values[d1 + d3]) {
                    lv3.push(d1 + d3);
                }

                if (lv1.length && lv2.length && lv3.length) {
                    pairs.push({
                        token1: d1,
                        token2: d2,
                        token3: d3,
                        trade1: lv1[0],
                        trade2: lv2[0],
                        trade3: lv3[0],
                        value: -100,
                    });
                }
            });
        });
    });

    return pairs;
};

export const processPairs = async (pairs: ArbitragePair[]) => {
    const alcorPools = await getAlcorLiquidityPools();
    const symbols = getSymbols(alcorPools);
    const values = getValues(symbols, alcorPools);
    const processed = pairs;
    //Perform calculation and send alerts
    pairs.forEach((pair, index) => {
        //continue if price is not updated for any symbol
        if (values[pair.trade1].price && values[pair.trade2].price && values[pair.trade3].price) {
            let initialQuantity = values[pair.trade1].quantity * 3 * 0.01;
            if (initialQuantity <= 0) {
                return;
            }
            let trade1_calc = 0;
            let trade2_calc = 0;
            let trade3_calc = 0;
            // let lv_str = "START: " + initialQuantity + pair.token1.split("@")[0] + "<br/>";

            //Level 1 calculation
            trade1_calc = Number(Number(Number(initialQuantity) / values[pair.trade1].price).toFixed(4));
            // lv_str += "->" + trade1_calc + pair.token2.split("@")[0] + "<br/>";
            if (isImpactHigh(trade1_calc, values[pair.trade2].quantity)) {
                return;
            }

            //Level 2 calculation
            trade2_calc = Number(Number(Number(trade1_calc) / values[pair.trade2].price).toFixed(4));
            // lv_str += "->" + Number(trade2_calc).toFixed(4) + pair.token3.split("@")[0] + "<br/>";
            if (isImpactHigh(trade2_calc, values[pair.trade3].quantity)) {
                return;
            }

            trade3_calc = Number(Number(Number(trade2_calc) / values[pair.trade3].price).toFixed(4));
            // lv_str += "TOTAL ->" + Number(trade3_calc).toFixed(4) + pair.d1.split("@")[0];
            
            if (isImpactHigh(trade2_calc, values[pair.trade3].quantity)) {
                return;
            }

            let increase = trade3_calc - initialQuantity;
            let decrease = initialQuantity - trade3_calc;
           processed[index].value = 0;
            if ((increase / Number(initialQuantity)) * 100 < 0) {
               processed[index].value = (decrease / initialQuantity) * -100;
            } else {
               processed[index].value = (increase / initialQuantity) * 100;
            }
        } else {
           processed[index].value = -100;
        }
    });
    return processed
};
