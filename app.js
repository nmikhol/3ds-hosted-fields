const express = require('express')
const braintree = require("braintree")
const path = require('path')
const exphbs = require('express-handlebars')
const gateway = require('./btCredentials.js')

// establish port
const PORT = process.env.PORT || 3000
const app = express()

app.set('views', path.join(__dirname, 'views')) // specify that templates will live in the "views" directory
app.engine('.hbs', exphbs({extname: '.hbs'}))
app.set('view engine', '.hbs') // specify that we are using "handlebars" as our template engine

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => console.log(`App is up and running listening on port ${PORT}`))

app.get('/', (req, res, next) => {
  gateway.clientToken.generate({},(err, response) => {
    res.render('home', {clientToken: response.clientToken})
    })
  })

app.get('/history', (req, res, next) => {
    res.render('history')
  })

app.post('/transaction', (req, res, next) => {
  let paymentNonce = req.body.payment_method_nonce
  let firstName = req.body.firstName
  let lastName = req.body.lastName
  let email = req.body.email
  let postalCode = req.body.postalCode
  let amount = req.body.amount

  let newTransaction = gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: paymentNonce,
    options: {
      submitForSettlement: true
    },
    billing: {
      postalCode: postalCode
    },
    customer: {
      firstName:firstName,
      lastName: lastName
    }
  }, function(error, result) {
    if (result.success || result.transaction) {
      res.render('results', {transactionResponse: result});

    } else {
      transactionErrors = result.errors.deepErrors();
      req.flash('error', {msg: formatErrors(transactionErrors)});
      res.render('results');
      }
  });

});
