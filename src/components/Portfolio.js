import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'




function Portfolio({ dbData }) {
    console.log({ dbData })
    let symbols = []
    dbData[0].StockHoldings.map(stock => {
        symbols.push(stock.Symbol)
    })
    console.log(symbols)
    let symbolStrings = symbols.join("%2C")
    console.log(symbolStrings)
    const [stockData,setStockData] = useState(null)
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${symbolStrings}`
    const options = {
        method: 'GET',
        url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${symbolStrings}`,
        headers: {
          'x-api-key': 'GW8PTGhaii4nWR17s628j9t73Awi1MOpiy7NRyC4'
        }
    };
    // const getStockData = () => {
    //     axios.request(options).then(function (response) {
    //         setStockData(response.data.quoteResponse.result);
    //     }).catch(function (error) {
    //         console.error(error);
    //     });
    // }
    // console.log(url)
    let changePercent = ""
    // const getStockData = (url, body)=> {
    //     fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(body)
    //     })
    //         .then(res=>res.json())
    //         .then(res => {
    //             const data = res.quoteResponse.result
    //             setStockData(data)
    //         })
    // }
    useEffect(() => {
        axios.request(options).then(function (response) {
            setStockData(response.data.quoteResponse.result);
        }).catch(function (error) {
            console.error(error);
        })
    }, [])
    // getStockData()
    console.log(stockData)
    let portfolioBalance = 0
    let gain = 0
    for (let i = 0; i < stockData.length; i++) {
        portfolioBalance += stockData[i].regularMarketPrice * dbData[0].StockHoldings[i].Shares;
        gain += (portfolioBalance += stockData[i].regularMarketPrice - dbData[0].StockHoldings[i].Cost) * dbData[0].StockHoldings[i].Shares
    }
    console.log(portfolioBalance)
    
    return (
      <div className="main">
        <h1>My Holdings</h1>
        {
            !dbData
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
                        <h2>Portfolio Balance: ${portfolioBalance}</h2> 
                        <h3>Total Gain: ${gain}</h3>    
                    {dbData[0].StockHoldings.map((each) => {
                            return(
                            <div className="myHoldings">
                                <Link to={`/portfolio/${each.Symbol}`}>
                                <h3 className="symbol">
                                    {each.Symbol}
                                </h3>
                            </Link>
                            <div className="holding">${each.Shares} </div>

                            {console.log(stockData.changePercent.toString())}

                            {stockData.changePercent.toString().charAt(0) !== "-" 
                                ? <div className="percentChangePos">+{stockData.changePercent}%</div> 
                                : <div className="percentChangeNeg">{stockData.changePercent}%</div>
                                } */}
                                {/* <div className="dailyInfo">{stockData.changePercent}%</div> */}
                                <div className="holding">${each.Cost} </div>
                    
                            </div>
                            
                                
                    )
                })}
            </div>
        }
        <Link to={'./watchlist'}>
            <h1>watchlist</h1>
        </Link>
      </div>
    )
}


export default Portfolio