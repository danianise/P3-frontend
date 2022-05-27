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
            gain += (stockData[i].regularMarketPrice - dbData[0].StockHoldings[i].Cost) * dbData[0].StockHoldings[i].Shares
        }
        return gain
    }
    
    return (
      <div className="main">
        <h1>Your Holdings</h1>
        {
            dbData.length <= 0 || !stockData 
            ? <h1>Loading</h1>
            : <div>
            
                    {/* {data.map(portfolio => {
                        return (
                            <div className="eachPortfolio">
                            <h2 className="userName">{portfolio.Username}</h2>
                            {console.log(portfolio)}
                            <h2 className="portfolioBalance">Portfolio Balance: ${portfolio.PortfolioBalance}</h2>
                            {portfolio.StockHoldings.map(stock => {
                                return(
                                    <div>
                                        <Link to={`/portfolio/${stock.Symbol}`}>
                                            <h3>{stock.Symbol}</h3>
                                            </Link>
                                        <h3>Your Holdings: {stock.Holding}</h3>
                                    </div>
                                )
                            })}
                            </div>
                        )
                    })} */}   
                        <h5>Portfolio Balance: ${calPortfolioBalance().toFixed(2)}</h5> 
                        <h5>Total Gain: ${calGain().toFixed(2)}</h5>    
                    {dbData[0].StockHoldings.map((each, index) => {
                            return(
                                (each.Shares > 0.000000001) ? 
                            <div className="myHoldings">
                                <Link to={`/portfolio/${each.Symbol}`}>
                                <h3 className="symbol">
                                    {each.Symbol}
                                </h3>
                            </Link>
                                    <div className="holding">Shares: {each.Shares} </div><br></br>
                                    <div className="holding">Cost: ${each.Cost} </div>

                            {/* {console.log(stockData.changePercent.toString())} */}
                            {console.log(stockData[index].regularMarketChangePercent)}
                            {stockData[index].regularMarketChangePercent > 0 
                                ? <div className="percentChangePos">+{stockData[index].regularMarketChangePercent}%</div> 
                                : <div className="percentChangeNeg">{stockData[index].regularMarketChangePercent}%</div>
                                } 
                                {/* <div className="dailyInfo">{stockData.changePercent}%</div> */}
                                
                    
                            </div>: ""
                            
                                
                    )
                })}
            </div>
        }
        
      </div>
    )
}


export default Portfolio