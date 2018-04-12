require('./env')
const express = require('express')
const bodyParser = require('body-parser')

const fileHelpers = require('./fileHelpers')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))

app.post('/api/write', async function (req, res) {
  await fileHelpers.appendTetrisData(req.body)
  res.status(200).json({message: 'ok'})
})

app.use(function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`)
})

app.listen(process.env.PORT, function () {
  console.log(`
    Started application
    ENV: ${process.env.NODE_ENV}
    PORT: ${process.env.PORT}
  `)
})
