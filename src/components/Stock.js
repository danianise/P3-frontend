import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Stock(props) {
    const dbInfo = props.dbData
    const userInfo = dbInfo[0]//now using the first user info - need to change into findby username in the future
    const [editForm, setEditForm] = useState(userInfo)
    const [stockAPI, setstockAPI] = useState(null)
    const {symbol} = useParams()
    const userStockInfo = userInfo.StockHoldings.filter(stock => stock.Symbol === symbol)
    const [num, setNum] = useState(0)
    const [numSell, setNumSell] = useState(0)

    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_d9852d149e8045839e4b9a57c023b057`
   
    function componentDidMount() {
        axios.get(url)
            .then(res => {
                const data = res.data;
                setstockAPI(data);
            })
    }


    const handleChangeNum = event => {
        console.log(event.target.value)
        let max = editForm.CashBalance / stockAPI.latestPrice
        setNum(Math.min(event.target.value, max))
    }

    const handleChangeNumSell = event => {
        console.log(event.target.value)
        let max = editForm.StockHoldings.filter(x => x.Symbol === symbol)[0].Shares
        setNumSell(Math.min(event.target.value, max))
    }

//Need to add limit here

const addToWatchList = event => {
    event.preventDefault()
    console.log(userInfo.Watch.filter(stock => stock.Symbol === symbol.toUpperCase()))
    if (((userInfo.Watch.filter(stock => stock.Symbol === symbol.toUpperCase()).length) === 0)) {
    let copyForm = editForm;
        let temp = { Symbol: stockAPI.symbol.toUpperCase() }
        console.log(temp)
    copyForm.Watch.push(temp)
    setEditForm(copyForm)
        props.updateDbData(editForm, userInfo._id)
    }
    else {console.log("not working")}

}

    const handleSubmitBuy = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.CashBalance >= (num * stockAPI.latestPrice)) {
        copyForm.CashBalance -= num * stockAPI.latestPrice
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Shares += num
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Cost += num * stockAPI.latestPrice
        setEditForm(copyForm)
        console.log(userInfo._id)
        props.updateDbData(editForm, userInfo._id)
        setNum(0) } else {console.log("not enough cash")}
    }

    const handleSubmitSell = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Shares >= (num)) {
        copyForm.CashBalance += numSell * stockAPI.latestPrice
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Shares -= numSell
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Cost -= numSell * stockAPI.latestPrice
        setEditForm(copyForm)
        console.log(editForm)
        props.updateDbData(editForm, userInfo._id)
        setNumSell(0)} else {console.log("not enough stock")}
    }

    useEffect(() =>
        componentDidMount(), [])



    return (
        <>
            
            
            {
                !stockAPI
                    ? <p>loading</p>
                    : <div className="card" >
                        <h1>{stockAPI.companyName} ({stockAPI.symbol})</h1>
                        <h3>Data updated {stockAPI.latestTime} from {stockAPI.primaryExchange}</h3>
                        <form onSubmit={addToWatchList}>
                            <input type="submit" className="btn btn-primary" value={`Add ${stockAPI.symbol} to WatchList`} />
                        </form>
                        <div className="card-body">
                        <p>Latest Price: ${stockAPI.latestPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        <p>Market Open: ${stockAPI.open.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        <p>Daily High: ${stockAPI.high.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        <p>Daily Low: ${stockAPI.low.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        <p>Market Close: ${stockAPI.close.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        <p>Daily Change: {stockAPI.changePercent.toFixed(2)}%</p>
                        {userStockInfo.length === 0
                            ? null
                            : <div>
                                <p style={{fontWeight: "bold"}}> Your Share: {Math.round(userStockInfo[0].Shares)}</p>
                                <p style={{fontWeight: "bold"}}> Your Holding: ${(userStockInfo[0].Shares * stockAPI.latestPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                    <form onSubmit={handleSubmitBuy}>
                                        <input
                                            type="text"
                                            value={num}
                                            name="name"
                                            placeholder="Amount"
                                            onChange={handleChangeNum}
                                        />
                                        <input type="submit" style={{backgroundColor: "#2bc20e"}} className="btn btn-success" value={`Buy ${num} of ${stockAPI.symbol} for $${(stockAPI.latestPrice * num).toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
                                    </form>
                            <form onSubmit={handleSubmitSell}>
                            <input
                                type="text"
                                        value={numSell}
                                name="sell"
                                placeholder="Amount"
                                onChange={handleChangeNumSell}
                                        />
                                <input type="submit" className="btn btn-danger" value={`Sell ${numSell} of ${stockAPI.symbol} for $${(stockAPI.latestPrice * numSell).toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
                                </form>
                                </div>}
                        
                       
                        
                        </div>
                    </div>
            }
        </>

    )
}

export default Stock


