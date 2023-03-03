import React, {useState, useEffect} from 'react'

function Ticker(props) {
    const [tickerData, setTickerData] = useState([])

    // fetch stock symbols from portfolio, make array
    let symbols = []
    props.mongoData[0].StockHoldings.map(stock => {
        symbols.push(stock.Symbol)
    })
    console.log({symbols})

    useEffect(() => {
        // map over array, set symbol for url
        // use symbol dynamically in url to fetch api data
        // push api data into an array
        symbols.map((eachSymbol) => {
            fetch(`https://cloud.iexapis.com/stable/stock/${eachSymbol}/quote?token=pk_696f559b3cb64b788e34f7848ef884cb`)
            .then (res => res.json())
            .then (data => tickerData.push(data))
            console.log(tickerData)
        })
    }, [])

    let tickerDataCondensed = []

    tickerData && tickerData.map((each)=>{
        tickerDataCondensed.push(`${each.symbol}: ${each.iexVolume} @ $${each.latestPrice.toFixed(2)} ^ ${each.change}`)
        console.log(tickerDataCondensed.toString())
    })

  return (
    <div>
        <h1>Ticker Component</h1>
            <marquee>
                {tickerDataCondensed.toString()}
            </marquee>
    </div>
  )
}

export default Ticker