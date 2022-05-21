import './App.css';
import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Stock from './components/Stock';
import Portfolio from './components/Portfolio';
import Watchlist from './components/Watchlist'
import UserInfo from './components/UserInfo';
const key = process.env.STOCK_API_KEY
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${key}`
const dbURL = 'https://fathomless-taiga-48002.herokuapp.com/portfolios'

function App() {
  // const dbURL = 'https://fathomless-taiga-48002.herokuapp.com/portfolios'
  //   const [dbData, setdbData] = useState(null)
  //   useEffect(() => {
  //       fetch(dbURL)
  //           .then(res => res.json())
  //           .then(data => setdbData(data))
  //   }, [])

  const [stockData, setstockData] = useState(null)
  const [dbData, setdbData] = useState(null)

  const getDbData = () => {
    fetch(dbURL)
      .then(res => res.json())
      .then(data => setdbData(data))

  }

  const updateDbData = async (data, id) => {
    await fetch(URL + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    getDbData();
  }
  
  const deleteDbData = async id => {
    await fetch(URL + id, {
        method: 'delete',
    })
    // Update the list
    getDbData();
}
  
  useEffect( ()=> {
    fetch(url)
      .then(res => res.json())
      .then(data => setstockData(data))
  }, [])

  useEffect(() => getDbData(), [])

  let test = "Meta Data"
  let test2 = "2. Symbol"

  return (
    <>
    <Header />
    <UserInfo data={dbData}/>
      {stockData ? console.log(stockData) : ""}
      {dbData ? console.log(dbData) : ""}
    <Routes>
        <Route path='/portfolio/:symbol' element={<Stock 
        dbData = {dbData}
        updateDbData={updateDbData}
        deleteDbData = {deleteDbData} />} />
        <Route path='/portfolio' element={<Portfolio
        dbData = {dbData}
        updateDbData={updateDbData}
        deleteDbData = {deleteDbData}/>} />
        <Route path='/portfolio/watchlist' element={<Watchlist
        dbData = {dbData}
        updateDbData={updateDbData}
        deleteDbData = {deleteDbData}/>} />
    </Routes>
    </>
  );
}

export default App;
