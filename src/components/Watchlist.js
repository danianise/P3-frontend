import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import News from './News'
import LineChart from './LineChart'
import {BiDownArrow, BiUpArrow} from 'react-icons/bi'
import '../css/Portfolio.css'


function Watchlist(props) {
    const [stockData, setStockData]=useState(null)
    useEffect(() => {
        if(props.dbData){
            let watchListSymbols = []
            props.dbData[0].Watch.map(stock => {
                watchListSymbols.push(stock.Symbol)
            })

            let watchListSymbolStrings = watchListSymbols.join("%2C")
            // console.log({watchListSymbolStrings})

            fetch(
                `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${watchListSymbolStrings}`,
                {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_YF_X_API_KEY,
                }
                }
            )
            .then(res => res.json())
            .then(data => {
                // console.log(data.quoteResponse.result)
                setStockData(data.quoteResponse.result)
            })
        }
    }, [props.dbData])
    console.log({stockData})

    return (
        <div className='watchlist'>
            <h3>Your Watchlist:</h3>
            <div className='main watchlistTable'>
            <div id='newsLg'>
                    <News 
                        width={'29vw'} 
                        height={'25vh'}
                        amount={3}
                    />
            </div>
            {stockData && <Table striped hover bordered responsive>
                <tbody>
                    {stockData.map((each, index)=>{
                        return(<>
                            <tr>
                                <td>
                                    <Link to={`/portfolio/${each.symbol}`}>
                                        {each.symbol}
                                    </Link>
                                </td>
                                <td>
                                    {each.shortName}
                                </td>
                                <td>
                                    {stockData[index].regularMarketChangePercent > 0
                                        ? <td className="gain percentChange" style={{ color: '#2bc20e', border: 'none' }}>
                                            <BiUpArrow/> {stockData[index].regularMarketChangePercent.toFixed(2)}%
                                        </td>
                                        : <td className="gain percentChange" style={{ color: 'red', border: 'none' }}>
                                            <BiDownArrow/> {stockData[index].regularMarketChangePercent.toFixed(2)}% 
                                        </td>
                                    }
                                    {stockData[index].regularMarketChangePercent > 0
                                        ? <td className="gain percentChangeMedia" style={{ color: 'white', backgroundColor: '#2bc20e', borderRadius: '10px' }}>
                                            <BiUpArrow/> {stockData[index].regularMarketChangePercent.toFixed(2)}%
                                        </td>
                                        : <td className="gain percentChangeMedia" style={{ color: 'white', backgroundColor: 'red', borderRadius: '10px'}}>
                                            <BiDownArrow /> {stockData[index].regularMarketChangePercent.toFixed(2)}%
                                        </td>
                                    }
                                </td>
                                <td id='lineChartTd'>
                                    <LineChart
                                        id='lineChart'
                                        symbol={each.symbol}
                                        changePercent={stockData[index].regularMarketChangePercent} 
                                    />
                                </td>
                            </tr>
                        </>)
                    })}
                </tbody>
            </Table>}
            </div>
        </div>
    )
}


export default Watchlist
