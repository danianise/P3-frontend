import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Ticker from './components/Ticker';
import Portfolio from './components/Portfolio';
import Watchlist from './components/Watchlist';


function App() {
  const [mongoData, setMongoData] = useState(null)

  useEffect(()=>{
    fetch('https://mockstockbackend-production.up.railway.app/portfolios/')
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setMongoData(data)
        })
  }, [])

  return (
    <div className='App'>
      <Header/>
      <Ticker mongoData={mongoData}/>
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

          {/* <Route
            path='/portfolio/:symbol'
            element={
              <StockDetail/>
            } 
          /> */}

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
            path='/ticker'
            element={<Ticker mongoData={dbData}/>}
          /> */}
    
        </Routes>
        {/* )} */}
    </div>
  );
}

export default App;