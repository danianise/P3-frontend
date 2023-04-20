//NEXT UP, FIGURE OUT WHY NEWSTOCKHOLDINGS IS NOT CALCULATING AS EXPECTED
import React, {useState, useEffect} from 'react'

function EditPortfolioForm(props) {

  let thisStockDbData = null
  const [numBuy, setNumBuy] = useState(0)
  const [numSell, setNumSell] = useState(0)
  // const [newCashBalance, setNewCashBalance] = useState(props.dbData[0].CashBalance)
  // const [formState, setFormState] = useState(null)
  // const [newStockHoldings, setNewStockHoldings] = useState(props.dbData[0].StockHoldings)
  let holdingsArray = props.dbData[0].StockHoldings
  let stockHoldings = [...holdingsArray]
  let buyMessage
  let sellMessage
  // let display
  const [display, setDisplay] = useState('none')

  useEffect(() =>{
    props.dbData[0].StockHoldings.map((each, index)=>{
      if(props.stockData.symbol === each.Symbol){
        thisStockDbData = props.dbData[0].StockHoldings[index]
        setDisplay('block')
      }
    })
    console.log({thisStockDbData})

  }, [holdingsArray])
  console.log({display})

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
    let cashBalance = props.dbData[0].CashBalance - cost
    // let stockHoldings = props.dbData[0].StockHoldings
    console.log({stockHoldings})
    let alertMessage

    if (numBuy > 0 && props.dbData[0].CashBalance > cost){
      // cost = props.stockData.latestPrice * numBuy
      // cashBalance = props.dbData[0].CashBalance - cost
      alertMessage = `Successfully bought ${numBuy} shares for ${cost.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`

      if(thisStockDbData){
        stockHoldings.map((eachStock, index) => {
          if(eachStock.Symbol === thisStockDbData.Symbol){
            // stockHoldings.splice(index, 1)
            // stockHoldings.push({
            //   Symbol: props.stockData.symbol,
            //   Shares: thisStockDbData.Shares + numBuy,
            //   Cost: thisStockDbData.Cost + cost
            // })
            stockHoldings[index].Shares = thisStockDbData.Shares + numBuy
            stockHoldings[index].Cost = thisStockDbData.Cost + cost
          }
        })
      }else if(!thisStockDbData){
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
        Username: props.dbData[0].Username,
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
        Watch: props.dbData[0].Watch
    }
    console.log({alertMessage})

    const url = `https://mockstockbackend-production.up.railway.app/portfolios/${props.dbData[0]._id}`
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

  let cost = numSell * props.stockData.latestPrice
  let cashBalance = props.dbData[0].CashBalance + cost
  console.log({stockHoldings})
  let alertMessage = "Original Alert Message"

  if(numSell > 0){
    // cost = props.stockData.latestPrice * numSell
    // cashBalance = props.dbData[0].CashBalance + cost
    if(thisStockDbData && thisStockDbData.Shares >= numSell){
      alertMessage = `Successfully sold ${numSell} shares for ${cost.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
    } else if(thisStockDbData && thisStockDbData.Shares < numSell || !thisStockDbData){
      alertMessage = "Insufficient Shares"
    }

    if(thisStockDbData && thisStockDbData.Shares === numSell){
      stockHoldings.map((eachStock, index) => {
        if(eachStock.Symbol === thisStockDbData.Symbol){
          stockHoldings.splice(index, 1)
        }
      })
    }else if(thisStockDbData && thisStockDbData.Shares > numSell){
      stockHoldings.map((eachStock, index) => {
        if(eachStock.Symbol === props.stockData.symbol){
          stockHoldings[index].Shares = thisStockDbData.Shares - numSell
          stockHoldings[index].Cost = thisStockDbData.Cost - cost
        }
      })
    }

  }

  let formState = {
      Username: props.dbData[0].Username,
      CashBalance: cashBalance,
      StockHoldings: stockHoldings,
      Watch: props.dbData[0].Watch
  }
  console.log({alertMessage})

  const url = `https://mockstockbackend-production.up.railway.app/portfolios/${props.dbData[0]._id}`
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