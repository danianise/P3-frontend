import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

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
            {/* <header className='Headercustom2'>
                <a href="/Portfolio" className='Headercustom'>
                    MockStock
                </a>

            </header> */}

            <Navbar bg="light" variant="light">
            <Button 
                href='/Portfolio' 
                variant="primary"
            >
            Your Portfolio
            </Button>{''}
            <Button 
                href='/Watchlist'
                variant="primary"
                style={{marginLeft: '5px'}}
            >
            Watchlist
            </Button>{''}
            <Form>
                <Form.Group 
                    className="form-inline my-2 my-lg-0"    
                    // controlId="formBasicSearch"
                >
                    <Form.Control
                        type="text"
                        placeholder="Search Stocks"
                        id="symbol"
                        aria-label="Search"
                        onChange={handleChange}
                        value={formState.symbol}
                        onSubmit={handleSubmit} 
                    />
                    <Button
                        href={`/portfolio/search/${formState.symbol}`} 
                        variant="outline-success"
                        size="sm"
                        as="input"
                        type="submit"
                        value="GO" 
                    />{' '}
          {console.log(formState.symbol)}
                    <Form.Text className="text-muted">
                        Enter a symbol to search for stock information.
                    </Form.Text>
                </Form.Group>
            </Form>
        </Navbar>
        </div>
    )
}

export default Header