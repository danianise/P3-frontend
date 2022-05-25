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
        let max = editForm.CashBalance / stockAPI.iexRealtimePrice
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
        let copyForm = editForm;
        let temp = { symbol: stockAPI.symbol}
        copyForm.Watch.push(temp)
        setEditForm(copyForm)
        props.updateDbData(editForm, userInfo._id)

    }

    const handleSubmitBuy = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.CashBalance >= (num * stockAPI.iexRealtimePrice)) {
        copyForm.CashBalance -= num * stockAPI.iexRealtimePrice
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Shares += num
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Cost += num * stockAPI.iexRealtimePrice
        setEditForm(copyForm)
        console.log(userInfo._id)
        props.updateDbData(editForm, userInfo._id)
        setNum(0) } else {console.log("not enough cash")}
    }

    const handleSubmitSell = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Shares >= (num)) {
        copyForm.CashBalance += numSell * stockAPI.iexRealtimePrice
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Shares -= numSell
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Cost -= numSell * stockAPI.iexRealtimePrice
        setEditForm(copyForm)
        console.log(editForm)
        props.updateDbData(editForm, userInfo._id)
        setNumSell(0)} else {console.log("not enough stock")}
    }

    useEffect(() =>
        componentDidMount(), [])



    return (
        <>
            
            <p>
                {stockAPI ? JSON.stringify(stockAPI) : ""}

            </p>
            {stockAPI ? <h1>{stockAPI.symbol}</h1> : ""}
            {
                !stockAPI
                    ? <p>loading</p>
                    : <div>
                        <h1>{stockAPI.companyName} ({stockAPI.symbol})</h1>
                        <h3>Data updated {stockAPI.latestTime} from {stockAPI.primaryExchange}</h3>
                        <p>Market Open: {stockAPI.open}</p>
                        <p>Latest Price: {stockAPI.iexRealtimePrice}</p>
                        <p>Daily High: {stockAPI.iexAskPrice}</p>
                        <p>Market Close: {stockAPI.close}</p>
                        <p>Daily Change: {stockAPI.change}</p>
                        <p>Daily Change: {stockAPI.change}</p>
                        {userStockInfo.length === 0
                            ? null
                            : <div>
                                <p> Your Share: {userStockInfo[0].Shares}</p>
                                <p> Your Portfolio Value: {userStockInfo[0].Shares * stockAPI.iexRealtimePrice}</p>
                            <form onSubmit={handleSubmitSell}>
                            <input
                                type="text"
                                        value={numSell}
                                name="sell"
                                placeholder="Amount"
                                onChange={handleChangeNumSell}
                            />
                                    <input type="submit" value={`Sell ${numSell} of ${stockAPI.symbol} for ${stockAPI.iexRealtimePrice * numSell}`} />
                                </form>
                                </div>}
                        
                        <form onSubmit={handleSubmitBuy}>
                            <input
                                type="text"
                                value={num}
                                name="name"
                                placeholder="Amount"
                                onChange={handleChangeNum}
                            />
                            <input type="submit" value={`Buy ${num} of ${stockAPI.symbol} for ${stockAPI.iexRealtimePrice * num}`} />
                        </form>
                        <form onSubmit={addToWatchList}>
                            <input type="submit" value={`Add ${stockAPI.symbol} to WatchList`} />
                        </form>
                    </div>
            }
        </>

    )
}

export default Stock


