const price = () => {
    if (!(parseFloat(inputAmount) && parseFloat(outputAmount)))
      return '0.0000'

    const rate = (
      parseFloat(outputAmount) / parseFloat(inputAmount)
    ).toFixed(4)

    return `${input.symbol} = ${rate} ${output.symbol}`
  }

const  fee() {
    return pair ? (pair.fee * 100) / 10000 : 0.3
  },

  priceImpact() {
    if (!(parseFloat(inputAmount) && parseFloat(outputAmount)))
      return 0.0

    return parseFloat(
      (
        ((parseFloat(outputAmount) * 0.97) /
          parseFloat(poolTwo.quantity)) *
        100
      ).toFixed(2)
    )
  }

  