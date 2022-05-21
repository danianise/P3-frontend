import './App.css';
import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Stock from './components/Stock';
import Portfolio from './components/Portfolio';
import Watchlist from './components/Watchlist'
const key = process.env.STOCK_API_KEY
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${key}`
const dbURL = 'https://fathomless-taiga-48002.herokuapp.com/'

function App() {

  const [stockData, setstockData] = useState(null)
  const [dbData, setdbData] = useState(null)

  useEffect( ()=> {
    fetch(url)
      .then(res => res.json())
      .then(data => setstockData(data))
  }, [])

  useEffect(() => {
    fetch(dbURL)
      .then(res => res.json())
      .then(data => setdbData(data))
  }, [])

  let test = "Meta Data"
  let test2 = "2. Symbol"

  return (
    <>
    <Header />
      {stockData ? console.log(stockData) : ""}
      {dbData ? console.log(dbData) : ""}
    <Routes>
        <Route path='/portfolio/:symbol' element={<Stock /> } />
        <Route path='/portfolio' element={<Portfolio/>} />
        <Route path='/portfolio/watchlist' element={<Watchlist />} />
    </Routes>
    </>
  );
}

export default App;
