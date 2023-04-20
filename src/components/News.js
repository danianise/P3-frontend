import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

function News(props) {

    const [newsData, setNewsData] = useState(null)

    useEffect(()=>{
        fetch(
            // `https://api.marketaux.com/v1/news/all?exchanges=NYSE&filter_entities=true&limit=10&api_token=36PQEqiPTidPV5uxhLInxBVnfVCCCFM8nOf6DyYQ`
            `https://api.marketaux.com/v1/news/all?exchanges=NYSE&filter_entities=true&limit=3&api_token=2SByJiG7goHjjAkCClP6txIpIATuK9rvG9wjlQAO`
        )
        .then(res=>res.json())
        .then(data=>{
            // console.log(data)
            setNewsData(data)
        })
        // console.log({newsData})
    }, [])

    // console.log({newsData})

    if(newsData){
        if(props.amount === 1){
            return (
                <div className='news'>
                    <Card className='newsCard' style={{width:props.width}}>
                        <Card.Body style={{marginTop:-18}}>
                            <Card.Title style={{fontSize:'smaller'}}>{newsData.data[0].title}</Card.Title>
                            <Card.Img src={newsData.data[0].image_url} />
                            <p style={{fontSize: 'xx-small'}}>{newsData.data[0].source}</p>
                            <Card.Text style={{fontSize:'small'}}>
                                {newsData.data[0].snippet}
                            </Card.Text>
                            <Button href={newsData.data[0].url} variant="secondary">Read More</Button>
                        </Card.Body>
                    </Card>
                </div>
            )
        } else if (props.amount === 3){
            return (<>
                <div className='news'>
                    <Card className='newsCard' style={{width:props.width, height:props.height, overflowY:'scroll'}}>
                        <Card.Body style={{marginTop:-18}}>
                            <Card.Title style={{fontSize:'smaller'}}>{newsData.data[0].title}</Card.Title>
                            <Card.Img src={newsData.data[0].image_url} />
                            <p style={{fontSize: 'xx-small'}}>{newsData.data[0].source}</p>
                            <Card.Text style={{fontSize:'small'}}>
                                {newsData.data[0].snippet}
                            </Card.Text>
                            <Button href={newsData.data[0].url} variant="secondary">Read More</Button>
                        </Card.Body>
                    </Card>
                </div>
                <div className='news'>
                    <Card className='newsCard' style={{width:props.width, height:props.height, overflowY:'scroll'}}>
                        <Card.Body style={{marginTop:-18}}>
                            <Card.Title style={{fontSize:'smaller'}}>{newsData.data[1].title}</Card.Title>
                            <Card.Img src={newsData.data[1].image_url} />
                            <p style={{fontSize: 'xx-small'}}>{newsData.data[1].source}</p>
                            <Card.Text style={{fontSize:'small'}}>
                                {newsData.data[1].snippet}
                            </Card.Text>
                            <Button href={newsData.data[1].url} variant="secondary">Read More</Button>
                        </Card.Body>
                    </Card>
                </div>
                <div className='news'>
                    <Card className='newsCard' style={{width:props.width, height:props.height, overflowY:'scroll'}}>
                        <Card.Body style={{marginTop:-18}}>
                            <Card.Title style={{fontSize:'smaller'}}>{newsData.data[2].title}</Card.Title>
                            <Card.Img src={newsData.data[2].image_url} />
                            <p style={{fontSize: 'xx-small'}}>{newsData.data[2].source}</p>
                            <Card.Text style={{fontSize:'small'}}>
                                {newsData.data[2].snippet}
                            </Card.Text>
                            <Button href={newsData.data[2].url} variant="secondary">Read More</Button>
                        </Card.Body>
                    </Card>
                </div>
            </>)
        }
    }
}

export default News