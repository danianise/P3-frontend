import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Portfolio({dbData}) {
    console.log({ dbData })
    const [stockData, setStockData] = useState(null)
    // const [portfolioBalance, setPortfolioBalance] = useState(0)
    // const [gain, setGain] = useState(0)
    // const dbURL = 'https://fathomless-taiga-48002.herokuapp.com/portfolios/'
    
    let symbols = []
    dbData[0].StockHoldings.map(stock => {
        symbols.push(stock.Symbol)
    })
    console.log(symbols)
    let symbolStrings = symbols.join("%2C")
    console.log(symbolStrings)
    
    // // const url = `https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${symbolStrings}`
    const options = {
        method: 'GET',
        url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${symbolStrings}`,
        headers: {
            'x-api-key': 'GW8PTGhaii4nWR17s628j9t73Awi1MOpiy7NRyC4',
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
            console.log(dbData[0].StockHoldings[i].Cost/dbData[0].StockHoldings[i].Shares)}
}
        return gain
        
    }
    
    return (
      <div className="main">
            <h3>{dbData[0].Username}'s Holdings</h3><br></br>
        {
            dbData.length <= 0 || !stockData 
            ? <h1>Loading</h1>
            : <div>  
                <h3>Portfolio Balance: ${calPortfolioBalance().toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3> 
                <h5>Total Gain: $
                {calGain() > 0
                ?   <span style={{color: 'green'}}>
                        {calGain().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                :   <span style={{color: 'red'}}>
                        {calGain().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>   
                }
                </h5>
                    
                    {dbData[0].StockHoldings.map((each, index) => {
                        return(
                            (each.Shares > 0.000000001)
                            ? 
                            <>
                            <div className="myHoldings">
                                <div className="myHoldingsHead">
                                    <Link to={`/portfolio/${each.Symbol}`}>
                                        <h3 className="symbol">
                                            {each.Symbol}
                                        </h3>
                                    </Link>
                                    <div className="company">{stockData[index].displayName}</div>
                                </div>
                                <div className="myHoldingsContent">
                                    <div className="holding">Holding: ${(stockData[index].regularMarketPrice * each.Shares).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                                    <div className="shares">Shares: {each.Shares} </div><br></br>
                                    <div className="cost">Cost: ${each.Cost.toLocaleString(undefined, { maximumFractionDigits: 2 })} </div>
                                    {stockData[index].regularMarketChangePercent > 0 
                                        ? <div className="marketChange" style={{color: 'white', background: 'green'}}>+{stockData[index].regularMarketChangePercent.toFixed(2)}%</div> 
                                        : <div className="marketChange" style={{color: 'white', background: 'red'}}>{stockData[index].regularMarketChangePercent.toFixed(2)}%</div>
                                    } 
                                </div>
                            </div>
                            </>
                            : ""                                
                    )
                })}
            </div>
        }
        
      </div>
    )
}


export default Portfolio