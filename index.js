const express = require('express')
const app = express()
const port = 5000
let products = require("./products1.json")
const bodyParser = require('body-parser')
const fs = require('fs')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/api/products', (req, res) => {
    res.send(products)
})
app.post('/api/pay', (req, res) => {
    const productsCopy = products.map(p =>({...p}))
    // el req.body (es el request que mando desde el front al back(osea aca.) el res.send(es el response.))
    const ids = req.body
    ids.forEach(id => {
        const product = productsCopy.find(p => p.id === id)
        if (product.stock > 0){
            product.stock--
        } else {
            throw("Sin Stock!")
        }

    })
    products = productsCopy
    fs.writeFile("./products1.json", JSON.stringify(products), err =>{
        if (err){
            console.log(err)
        } else {
            console.log("File Succesfully updated")
        }
    })
    res.send(products) 
})



app.use('/', express.static('pages'))
app.use(express.static('assets'))
app.use(express.static('scripts'))





app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})