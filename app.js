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
    res.render('home', {clientToken: response.clientToken}, console.log(response.clientToken))
    })
  })
