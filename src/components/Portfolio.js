import React from 'react'
import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import Ticker from './Ticker'
import StockChart from './StockChart';
import Stock from './Stock'

function Portfolio({dbData}) {
    console.log({ dbData })
    const [stockData, setStockData] = useState(null)
    
    let symbols = []
    dbData[0].StockHoldings.map(stock => {
        symbols.push(stock.Symbol)
    })
    // console.log(symbols)
    let symbolStrings = symbols.join("%2C")
    console.log(symbolStrings)
    
    const options = {
        method: 'GET',
        url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${symbolStrings}`,
        headers: {
            // 'x-api-key': process.env.REACT_APP_YF_X_API_KEY,
            'x-api-key': process.env.REACT_APP_YF_BACKUP_KEY2,
            'Content-Type': 'application/json'
        }
    };

    useEffect(() => {
        axios.request(options).then(function (response) {
            setStockData(response.data.quoteResponse.result);
        }).catch(function (error) {
            console.error(error);
        })
    }, [])

    console.log(stockData)
    
    const calPortfolioBalance = () => {
        let portfolioBalance = 0
        for (let i = 0; i < stockData.length; i++) {
            portfolioBalance += stockData[i].regularMarketPrice * dbData[0].StockHoldings[i].Shares;
        }
        return portfolioBalance
    }

    const calGain = () => {
        let gain = 0
        for (let i = 0; i < stockData.length; i++) {
            if (dbData[0].StockHoldings[i].Shares !== 0) {
                gain += (stockData[i].regularMarketPrice - (dbData[0].StockHoldings[i].Cost / dbData[0].StockHoldings[i].Shares)) * dbData[0].StockHoldings[i].Shares
            // console.log(dbData[0].StockHoldings[i].Cost/dbData[0].StockHoldings[i].Shares)
            }
        }  
        return gain
        
    }
    
    return (
      <div className="main">
            <br></br>
        {
            dbData.length <= 0 || !stockData 
            // ? <><img src='underConstruction.gif' /></>
            ? <div className="ring">Loading<span className="loadingAnimation"></span></div>
            : <div>  
                <h5 style={{fontWeight: "bold"}}>
                    Portfolio Balance: {calPortfolioBalance().toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                </h5> 
                <h6>
                    Total Gain: 
                    {calGain() > 0
                    ?   <span style={{color: '#2bc20e'}}>
                            {calGain().toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                        </span>
                    :   <span style={{color: 'red'}}>
                            {calGain().toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                        </span>   
                    }
                </h6>
                    
        <Table striped hover bordered responsive id='portfolioTable'>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>Holding</th>
                    <th>Shares</th>
                    <th>Cost</th>
                    <th></th>
                    {/* <th></th> */}
                </tr>
            </thead>
            <tbody>
                {dbData && stockData.length > 0 ? 
                    dbData[0].StockHoldings.map(function(each, index) {                                      
                        return (
                            (each.Shares > 0.000000001)
                                ? <>
                                    <tr>
                                        <td>
                                            <Link to={`/portfolio/${each.Symbol}`}>
                                                {each.Symbol}
                                            </Link>
                                        </td>
                                        <td>        
                                            {stockData[index].shortName}
                                        </td>
                                        <td>
                                            {(stockData[index].regularMarketPrice * each.Shares).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                        </td>
                                        <td>
                                            {Math.floor(each.Shares)}
                                        </td>
                                        <td>
                                            {each.Cost.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                        </td>
                                            {stockData[index].regularMarketChangePercent > 0
                                                ? <td className="gain" style={{ color: 'white', background: '#2bc20e', borderRadius: '10px' }}>
                                                    +{stockData[index].regularMarketChangePercent.toFixed(2)}%
                                                </td>
                                                : <td className="gain" style={{ color: 'white', background: 'red', borderRadius: '10px' }}>
                                                    {stockData[index].regularMarketChangePercent.toFixed(2)}%
                                                </td>
                                            }
                                        {/* <td>
                                        <StockChart
                                            id='chartThumbnail'
                                            type='line'
                                            plotOptions={{
                                                fill:{
                                                    colors: ['#2bc20e']
                                                } 
                                            }}
                                            symbol='aapl'
                                            width='200%'
                                            yLabels={ {show: false} }
                                            xLabels={ {show: false} }
                                            showAxis='false'
                                        /> 
                                        </td> */}
                                        {/* <td>
                                            <canvas role='img' height='34' width='140' style='display: block; box-sizing: border-box; height: 34px; width: 140px;'></canvas>
                                        </td> */}
                                    </tr>
                                </>
                                : ""
                                )
                    })
                : ""}
                
            </tbody>
        </Table>
      </div>
    }
        
    </div>
    )
}


export default Portfolio
