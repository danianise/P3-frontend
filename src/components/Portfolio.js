import React from 'react'
import {Link} from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import Table from 'react-bootstrap/Table'
import News from './News'
import UserInfo from './UserInfo'
import '../css/Portfolio.css'
import {BiDownArrow, BiUpArrow} from 'react-icons/bi'
import LineChart from './LineChart'

function Portfolio(props) {
    const [stockData, setStockData] = useState(null)

    let dbData = props.dbData
    

    useEffect(() => {
        if(props.dbData){
            let portfolioSymbols = []
            dbData.StockHoldings.map(stock => {
                portfolioSymbols.push(stock.Symbol)
            })
            // console.log({portfolioSymbols})

            let portfolioSymbolStrings = portfolioSymbols.join("%2C")
            // console.log({portfolioSymbolStrings})

            fetch(
                `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${portfolioSymbolStrings}`,
                {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'x-api-key': process.env.REACT_APP_YF_BACKUP_KEY,
                    'x-api-key': '035rMsHHng85urOT3x4jQE9t22lhUCS70WkpePP7',
                }
                }
            )
            .then(res => res.json())
            .then(data => {
                // console.log(data.quoteResponse.result)
                setStockData(data.quoteResponse.result)
            })
        }
    }, [dbData])
    
    const calPortfolioBalance = () => {
        let portfolioBalance = 0
        for (let i = 0; i < stockData.length; i++) {
            portfolioBalance += stockData[i].regularMarketPrice * dbData.StockHoldings[i].Shares;
        }
        return portfolioBalance
    }

    const calGain = () => {
        let gain = 0
        for (let i = 0; i < stockData.length; i++) {
            if (dbData.StockHoldings[i].Shares > 0) {
                gain += (stockData[i].regularMarketPrice - (dbData.StockHoldings[i].Cost / dbData.StockHoldings[i].Shares)) * dbData.StockHoldings[i].Shares
            // console.log(stockData.regularMarketPrice)
            }
        }  
        return gain
    }
    
    if(dbData && stockData){
        return (<>
            {/* <UserInfo data={dbData}/> */}
            <div className="main">
                <div id='newsLg'>
                    <News 
                        width={'29vw'} 
                        height={'25vh'}
                        amount={3}
                    />
                </div>
                <div>  
                    <h5 style={{fontWeight: "bold"}}>
                        Portfolio Balance: {calPortfolioBalance().toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                    </h5> 
                        {calGain() > 0
                        ?   <h6>
                                Total Gain:&nbsp;
                                <span style={{color: '#2bc20e'}}>
                                <BiUpArrow/> {calGain().toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                    {/* {typeof(calGain())} */}
                                </span>
                            </h6>
                        :   <h6>
                                Total Loss:&nbsp;
                                <span style={{color: 'red'}}>
                                <BiDownArrow/> {calGain().toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                </span>
                            </h6>  
                        }
                        
                    <Table hover striped responsive className='portfolioTable'>
                        <thead style={{border: 'none'}}>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>Holding</th>
                                <th>Shares</th>
                                <th>Cost</th>
                                <th></th>
                                {/* <th></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dbData.StockHoldings.map(function(each, index) {                                      
                                    return (
                                        (each.Shares > 0.000000001)
                                            ? <>
                                                <tr>
                                                    <td>
                                                        <Link to={`/portfolio/${each.Symbol}`}>
                                                            {each.Symbol}
                                                        </Link>
                                                    </td>
                                                    <td>        
                                                        {stockData[index].shortName}
                                                    </td>
                                                    <td>
                                                        {(stockData[index].regularMarketPrice * each.Shares).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                                    </td>
                                                    <td>
                                                        {Math.floor(each.Shares)}
                                                    </td>
                                                    <td>
                                                        {each.Cost.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                                    </td>
                                                        {stockData[index].regularMarketChangePercent > 0
                                                            ? <td className="gain percentChange" style={{ color: '#2bc20e' }}>
                                                                <BiUpArrow/> {stockData[index].regularMarketChangePercent.toFixed(2)}%
                                                            </td>
                                                            : <td className="gain percentChange" style={{ color: 'red' }}>
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
                                                    <td id='lineChartTd'>
                                                        <LineChart
                                                            id='lineChart'
                                                            symbol={each.Symbol}
                                                            changePercent={stockData[index].regularMarketChangePercent} 
                                                        />
                                                    </td>
                                                </tr>
                                            </>
                                            : <div className="ring">Loading<span className="loadingAnimation"></span></div>
                                    )
                                })
                            }
                    
                        </tbody>
                    </Table>
                </div>
                <div id='newsMedia'>
                    <News amount={1}/>
                </div>
            </div>
        </>)}
}


export default Portfolio