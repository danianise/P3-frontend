import React, {useState, useEffect} from 'react'

function EditPortfolioForm(props) {

  const [thisStockDbData, setThisStockDbData] = useState(null)
  useEffect(()=> {
    props.dbData[0].StockHoldings.map((each, index)=>{
        if(props.stockData.symbol === each.Symbol){
            setThisStockDbData(props.dbData[0].StockHoldings[index])
        }
    })
    console.log({thisStockDbData})
  }, [])

  const [numBuy, setNumBuy] = useState(0)
  const [numSell, setNumSell] = useState(0)

  const handleChangeNumBuy = event => {
    setNumBuy(parseInt(event.target.value))
  }
  const handleChangeNumSell = event => {
    setNumSell(parseInt(event.target.value))
  }
  console.log({numBuy})

  const [newCashBalance, setNewCashBalance] = useState(props.dbData[0].CashBalance)
  function calculateNewCashBalanceBuy(numBuy){
    setNewCashBalance(props.dbData[0].CashBalance - (props.stockData.latestPrice * numBuy))
  }
  function calculateNewCashBalanceSell(numSell){
    setNewCashBalance(props.dbData[0].CashBalance + (props.stockData.latestPrice * numSell))
  }

  let initialState = {
    Username: props.dbData[0].Username,
    CashBalance: props.dbData[0].CashBalance,
    StockHoldings: props.dbData[0].StockHoldings,
    Watch: props.dbData[0].Watch
  }

  const [formState, setFormState] = useState(initialState)
//   console.log({formState})

  let buyMessage
  if(numBuy > 0){
    buyMessage = `Buy ${numBuy} shares of ${props.stockData.symbol} for ${(props.stockData.latestPrice * numBuy).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
  }else{
    buyMessage = `Buy Shares of ${props.stockData.symbol} for ${props.stockData.latestPrice.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
  }

  let sellMessage
  if(numSell > 0){
    sellMessage = `Sell ${numSell} shares of ${props.stockData.symbol} for ${(props.stockData.latestPrice * numSell).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
  }else{
    sellMessage = `Sell Shares of ${props.stockData.symbol} for ${props.stockData.latestPrice.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
  }

  console.log('Stock Holdings:', props.dbData[0].StockHoldings)

  const [newStockHoldings, setNewStockHoldings] = useState(props.dbData[0].StockHoldings)
  function calculateNewDataBuy(){
    let holdingsArray = [...newStockHoldings]
    if(thisStockDbData){
        props.dbData[0].StockHoldings.map((each, index) => {
            if (each.Symbol === props.stockData.symbol){
                holdingsArray.splice(index, 1)
                holdingsArray.push({
                    Symbol: props.stockData.symbol,
                    Shares: thisStockDbData.Shares + parseInt(numBuy),
                    Cost: thisStockDbData.Cost + (props.stockData.latestPrice * numBuy)
                })
                console.log({holdingsArray})
                setNewStockHoldings(holdingsArray)
            }
        })
    } else if(thisStockDbData===null) {
        holdingsArray.push({
            Symbol: props.stockData.symbol,
            Shares: parseInt(numBuy),
            Cost: props.stockData.latestPrice * numBuy
        })
        setNewStockHoldings(holdingsArray)
    }
  }
  function calculateNewDataSell(){
    if(thisStockDbData){
        props.dbData[0].StockHoldings.map((each, index) => {
            if (each.Symbol === props.stockData.symbol){
                newStockHoldings.splice(index, 1)
                newStockHoldings.push({
                    Symbol: props.stockData.symbol,
                    Shares: thisStockDbData.Shares - parseInt(numSell),
                    Cost: thisStockDbData.Cost - (props.stockData.latestPrice * numSell)
                })
                console.log({newStockHoldings})
            }
        })
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    if(numBuy){
        calculateNewCashBalanceBuy(numBuy)
        calculateNewDataBuy()
    }
    if(numSell){
        calculateNewCashBalanceSell(numSell)
        calculateNewDataSell()
    }

    setFormState({
        Username: props.dbData[0].Username,
        CashBalance: newCashBalance,
        StockHoldings: newStockHoldings,
        Watch: props.dbData[0].Watch
      })

      console.log({formState})
    
    // const url = process.env.REACT_APP_MONGO_URL
    const url = `https://mockstockbackend-production.up.railway.app/portfolios/${props.dbData[0]._id}`
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
    .then(data=>{
        console.log({data})
    })
    .catch(err=>{
        console.log(err)
    })

    setFormState(initialState)
  }

  return (
    <div className='editPortfolio'>
        <form onSubmit={handleSubmit}>
            {/* <input
                id='CashBalance'
                type='hidden'
                value={newCashBalance}
            /> */}
            <input
                type='text'
                // value={calculateNewDataBuy()}
                onChange={handleChangeNumBuy}
            />
            <input 
                type="submit"
                className="btn btn-success"
                style={{backgroundColor: "#2bc20e"}}
                // value={valueBuy}
                value='Confirm'
            /> 
            <p style={{fontSize: 'small'}}>{buyMessage}</p>        
        </form>

        <form onSubmit={handleSubmit}>
            <input
                id='Shares'
                type='text'
                // value={calculateNewDataSell()}
                onChange={handleChangeNumSell}
            />
            {/* <input
                id='CashBalance'
                type='hidden'
                value={newCashBalance}
            /> */}
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