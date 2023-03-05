import React, {createContext, useState, useEffect} from 'react'

const YFContext = createContext()

export default YFContext

export const YFProvider = ({children}) => {

    const [mongoData, setMongoData] = useState([])
    const [yfPortfolioData, setYfPortfolioData] = useState([])
    const [yfWatchListData, setYfWatchListData] = useState([])

    useEffect(() => {
        fetch(
            'https://mockstockbackend-production.up.railway.app/portfolios/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        .then(res=>res.json())
        .then(data=>setMongoData(data))

        let portfolioSymbols = []
        mongoData[0].StockHoldings.map(stock => {
            portfolioSymbols.push(stock.Symbol)
        })
        console.log({portfolioSymbols})

        let portfolioSymbolStrings = portfolioSymbols.join("%2C")
        console.log({portfolioSymbolStrings})

        let watchListSymbols = []
        mongoData[0].Watch.map((each) => {
            watchListSymbols.push(each)
        })
        console.log({watchListSymbols})

        let watchListSymbolStrings = watchListSymbols.join("%2C")
        console.log({watchListSymbolStrings})

        fetch(
            `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${portfolioSymbolStrings}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_YF_X_API_KEY,
                }
            }
        )
        .then(res=>res.json)
        .then(data=>setYfPortfolioData(data))

        fetch(
            `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${watchListSymbolStrings}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_YF_X_API_KEY,
                }
            }
        )
        .then(res=>res.json)
        .then(data=>setYfWatchListData(data))

    }, [])

    let contextData = {
        mongoData:mongoData,
        yfPortfolioData: yfPortfolioData,
        yfWatchListData: yfWatchListData
    }

    return(
        <>
            <YFContext.Provider value={contextData}>
                {children}
            </YFContext.Provider>
        </>
    )
}