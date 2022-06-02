import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'



function Watchlist() {
    const dbURL = 'https://fathomless-taiga-48002.herokuapp.com/portfolios/watchlist'
    const [dbData, setdbData] = useState(null)
    useEffect(() => {
        fetch(dbURL)
            .then(res => res.json())
            .then(data => setdbData(data))
    }, [])

    return (
        <>
            {console.log(dbData)}
            <h3 style={{ textAlign: "center" }}>Your Stock Watchlist:</h3>
            {
                !dbData
                    ? <h1>Loading</h1>
                    : <div style={{textAlign:"center"}}>
                        {dbData.map(portfolio => {
                            return (
                                portfolio.Watch.map(stock => {
                                    return (
                                        <div>
                                            <Link to={`/portfolio/search/${stock.Symbol}`}>
                                                <>{stock.Symbol}</>
                                            </Link>
                                        </div>
                                    )
                                }))
                        })}
                    </div>
            }
        </>
    )
}


export default Watchlist