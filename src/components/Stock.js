import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import StockChart from './StockChart'
import EditPortfolioForm from './EditPortfolioForm'

function Stock(props) {

    const { symbol } = useParams()
    // const [dbData2, setdbData2] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [stockAPI, setstockAPI] = useState(null)
    const [message, setMessage] = useState(`Add to Watchlist`)

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/portfolio`;
        navigate(path);
    }

    
    const [num, setNum] = useState(0)
    const [numSell, setNumSell] = useState(0)

    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_11e3512e43084ecd8d4f93af4a2755ca`

    function componentDidMount() {
        setstockAPI(null)
        // console.log("pulling from API")
        axios.get(url)
            .then(res => {

                const data = res.data;
                setstockAPI(data);
            })
    }

    const handleClick = (event) => {
        event.preventDefault()
        setMessage(`${stockAPI.symbol} Added to WatchList`)
        //add stock to watchlist if not already there
        
    }


    useEffect(() =>
        componentDidMount(), [])

    // console.log(stockAPI)

    return (
        <div className='stockPage'>

            {!stockAPI
                ? <p>No results found, please double check your Symbol!</p>
                : <div className="card"> 
                    {
                        !(stockAPI || props.dbData)
                            ? <div className="ring">Loading<span className="loadingAnimation"></span></div>
                            : <div>
                                <h1>{stockAPI.companyName} ({stockAPI.symbol})</h1>
                                <h3>Data updated {stockAPI.latestTime} from {stockAPI.primaryExchange}</h3>
                                <form 
                                    // onSubmit={addToWatchList}
                                    onClick={handleClick}>
                                    <input type="submit" className="btn btn-primary" value={message} />
                                </form>
                                <StockChart 
                                    id='chartSm'
                                    type='candlestick'
                                    plotOptions={{
                                        candlestick: {
                                        colors: {
                                            upward: '#2bc20e'
                                        }
                                        }
                                    }}
                                    width='350px'
                                    yLabels={ {show: false} }
                                    xLabels={ {show: false} }
                                />
                                <div className="card-body">
                                <p>Latest Price:&nbsp; 
                                    {!stockAPI.latestPrice
                                        ? <i style={{fontSize: "small"}}>  unavailable</i>
                                        : stockAPI.latestPrice?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</p>
                                <p>Market Open:&nbsp; 
                                    {!stockAPI.iexOpen 
                                        ? <i style={{fontSize: "small"}}>  unavailable</i>
                                        : stockAPI.iexOpen?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</p>
                                <p>Market Close:&nbsp; 
                                    {!stockAPI.iexClose
                                    ? <i style={{fontSize: "small"}}>  unavailable</i>
                                    : stockAPI.iexClose?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</p>
                                <p>Daily Change:&nbsp; 
                                    {!stockAPI.changePercent
                                        ? <i style={{fontSize: "small"}}>  unavailable</i>
                                        : stockAPI.changePercent?.toFixed(2)}%</p>
                                <p>52 Week High:&nbsp; 
                                    {!stockAPI.week52High
                                        ? <i style={{fontSize: "small"}}>  unavailable</i>
                                        : stockAPI.week52High?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</p>
                                <p>52 Week Low:&nbsp; 
                                    {!stockAPI.week52Low
                                    ? <i style={{fontSize: "small"}}>  unavailable</i>
                                    : stockAPI.week52Low?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</p>
                                <p>Year to Date Change:&nbsp; 
                                {!stockAPI.ytdChange
                                        ? <i style={{fontSize: "small"}}>  unavailable</i>
                                        : stockAPI.ytdChange?.toFixed(2)}%</p>
                                {!props.dbData
                                    ? null
                                    : <div>
                                        <p style={{fontWeight: "bold"}}> Your Shares:&nbsp;   
                                            {
                                                ((JSON.stringify(props.dbData.StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase()).length) > 0)
                                            ? JSON.stringify(props.dbData.StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase())[0].Shares)
                                            : "0")}</p>
                                        <p style={{fontWeight: "bold"}}> Your holding:&nbsp; 
                                            {
                                                ((JSON.stringify(props.dbData.StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase()).length) > 0) 
                                            ? ((props.dbData.StockHoldings.filter(stock => stock.Symbol === symbol.toUpperCase())[0].Shares) * stockAPI.latestPrice).toLocaleString(undefined, { style: 'currency', currency: 'USD'  })
                                            : "0")}</p>
                                    </div>
                                }
                                    <div>
                                        <EditPortfolioForm dbData={props.dbData} stockData={stockAPI}/>
                                        {/* <form onSubmit={handleSubmitBuy}>
                                            <input
                                                type="text"
                                                value={num}
                                                name="name"
                                                placeholder="Amount"
                                                onChange={handleChangeNum}
                                            />
                                            <input 
                                                type="submit"
                                                className="btn btn-success"
                                                style={{backgroundColor: "#2bc20e"}}
                                                value={`Buy ${num} of ${stockAPI.symbol} for ${(stockAPI.latestPrice * num).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`}
                                            />         
                                        </form>

                                        <form onSubmit={handleSubmitSell}>
                                            <input
                                                type="text"
                                                value={numSell}
                                                name="sell"
                                                placeholder="Amount"
                                                onChange={handleChangeNumSell}
                                            />
                                            <input
                                                type="submit"
                                                className="btn btn-danger"
                                                value={`Sell ${numSell} of ${stockAPI.symbol} for ${(stockAPI.latestPrice * numSell).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`}
                                            />
                                        </form> */}
                                    </div>
                                </div>
                            </div>
                    } 
                        <StockChart
                            id='chartLg'
                            type='candlestick'
                            plotOptions={{
                                candlestick: {
                                  colors: {
                                    upward: '#2bc20e'
                                  }
                                }
                              }}
                            width='800%'
                            yLabels={ {formatter: function(value){return "$" + value}} }
                            xLabels={ {formatter: function(value){return value}} }
                        />
            </div>}
            
        </div>

    )
}

export default Stock