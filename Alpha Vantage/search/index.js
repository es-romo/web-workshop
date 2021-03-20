import React, {useContext, useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

const root = document.getElementById('root')

ReactDOM.render(
    <App/>,
    root
)

const StocksContext = React.createContext();

function App(props) {

    const [loading, setLoading] = useState( true )

    const [stock, setStock] = useState( null )

    useEffect(async () => {
        console.log(loading)
        await new Promise(resolve => setTimeout( resolve, 2000 ));
        setStock({symbol: 'GME', price: 1000,})
        setLoading(false)
    }, [])

    return (
        <StocksContext.Provider value={{
            stock,
            setStock
        }}>
        {
            loading ? <h1>Loading...</h1>  : <Stock/>
        }
        </StocksContext.Provider>
    )
}

function Stock(props) {
    const {stock} = useContext(StocksContext)
    return (
        <div style={{textAlign = 'center'}}>
            <h2>{stock.symbol}</h2>
            <h1>{`$${stock.price}`}</h1>
        </div>
    )
}