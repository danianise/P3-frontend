import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function SearchStock(props) {

    const [dbData, setdbData] = useState(null)
    const dbURL = 'https://fathomless-taiga-48002.herokuapp.com/portfolios/'
    const getDbData = () => {
        fetch(dbURL)
            .then(res => res.json())
            .then(data => setdbData(data))

    }
    useEffect(() => getDbData(), [])
    console.log(dbData)
    
    const userInfo = dbData[0]//now using the first user info - need to change into findby username in the future
    const [editForm, setEditForm] = useState(userInfo)
    const [stockAPI, setstockAPI] = useState(null)
    const { symbol } = useParams()
    const userStockInfo = userInfo.StockHoldings.filter(stock => stock.Symbol === symbol)
    const [num, setNum] = useState(0)
    const [numSell, setNumSell] = useState(0)

    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_348076a4671a4d4499147986cc6a52ef`

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
        let max = editForm.StockHoldings.filter(x => x.Symbol === symbol)[0].Holding / stockAPI.iexRealtimePrice
        setNumSell(Math.min(event.target.value, max))
    }

    //Need to add limit here

    const addToWatchList = event => {
        event.preventDefault()
        let copyForm = editForm;
        let temp = { symbol: stockAPI.symbol }
        copyForm.Watch.push(temp)
        setEditForm(copyForm)
        props.updateDbData(editForm, userInfo._id)

    }

    const handleSubmitBuy = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.CashBalance >= (num * stockAPI.iexRealtimePrice)) {
            copyForm.CashBalance -= num * stockAPI.iexRealtimePrice
            copyForm.PortfolioBalance += num * stockAPI.iexRealtimePrice
            copyForm.StockHoldings.filter(x => x.Symbol === symbol)[0].Holding += num * stockAPI.iexRealtimePrice
            setEditForm(copyForm)
            console.log(userInfo._id)
            props.updateDbData(editForm, userInfo._id)
            setNum(0)
        } else { console.log("not enough cash") }
    }

    const handleSubmitSell = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.PortfolioBalance >= (num)) {
            copyForm.CashBalance += numSell * stockAPI.iexRealtimePrice
            copyForm.PortfolioBalance -= numSell * stockAPI.iexRealtimePrice
            copyForm.StockHoldings.filter(x => x.Symbol === symbol)[0].Holding -= numSell * stockAPI.iexRealtimePrice
            setEditForm(copyForm)
            console.log(editForm)
            props.updateDbData(editForm, userInfo._id)
            setNumSell(0)
        } else { console.log("not enough stock") }
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
                                <p> Your Portfolio Holdings: {userStockInfo[0].Holding}</p>
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

export default SearchStock


