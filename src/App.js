import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import Watchlist from './components/Watchlist'
import UserInfo from './components/UserInfo';
import Stock from './components/Stock';
import StockDetail from './components/StockDetail';
import StockChart from './components/StockChart';

const key = process.env.REACT_APP_YF_X_API_KEY
const url = `https://cloud.iexapis.com/stable/stock/ibm/quote?token=pk_696f559b3cb64b788e34f7848ef884cb`
const dbURL = 'https://mockstockbackend-production.up.railway.app/portfolios'

function App() {

  const [dbData, setdbData] = useState([])

  const getDbData = () => {
    fetch(dbURL)
      .then(res => res.json())
      .then(data => setdbData(data))

  }

  const updateDbData = async (data, id) => {
    await fetch(dbURL + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    getDbData();
  }
  
  const deleteDbData = async id => {
    await fetch(dbURL + id, {
        method: 'delete',
    })
    // Update the list
    getDbData();
  }

  useEffect(() => getDbData(), [])


  return (
    <div className='App'>
      {window.location.pathname !== "/portfolio/search/:symbol" ? <Header /> : null}
      {dbData.length > 0 && (
        <>
    <UserInfo data={dbData}/>
    <Routes>

      <Route 
        path='/portfolio' 
        element={
          <Portfolio dbData = {dbData} updateDbData={updateDbData} deleteDbData = {deleteDbData} />
        } 
      />

      <Route 
        path='/portfolio/watchlist'
        element={
        <Watchlist dbData = {dbData} updateDbData={updateDbData} deleteDbData = {deleteDbData}/>
        }
      />

      <Route
        path='/portfolio/:symbol'
        element={
          <Stock dbData = {dbData} getDbDataUser = {getDbData} updateDbData={updateDbData} deleteDbData={deleteDbData} />
        } 
      />

      <Route 
        path='/chart' 
        element={
          <StockChart />
        } 
      />
      
    </Routes>
    </>)}
    </div>
  );
}

export default App;