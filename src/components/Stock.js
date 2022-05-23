import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Stock(props) {
    const dbInfo = props.dbData
    const userInfo = dbInfo[0]//now using the first user info - need to change into findby username in the future
    console.log(userInfo)
    const [editForm, setEditForm] = useState(userInfo)
    const [stockAPI, setstockAPI] = useState(null)
    const {symbol} = useParams()
    const userStockInfo = userInfo.StockHoldings.filter(stock => stock.Symbol === symbol)
    const [num, setNum] = useState(0)
    const [numSell, setNumSell] = useState(0)

    console.log(symbol)
    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_348076a4671a4d4499147986cc6a52ef`
    console.log(url)
    function componentDidMount() {
        axios.get(url)
            .then(res => {
                const data = res.data;
                setstockAPI(data);
            })
    }


    const handleChangeNum = event => {
        console.log(event.target.value)
        setNum(event.target.value)
    }

    const handleChangeNumSell = event => {
        console.log(event.target.value)
        setNumSell(event.target.value)
    }

//Need to add limit here
    const handleSubmitBuy = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.CashBalance >= (num * stockAPI.low)) {
        copyForm.CashBalance -= num * stockAPI.low
        copyForm.PortfolioBalance += num * stockAPI.low
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Holding += num * stockAPI.low
        setEditForm(copyForm)
        console.log(editForm)
        props.updateDbData(editForm, userInfo._id)
        setNum(0) } else {console.log("not enough cash")}
    }

    const handleSubmitSell = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.PortfolioBalance >= (num)) {
        copyForm.CashBalance += numSell * stockAPI.low
        copyForm.PortfolioBalance -= numSell * stockAPI.low
        copyForm.StockHoldings.filter(x=>x.Symbol===symbol)[0].Holding -= numSell * stockAPI.low
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
                        <p>Daily Low: {stockAPI.iexBidPrice}</p>
                        <p>Daily High: {stockAPI.iexAskPrice}</p>
                        <p>Market Close: {stockAPI.close}</p>
                        <p>Daily Change: {stockAPI.change}</p>
                        <p>Daily Change: {stockAPI.change}</p>
                        {userStockInfo.length === 0
                            ? null
                            : <div>
                                <p> Your Portfolio Holdings: {userStockInfo[0].Holding}</p>
                            <form onSubmit={handleSubmitSell}>
                            <input
                                type="text"
                                value={numSell}
                                name="sell"
                                placeholder="Amount"
                                onChange={handleChangeNumSell}
                            />
                                    <input type="submit" value={`Sell ${numSell} of ${stockAPI.symbol} for ${stockAPI.iexBidPrice * numSell}`} />
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
                            <input type="submit" value={`Buy ${num} of ${stockAPI.symbol} for ${stockAPI.iexBidPrice * num}`} />
                        </form>
                    </div>
            }
        </>

    )
}

export default Stock


