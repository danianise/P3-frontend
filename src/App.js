import './App.css';
import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Stock from './components/Stock';

const key = process.env.STOCK_API_KEY
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${key}`

function App() {

  const [stockData, setstockData] = useState(null)

  useEffect( ()=> {
    fetch(url)
      .then(res => res.json())
      .then(data => setstockData(data))
  }, [])

  return (
    <>
    <Header />
    <Routes>
        <Route path='/' element={<Stock stock={stockData}/> } />
    </Routes>
    </>
  );
}

export default App;
