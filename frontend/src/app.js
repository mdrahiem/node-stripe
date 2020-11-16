import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const App = () => {
    const [product, setProduct] = useState({
        name: 'React Book',
        price: 10,
        productBy: 'Facebook'
    })
    useEffect(() => {
        fetch('http://localhost:8282/hell')
            .then(resp => resp.json())
            .then(data => console.log('dddddddddddddddd', data))
    }, [])
    const onToken = token => {
        const body = {
            token,
            product
        };
        const headers = {
            "Content-Type": "application/json"
        };
        return fetch('http://localhost:8282/payment', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        }).then(resp => {
            console.log('helllllllllllllllllllllo', resp)
            return resp.json()}).then(data => console.log(data))
        .catch(err => console.log('stripe checkout failed ', err));
    }
    return (
        <div className="container">
            <StripeCheckout
                name={"Buy React Book"}
                token={onToken}
                stripeKey={'pk_test_51HngbyIdnfa9CampoBnds6FiUwOWRFQtts8HzHH7GaZb5nYOgiJheRF6BQJNHwqdPs1sy1sft6PVKujmSIKlyN1Y006mzPI6lv'}
                amount={product.price * 100}
            >
                <button className="btn waves-effect waves-light" type="submit" name="action">Buy Now</button>
            </StripeCheckout>
        </div>
    );
}

export default App;