import React, {useState, useEffect} from 'react'
import Chart from 'react-apexcharts'
import axios from 'axios'

function StockChart() {

  // let testDate = new Date(1677076200 * 1000)
  // console.log(testDate.toDateString())

  const [stockData, setStockData] = useState(null)

  let url = `https://yfapi.net/v8/finance/chart/AAPL?range=1y&region=US&interval=1mo&lang=en`
   
  useEffect(() => {
      fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': 'J7vFmms0xn69mdfGW7sJG19Oumt00iYu6CmjK8PS',
          'accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        // localStorage.setItem('stockData', data.chart)
        setStockData(data)
      })
  }, [])
  console.log(stockData)
  // console.log(localStorage.getItem('stockData'))

  // localStorage.setItem('stockData', stockData)
  

  let categories = []
  for(let i=0; i<9; i++){
    let categoryDate = new Date(stockData.chart.result[0].timestamp[i] * 1000)
    categories.push(categoryDate)
  }
  console.log(categories)

  let chartData = {
    options: {
      chart: {
        id: 'basic-bar'
      },
      xaxis: {
        // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        categories: categories
      }
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  }

  const [state, setState] = useState(chartData)

  return (
    <div className='stockChart'>
      <div className='row'>
        <div className='col-4'>
        <Chart
          options={chartData.options}
          series={state.series}
          type='line'
          width='500'
        />
        </div>
      </div>
    </div>
  )
}

export default StockChart