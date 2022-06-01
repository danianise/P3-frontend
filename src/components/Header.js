import React, {useState} from 'react'
import { Link } from 'react-router-dom'

function Header() {
    const initialState = { symbol: ''};
    const [formState, setFormState] = useState(initialState);
    const [resultData, setResultData] = useState(null)
      
    const handleChange = event => {
        setFormState({ ...formState, [event.target.id]: event.target.value });
    };
      
    const handleSubmit = event => {
        event.preventDefault();
        // do something with the data in the component state
        console.log(formState);
        // clear the form
        setFormState(initialState);
        // fetch(`https://cloud.iexapis.com/stable/stock/${formState}/quote?token=pk_696f559b3cb64b788e34f7848ef884cb`)
        //     .then(res => res.json())
        //     .then()
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a href="/Portfolio" className="btn btn-primary right">Your Portfolio</a>
                        </li>
                        {/* <li className="nav-item">
                            <a className="btn btn-light" href="/posts/archive">Temp</a>
                        </li> */}
                        <li className="nav-item">
                            <a className="btn btn-light" href="/portfolio/watchlist">Watchlist</a>
                        </li>
                    </ul>
    
                    <form 
                        className="form-inline my-2 my-lg-0"
                        onSubmit={handleSubmit}>
                        <input 
                            className="form-control mr-sm-2 searchInput"
                            type="text"
                            id="symbol"
                            placeholder="Search Stocks"
                            aria-label="Search"
                            onChange={handleChange}
                            value={formState.symbol}/>
                        <Link to={`/portfolio/search/${formState.symbol}`}>
                            <button 
                                type='submit'
                                className="btn btn-outline-success my-2 my-sm-0 searchButton">GO
                            </button>
                        </Link>
                        
                    </form>
                </div>
            </nav>
        </div>
    )
}

export default Header