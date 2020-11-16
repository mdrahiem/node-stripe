const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51HngbyIdnfa9CampnmbmmiTKN2VQJps7ryfAT5rn59kYzqs26X8dJJGWH9e13l0hMUs4Gc4zG2BmcWhJUbeurcN500U3yfNf7Q');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();

const jsonParser = bodyParser.json()

app.get('/', (req, res) => res.send('Hellooooo'))

app.get('/hell', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send('Hello World')
})

app.post('/payment', jsonParser, (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('REQUEST', req.body);
    debugger
    const { product, token } = req.body;
    console.log('PRODUCT ', product);
    console.log('TOKEN ', token);
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    })
    .then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase or ${product.name}`
        }, { idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
})

// MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
})
// parse application/json
app.use(bodyParser.json())
app.use(function (req, res) {
    res.setHeader('Content-Type', 'text/plain')
    res.write('you posted:\n')
    res.end(JSON.stringify(req.body, null, 2))
})

// LISTEN
app.listen(8282, () => console.log('Server is listing to 8282'));