import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'



function Portfolio() {
    const dbURL = 'https://fathomless-taiga-48002.herokuapp.com/portfolios'
    const [dbData, setdbData] = useState(null)
    useEffect(() => {
        fetch(dbURL)
            .then(res => res.json())
            .then(data => setdbData(data))
    }, [])

    return (
        <>
        <h1>working</h1>
        {
            !dbData
            ? <h1>Loading</h1>
            : <div>
                        {dbData.map(portfolio => {
                            return (
                            portfolio.StockHoldings.map(stock => {
                                return(
                                    <div>
                                        <Link to={`/portfolio/${stock.Symbol}`}>
                                            <h3>{stock.Symbol}</h3>
                                            </Link>
                                        <h3>Your Holdings: {stock.Holding}</h3>
                                    </div>
                                )
                        }))
                        })}
            </div>
        }
        </>
    )
}


export default Portfolio