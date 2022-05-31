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
            <h1>Watchlist</h1>
            {
                !dbData
                    ? <h1>Loading</h1>
                    : <div>
                        {dbData.map(portfolio => {
                            return (
                                portfolio.Watch.map(stock => {
                                    return (
                                        <div>
                                            You are watching:
                                            <Link to={`/portfolio/${stock.Symbol}`}>
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