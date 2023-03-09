import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import '../css/Header.css'

function Header(props) {
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
    };

    return (
        <div className='header'>
            <Navbar id='navBar' variant="light">
                <div className='navBarButtons'>
                    <Button 
                        href='/portfolio' 
                        variant="secondary"
                        className="portfolioButton"
                    >
                    Portfolio
                    </Button>
                    <Button 
                        href='/portfolio/watchlist'
                        style={{marginLeft: "5px"}}
                        variant="secondary"
                    >
                    Watchlist
                    </Button>
                </div>
            <Nav className="ml-auto">
                <div className='navBarSearch'>
                    <Form>
                        <Form.Group 
                            className="form-inline my-2 my-lg-0"  
                        >
                            <Form.Control
                                type="text"
                                placeholder="Search by Symbol"
                                id="symbol"
                                aria-label="Search"
                                onChange={handleChange}
                                value={formState.symbol}
                                style={{width:'75vw'}} 
                            />
                            <Link to={`/portfolio/${formState.symbol.toUpperCase()}`}>
                                <Button 
                                    variant="secondary"
                                    size="sm"
                                    as="input"
                                    type="submit"
                                    value="GO"
                                    style={{marginLeft: "5px"}}
                                    onClick={()=>setFormState(initialState)}
                                />
                            </Link>
                        </Form.Group>
                    </Form>
                </div>
            </Nav>
        </Navbar>
        
        </div>
    )
}

export default Header