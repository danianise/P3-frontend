import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'



function Portfolio({dbData, stockData}) { 
    // let changePercent = ""
    // const [price, setPrice] = useState(0)
    // const getPrice = (symbol) => {
    //     axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_696f559b3cb64b788e34f7848ef884cb`)
    //         .then(res => {
    //             const data = res.data
    //             setPrice(data.iexRealtimePrice)
    //         })
    // }
    // useEffect(getPrice = (symbol) => {
    //     axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_696f559b3cb64b788e34f7848ef884cb`)
    //         .then(res => {
    //             const data = res.data
    //             setPrice(data.iexRealtimePrice)
    //         })
    // }, [])
    
    // dbData.StockHoldings.map(Stock => {
    //     axios.get(`https://cloud.iexapis.com/stable/stock/${Stock.Symbol}/quote?token=pk_d9852d149e8045839e4b9a57c023b057`)
    //         .then(res => res.json())
    //         .then(data => data.latestPrice)
    // })
    let portfolioBalance = 0
    
    
    return (
      <div className="main">
        <h1>My Holdings</h1>
        {
            !dbData || !stockData
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
                    {dbData[0].StockHoldings.forEach(stock => portfolioBalance+=stock.Cost)}
                    {dbData[0].StockHoldings.forEach(stock => {
                    portfolioBalance += stock.Shares * stock.Cost
                    })
                     }
                    <h2>Portfolio Balance: ${portfolioBalance}</h2>                    
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
                                }
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