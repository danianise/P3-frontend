import React, {useState, useEffect} from 'react'
import Chart from 'react-apexcharts'

function StockChart() {

  let testDate = new Date(1677076200 * 1000)
  console.log(testDate.toDateString())

  const [stockData, setStockData] = useState(null)

  let url = `https://yfapi.net/v8/finance/chart/AAPL?range=1y&region=US&interval=1mo&lang=en`
   
  useEffect(() => {
      fetch(url, {
        method: 'GET',
        headers: {
          // 'X-API-KEY': process.env.REACT_APP_YF_X_API_KEY,
          'X-API-KEY': 'J7vFmms0xn69mdfGW7sJG19Oumt00iYu6CmjK8PS',
          'accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        setStockData(data)
      })
  }, [])
  console.log(stockData)
  

  let data = []
  let categories = []
  if(stockData){
    for(let i=0; i<stockData.chart.result[0].timestamp.length; i++){
      let categoryDate = (new Date(stockData.chart.result[0].timestamp[i] * 1000)).toString().substr(3,12)
      categories.push(categoryDate)
    
      let dataObj = {
        x: (new Date(stockData.chart.result[0].timestamp[i] * 1000)).toString().substr(3,12),
        y: [
          stockData.chart.result[0].indicators.quote[0].open[i].toFixed(2),
          stockData.chart.result[0].indicators.quote[0].high[i].toFixed(2),
          stockData.chart.result[0].indicators.quote[0].low[i].toFixed(2),
          stockData.chart.result[0].indicators.quote[0].close[i].toFixed(2)]
      }

      data.push(dataObj)
    }
    console.log(data)
  }

  console.log({categories})

  let chartData = {
    options: {
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#2bc20e'
          }
        }
      },
      chart: {
        id: 'candlestick'
      },
      // xaxis: {
      //   categories: categories
      // }
    },
    series: [
      {
        data: data
      }
    ]
  }

  return (
    <div className='stockChart'>
      <div className='row'>
        <div className='col-4'>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type='candlestick'
          // width='500'
          // height='300'
        />
        </div>
      </div>
    </div>
  )
}

export default StockChart