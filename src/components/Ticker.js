import React, {useState, useEffect} from 'react'
import {BiDownArrow, BiUpArrow} from 'react-icons/bi'

function Ticker(props) {
    const [tickerData, setTickerData] = useState([])

    useEffect(() => {
        setTickerData(props.tickerData)
    }, [])

    // console.log({tickerData})
    let tickerDataCondensed = []

    tickerData && tickerData.map((each)=>{
        tickerDataCondensed.push(
        {
            symbol: each.symbol,
            volume: each.iexVolume,
            latestPrice: each.latestPrice.toFixed(2),
            change: each.change
        }
      )
    })
    // console.log({tickerDataCondensed})

  if(props.tickerData){
    return (
        <div className='ticker'>
            <marquee>
                {tickerDataCondensed.map((each) => {
                        return(
                            <>
                            {each.change < 0
                            ? <span className='negative'>
                                <span id='tickerSymbol'>{each.symbol} </span>
                                <span id='tickerVolume'>{each.volume} </span>@
                                <span id='tickerPrice'> ${each.latestPrice} </span>
                                <span id='tickerDownArrow'><BiDownArrow/> </span>
                                <span id='tickerChange'>{each.change}  </span>
                            </span>
                            : <span className={each.change < 0 ? 'negative' : 'positive'}>
                                <span id='tickerSymbol'>{each.symbol} </span>
                                <span id='tickerVolume'>{each.volume} </span>@
                                <span id='tickerPrice'> ${each.latestPrice} </span>
                                <span id='tickerUpArrow'><BiUpArrow/> </span>
                                <span id='tickerChange'>{each.change}  </span>
                            </span>
                            }
                            </>
                        )
                })}   
            </marquee>
    </div>
    )
  }
}

export default Ticker