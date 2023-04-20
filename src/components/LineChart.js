import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import { Chart, registerables } from "chart.js"

Chart.register(...registerables);

function LineChart(props) {

    let backgroundColor
    let borderColor
    if(props.changePercent >= 0){
        borderColor = 'rgba(43,194,14)'
        backgroundColor='rgba(43, 194, 14, 0.2)'
    } else {
        borderColor = 'rgb(255, 0, 0)'
        backgroundColor = 'rgba(255, 0, 0, 0.2)'
    }

    const [stockData, setStockData] = useState(null)

    let url = `https://yfapi.net/v8/finance/chart/${props.symbol}?range=1y&region=US&interval=1mo&lang=en`
    
    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
            'X-API-KEY': process.env.REACT_APP_YF_BACKUP_KEY,
            'accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            setStockData(data)
        })
    }, [])

    // console.log(stockData)
    let adjClose = null
    if(stockData){
        adjClose = stockData.chart.result[0].indicators.adjclose[0].adjclose
        // console.log({adjClose})
}

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
        elements: {
            point:{
                radius: 0
            }
        }
    }

    const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Red']

    const data = {
        labels,
        datasets: [
            {
                data: adjClose,
                fill: true,
                // data: [12, 19, 3, 5, 2, 3],
                backgroundColor: backgroundColor,
                borderColor: borderColor
            }
        ]
    }

    if(adjClose){
        return (
        <div id='chartjs'>
            <Line
                options={options}
                data={data}
            />
        </div>
        )
    }
}

export default LineChart