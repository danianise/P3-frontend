import React, {useState, useEffect} from 'react'

function EditPortfolioForm(props) {

  let thisStockDbData = null
  const [numBuy, setNumBuy] = useState(0)
  const [numSell, setNumSell] = useState(0)
  let holdingsArray = props.dbData.StockHoldings
  let stockHoldings = [...holdingsArray]
  let buyMessage
  let sellMessage
  const [display, setDisplay] = useState('none')

  useEffect(() =>{
    props.dbData.StockHoldings.map((each, index)=>{
      if(props.stockData.symbol === each.Symbol){
        thisStockDbData = props.dbData.StockHoldings[index]
        setDisplay('block')
      }
    })

  }, [])

  const handleChangeNumBuy = event => {
    setNumBuy(parseInt(event.target.value))
  }
  console.log({numBuy})

  const handleChangeNumSell = event => {
    setNumSell(parseInt(event.target.value))
  }
  console.log({numSell})

  if(numBuy > 0){
    buyMessage = `Buy ${numBuy} shares of ${props.stockData.symbol} for ${(props.stockData.latestPrice * numBuy).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
  }else{
    buyMessage = `Buy Shares of ${props.stockData.symbol} for ${props.stockData.latestPrice.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
  }
  if(numSell > 0){
    sellMessage = `Sell ${numSell} shares of ${props.stockData.symbol} for ${(props.stockData.latestPrice * numSell).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
  }else{
    sellMessage = `Sell Shares of ${props.stockData.symbol} for ${props.stockData.latestPrice.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
  }

function handleSubmitBuy(event){
    event.preventDefault()

    let cost = numBuy * props.stockData.latestPrice
    let cashBalance = props.dbData.CashBalance - cost
    let thisStock = props.dbData.StockHoldings.filter(each=>each.Symbol===props.stockData.symbol)
    let alertMessage

    if (numBuy > 0 && props.dbData.CashBalance > cost){

      alertMessage = `Successfully bought ${numBuy} shares for ${cost.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`

      if(thisStock){
        stockHoldings.map((eachStock, index)=>{
          if(eachStock.Symbol === props.stockData.symbol){
            
            stockHoldings.push({
              Symbol: props.stockData.symbol,
              Shares: thisStock[0].Shares + numBuy,
              Cost: thisStock[0].Cost + cost,
              _id: thisStock[0]._id
            })

            stockHoldings.splice(index, 1)

          }
        })
      }else{
        stockHoldings.push({
          Symbol: props.stockData.symbol,
          Shares: numBuy,
          Cost: cost
        })
      }

    } else if(numBuy > 0 && cost > props.dbData[0].CashBalance){
      alertMessage = "Insufficient Funds"
    }

    let formState = {
        Username: props.dbData.Username,
        CashBalance: cashBalance,
        // CashBalance: 123456.78,
        StockHoldings: stockHoldings,
        // StockHoldings: [
        //   {
        //     Symbol: "AAPL",
        //     Shares: 40,
        //     Cost: 40 * 167.63
        //   },
        //   {
        //     Symbol: "GOOG",
        //     Shares: 20,
        //     Cost: 20 * 105.00
        //   },
        //   {
        //     Symbol: "NFLX",
        //     Shares: 35,
        //     Cost: 323.16 * 35
        //   },
        //   {
        //     Symbol: "MSFT",
        //     Shares: 10,
        //     Cost: 288.45 * 10
        //   }
        // ],
        Watch: props.dbData.Watch
    }
    console.log({alertMessage})

    const url = `https://mockstockbackend-production.up.railway.app/portfolios/${props.dbData._id}`
    console.log({formState})
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState)
    }

    fetch(url, options)
    .then(res=>{
        if(!res.ok){
            throw Error(res.status)
        }
        res.json()
    })
    // .then(data=>{
    //     console.log({data})
    // })
    .catch(err=>{
        console.log(err)
    })
}
function handleSubmitSell(event){
    event.preventDefault()

    let value = numSell * props.stockData.latestPrice
    let cashBalance = props.dbData.CashBalance + value
    let thisStock = props.dbData.StockHoldings.filter(each=>each.Symbol===props.stockData.symbol)
    let alertMessage

    if (numSell > 0){
      
      alertMessage = `Successfully sold ${numSell} shares for ${value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`

      if(thisStock[0].Shares > numSell){
        stockHoldings.map((eachStock, index)=>{
          if(eachStock.Symbol === thisStock[0].Symbol){
            
            stockHoldings.push({
              Symbol: thisStock[0].Symbol,
              Shares: thisStock[0].Shares - numSell,
              Cost: (thisStock[0].Cost - value).toFixed(2),
              _id: thisStock[0]._id
            })

            stockHoldings.splice(index, 1)

          }
        })
      }else if(thisStock[0].Shares === numSell){
        stockHoldings.map((eachStock, index)=>{
          if(eachStock.Symbol === thisStock[0].Symbol){
            stockHoldings.splice(index, 1)
          }
        })
      }

    } else if(numSell > thisStock[0].Shares || !thisStock){
      alertMessage = "Insufficient Shares"
    }

    let formState = {
        Username: props.dbData.Username,
        CashBalance: cashBalance,
        // CashBalance: 123456.78,
        StockHoldings: stockHoldings,
        // StockHoldings: [
        //   {
        //     Symbol: "AAPL",
        //     Shares: 40,
        //     Cost: 40 * 167.63
        //   },
        //   {
        //     Symbol: "GOOG",
        //     Shares: 20,
        //     Cost: 20 * 105.00
        //   },
        //   {
        //     Symbol: "NFLX",
        //     Shares: 35,
        //     Cost: 323.16 * 35
        //   },
        //   {
        //     Symbol: "MSFT",
        //     Shares: 10,
        //     Cost: 288.45 * 10
        //   }
        // ],
        Watch: props.dbData.Watch
    }
    console.log({alertMessage})

    const url = `https://mockstockbackend-production.up.railway.app/portfolios/${props.dbData._id}`
    console.log({formState})
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState)
    }

    fetch(url, options)
    .then(res=>{
        if(!res.ok){
            throw Error(res.status)
        }
        res.json()
    })
    // .then(data=>{
    //     console.log({data})
    // })
    .catch(err=>{
        console.log(err)
    })
}

  return (
    <div className='editPortfolio'>
        <form onSubmit={handleSubmitBuy}>
            <input
                type='text'
                onChange={handleChangeNumBuy}
            />
            <input 
                type="submit"
                className="btn btn-success"
                style={{backgroundColor: "#2bc20e"}}
                value='Confirm'
            /> 
            <p style={{fontSize: 'small'}}>{buyMessage}</p>        
        </form>

        <form 
          onSubmit={handleSubmitSell}
          style={{display: `${display}`}}
        >
            <input
                type='text'
                onChange={handleChangeNumSell}
            />
            <input
                type="submit"
                className="btn btn-danger"
                value='Confirm'
                />
            <p style={{fontSize: 'small'}}>{sellMessage}</p>
        </form>
    </div>
  )
}

export default EditPortfolioForm