import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Ticker from './components/Ticker';
import UserInfo from './components/UserInfo';
import Portfolio from './components/Portfolio';
import Watchlist from './components/Watchlist';
import Stock from './components/Stock';
import News from './components/News';


function App() {

  // const key = process.env.REACT_APP_YF_X_API_KEY
  // const url = `https://cloud.iexapis.com/stable/stock/ibm/quote?token=pk_696f559b3cb64b788e34f7848ef884cb`
  const dbURL = 'https://mockstockbackend-production.up.railway.app/portfolios'
  const [mongoData, setMongoData] = useState(null)
  // let mongoData
  const [tickerData, setTickerData] = useState([])

  const updateDbData = async (data, id) => {
    await fetch(dbURL + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
  }

  const deleteDbData = async id => {
    await fetch(dbURL + id, {
        method: 'delete',
    })
  }

  const setTicker = () => {

    // let symbols = []

    // mongoData[0].StockHoldings.map(stock => {
    //   symbols.push(stock.Symbol)
    // })

    // mongoData[0].Watch.map(stock => {
    //     symbols.push(stock.Symbol)
    // })
    let symbols = [
      'AAPL', 'MSFT', 'GOOG', 'AMZN', 'NVDA', 'TSLA', 'META', 'XOM', 'JPM', 'WMT', 'KO', 'BAC', 'PFE', 'CSCO', 'MCD', 'DIS', 'AMD', 'NFLX', 'T', 'BA', 'INTC', 'GE', 'F'
    ]

    symbols.map((eachSymbol) => {
      fetch(`https://cloud.iexapis.com/stable/stock/${eachSymbol}/quote?token=pk_696f559b3cb64b788e34f7848ef884cb`)
      .then (res => res.json())
      .then (data => {
          // console.log(data)
          tickerData.push(data)
      })
    })
  }

  useEffect(()=>{
    fetch('https://mockstockbackend-production.up.railway.app/portfolios/')
      .then(res=>res.json())
      .then(data=>{
          // console.log(data)
          setMongoData(data)
      })
      setTicker()
  },[])

  console.log({tickerData})

  if(mongoData){
    return (
      <div>
        <Header/>
        {tickerData.length > 0 && <Ticker tickerData={tickerData}/>}
        <div className='App'>
          {/* <UserInfo data={mongoData}/> */}
          <Routes>

            <Route 
              path='/portfolio' 
              element={
                <Portfolio dbData={mongoData}/>
              } 
            />

            <Route 
              path='/portfolio/watchlist'
              element={
              <Watchlist dbData={mongoData}/>
              }
            />

            <Route
              path='/portfolio/:symbol'
              element={
                <Stock
                  dbData={mongoData}
                  updateDbData={updateDbData}
                  deleteDbData={deleteDbData}
                />
              } 
            />

            {/* <Route 
              path='/chart' 
              element={
                <StockChart
                  id='chartThumbnail'
                  type='line'
                  plotOptions={{
                      line: {
                        colors: ['#2bc20e'],
                      }
                  }}
                  symbol='aapl'
                  width='50%'
                  yLabels={ {show: false} }
                  xLabels={ {show: false} }
                  showAxis='false'
                /> 
              } 
            /> */}

            {/* <Route 
              path='/stock/:symbol'
              element={<StockDetail/>}
            /> */}

            {/* <Route
              path='/news'
              element={<News/>}
            /> */}

          </Routes>
        </div>
      </div>
    );
   } else {
     return(
       <div className="ring">Loading<span className="loadingAnimation"></span></div>
     )
  }
}

export default App;
