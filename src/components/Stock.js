import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Stock() {
    const [stockAPI, setstockAPI] = useState(null)
    const {symbol} = useParams()
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
                        <p>Daily Low: {stockAPI.low}</p>
                        <p>Daily High: {stockAPI.high}</p>
                        <p>Market Close: {stockAPI.close}</p>
                        <p>Daily Change: {stockAPI.change}</p>
                        <p>Daily Change: {stockAPI.change}</p>
                    </div>
            }
        </>

    )
}

export default Stock


