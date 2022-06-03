import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function SearchStock(props) {

    
    const { symbol } = useParams()
    const [dbData2, setdbData2] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [stockAPI, setstockAPI] = useState(null)
    const [graphData, setgraphData] = useState(null)
    

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/portfolio`;
        navigate(path);
    }

    const dbURL = 'https://fathomless-taiga-48002.herokuapp.com/portfolios/'
    const getDbData2 = () => {
        try {fetch(dbURL)
            .then(res => res.json())
            .then(data => setdbData2(data))

        if (dbData2) {
            setEditForm(dbData2)
        }}

        catch (error) {
            console.log(error)
        }
        finally {
        }
    }

    const getDbDataEdit = () => {
        try {
            fetch(dbURL)
            .then(res => res.json())
            .then(data => setEditForm(data[0]))
        }

        catch (error) {
            console.log(error)
        }
        finally {
            console.log("pulling from mongo")
            props.getDbDataUser()
        }
    }
    useEffect(() =>
        getDbDataEdit(), [])

    useEffect(() => 
        getDbData2(), [])

    const updateDbData2 = async (data, id) => {
        await fetch(dbURL + id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        getDbData2();
        props.getDbDataUser()
    }
    
    
    
    const [num, setNum] = useState(0)
    const [numSell, setNumSell] = useState(0)

    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_d9852d149e8045839e4b9a57c023b057`

    function componentDidMount() {
        setstockAPI(null)
        console.log("pulling from API")
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
        if ((JSON.stringify(dbData2[0].StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase()).length) > 0)) {
        let max = editForm.StockHoldings.filter(x => x.Symbol === symbol.toUpperCase())[0].Shares
        setNumSell(Math.min(event.target.value, max))} else {
            setNumSell(0)
        }
    }

    // Need to add limit here

    const addToWatchList = event => {
        event.preventDefault()
       
        if ((JSON.stringify(dbData2[0].Watch.filter(stock => stock.Symbol === symbol.toUpperCase()).length) === "0")) {
        let copyForm = editForm;
        let temp = { Symbol: stockAPI.symbol.toUpperCase() }
        copyForm.Watch.push(temp)
        setEditForm(copyForm)
        updateDbData2(editForm, dbData2[0]._id)} else {console.log("not working")}

    }

    const handleSubmitBuy = event => {
        event.preventDefault()
        let copyForm = editForm;
        //need an if statement here that says basically if the stock exists, do below, if it doesnt, need to do a different updateDBdata PUT
        if (copyForm.CashBalance >= (num * stockAPI.latestPrice)) {
            copyForm.CashBalance -= num * stockAPI.latestPrice
            copyForm.PortfolioBalance += num * stockAPI.latestPrice
            if ((JSON.stringify(dbData2[0].StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase()).length) > 0)) {
            copyForm.StockHoldings.filter(x => x.Symbol === symbol.toUpperCase())[0].Shares += num
            copyForm.StockHoldings.filter(x => x.Symbol === symbol.toUpperCase())[0].Cost += num * stockAPI.latestPrice
            setEditForm(copyForm)
            updateDbData2(editForm, dbData2[0]._id)
            setNum(0)
            props.getDbDataUser()
                getDbDataEdit()
            } else {
                let temp = {Symbol: symbol.toUpperCase(), Shares: num, Cost: num * stockAPI.latestPrice }
                copyForm.StockHoldings.push(temp)
                setEditForm(copyForm)
                updateDbData2(editForm, dbData2[0]._id)
                setNum(0)
                props.getDbDataUser()

                getDbDataEdit()
            }
        } else { console.log("not enough cash") }
    }

    const handleSubmitSell = event => {
        event.preventDefault()
        let copyForm = editForm;
        if (copyForm.StockHoldings.filter(x => x.Symbol === symbol.toUpperCase())[0].Shares >= (num)) {
            copyForm.CashBalance += numSell * stockAPI.latestPrice
            copyForm.StockHoldings.filter(x => x.Symbol === symbol.toUpperCase())[0].Shares -= numSell
            copyForm.StockHoldings.filter(x => x.Symbol === symbol.toUpperCase())[0].Cost -= numSell * stockAPI.latestPrice
            setEditForm(copyForm)
            updateDbData2(editForm, dbData2[0]._id)
            setNumSell(0)
            getDbData2()

            getDbDataEdit()
            props.getDbDataUser()
        } else { console.log("not enough stock") }
    }

    useEffect(() =>
        componentDidMount(), [])



    return (
        <>

            {!stockAPI
                ? <p>No results found, please double check your Symbol!</p>
                : <div className="card"> 
                    {
                !(stockAPI || dbData2)
                    ? <p>loading</p>
                    : <div>
                        <h1>{stockAPI.companyName} ({stockAPI.symbol})</h1>
                        <h3>Data updated {stockAPI.latestTime} from {stockAPI.primaryExchange}</h3>
                        <form onSubmit={addToWatchList}>
                            <input type="submit" className="btn btn-primary" value={`Add ${stockAPI.symbol} to WatchList`} />
                        </form>
                        <div className="card-body">
                        <p>Latest Price: ${stockAPI.latestPrice}</p>
                        <p>Market Open: ${stockAPI.open}</p>
                        <p>Daily High: ${stockAPI.high}</p>
                        <p>Daily Low: ${stockAPI.low}</p>
                        <p>Market Close: ${stockAPI.close}</p>
                        <p>Daily Change: {stockAPI.change}%</p>
                        {!dbData2
                            ? null
                            : <div>
                                <p style={{fontWeight: "bold"}}> Your Shares:  
                                    {
                                        ((JSON.stringify(dbData2[0].StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase()).length) > 0)
                                    ? JSON.stringify(dbData2[0].StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase())[0].Shares)
                                    : "0")}</p>
                                <p style={{fontWeight: "bold"}}> Your holding: 
                                    {
                                        ((JSON.stringify(dbData2[0].StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase()).length) > 0) 
                                    ? (dbData2[0].StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase())[0].Shares) * stockAPI.latestPrice
                                    : "0")}</p>

                                <form onSubmit={handleSubmitBuy}>
                                <input
                                                    type="text"
                                                    value={num}
                                                    name="name"
                                                    placeholder="Amount"
                                                    onChange={handleChangeNum}
                                                />
                                <input type="submit" className="btn btn-success" style={{backgroundColor: "#2bc20e"}} value={`Buy ${num} of ${stockAPI.symbol} for ${stockAPI.iexRealtimePrice * num}`} />         
                                </form>

                                <form onSubmit={handleSubmitSell}>
                                <input
                                        type="text"
                                        value={numSell}
                                        name="sell"
                                        placeholder="Amount"
                                        onChange={handleChangeNumSell}
                                    />
                                <input type="submit" className="btn btn-danger" value={`Sell ${numSell} of ${stockAPI.symbol} for ${stockAPI.iexRealtimePrice * numSell}`} />
                                </form>
                            </div>}

                        
                        
                        </div>
                    </div>
            } </div>}
            
            
        </>

    )
}

export default SearchStock


