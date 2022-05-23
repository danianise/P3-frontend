import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'



function Portfolio({dbData, stockData}) {
    

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
                    <h2>Portfolio Balance: ${dbData[0].PortfolioBalance}</h2>                    
                    {dbData[0].StockHoldings.map((each) => {
                            return(
                            <div className="myHoldings">
                                <Link to={`/portfolio/${each.Symbol}`}>
                                <h3 className="symbol">
                                    {each.Symbol}
                                </h3>
                                </Link>
                                <div className="holding">${each.Holding} </div>
                                <div className="dailyInfo">+0.16</div>
                    
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