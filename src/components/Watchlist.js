import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'



function Watchlist() {
    const dbURL = 'https://mockstockbackend-production.up.railway.app/portfolios/watchlist'
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
                    ? <div className="ring">Loading<span className="loadingAnimation"></span></div>
                    : <div style={{textAlign:"center"}}>
                        {dbData.map(portfolio => {
                            return (
                                portfolio.Watch.map(stock => {
                                    return (
                                        !stock.Symbol
                                        ? <></>
                                        : <div>
                                            <Button variant="secondary" style={{margin: "5px"}}>
                                                <Link to={`/portfolio/${stock.Symbol}`}>
                                                    {stock.Symbol}
                                                </Link>
                                            </Button>
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
