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
import LineChart from './components/LineChart';


function App() {

  // const key = process.env.REACT_APP_YF_X_API_KEY
  // const url = `https://cloud.iexapis.com/stable/stock/ibm/quote?token=pk_696f559b3cb64b788e34f7848ef884cb`
  // const dbURL = 'https://mockstockbackend-production.up.railway.app/portfolios'
  const [mongoData, setMongoData] = useState(
    {
      "Username": "genericUser",
      "CashBalance": 50234.56,
      "StockHoldings": [
              {
              "Symbol": "GOOG",
              "Shares": "5",
              "Cost": "144.64"
              },
              {
              "Symbol": "AAPL",
              "Shares": "10",
              "Cost": "188.00"
              },
              {
                "Symbol": "IBM",
                "Shares": "8",
                "Cost": "166.12"
                }
          ],
          "Watch": [
              {
                  "Symbol": "AAPL"
              },
              {
                  "Symbol": "IBM"
              }
          ]
      },)
  // let mongoData
  const [tickerData, setTickerData] = useState([])

  // const updateDbData = async (data, id) => {
  //   await fetch(dbURL + id, {
  //       method: 'put',
  //       headers: {
  //           'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data)
  //   })
  // }

  // const deleteDbData = async id => {
  //   await fetch(dbURL + id, {
  //       method: 'delete',
  //   })
  // }

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
      fetch(`https://cloud.iexapis.com/stable/stock/${eachSymbol}/quote?token=pk_11e3512e43084ecd8d4f93af4a2755ca`)
      .then (res => res.json())
      .then (data => {
          // console.log(data)
          tickerData.push(data)
      })
  })}

  useEffect(()=>{
    // fetch('https://mockstockbackend-production.up.railway.app/portfolios/')
    //   .then(res=>res.json())
    //   .then(data=>{
    //       // console.log(data)
    //       setMongoData(data)
    //   })
      setTicker()
  },[])
  // console.log({mongoData})

  // console.log({tickerData})

  if(mongoData){
    return (
      <div>
        <Header/>
        {tickerData.length > 0 && <Ticker tickerData={tickerData}/>}
        <div className='App'>
          <UserInfo data={mongoData}/>
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
                  // updateDbData={updateDbData}
                  // deleteDbData={deleteDbData}
                />
              } 
            />

            {/* <Route 
              path='/chart' 
              element={
                <LineChart dbData={mongoData}/>
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
