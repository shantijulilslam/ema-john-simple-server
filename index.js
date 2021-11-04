const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');


const app = express();
app.use(bodyParser.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hopim.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
  const ordersCollection = client.db(process.env.DB_NAME).collection("orders");
  app.post('/addProducts',(req,res) => {
    const products = req.body;
    console.log(products)
    productsCollection.insertOne(products)
    .then(result=>{
      res.send(result.insertedCount > 0)
    })

  })

  app.get('/products',(req,res)=>{
    productsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.get('/product/:key',(req,res)=>{
    productsCollection.find({key: req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys',(req,res)=>{
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray((err,documents)=>{
      res.send(documents);
      
    })
  })

  app.post('/addOrder',(req,res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result=>{
      res.send(result.insertedCount > 0)
    })

  })


});


app.listen(port)