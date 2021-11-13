const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyzns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('phono');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');
        const userCollection = database.collection('users');
    

        //GET Products API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        //add Products API
        app.post('/products', async (req, res) => {

            const product = req.body;
            console.log('product', product);
            const result = await productCollection.insertOne(product);
            res.json(result)
         });
       
         //add user API
        app.post('/users', async (req, res) => {

            const user = req.body;
            console.log('user', user);
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result)
         });

          //add admin api
        app.put('/users/admin',async(req,res)=>{
            const user = req.body;
            console.log('put',user);
            const filter = {email:user.email}
            const updateDoc={$set:{role:'admin'}}
            const result = userCollection.updateOne(filter, updateDoc )
            res.json(result);
        })
        
         //get admin API
        app.get('/users/:email', async (req, res) => {

            const email = req.params.email;
            const query = {email:email};
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
         });
        //Add order
        app.post('/orders', async (req, res) => {

            const order = req.body;
            console.log('order', order);
            const result = await orderCollection.insertOne(order);
            res.json(result);

        });

         //Add review
         app.post('/reviews', async (req, res) => {

            const review = req.body;
            console.log('review', review);
            const result = await reviewCollection.insertOne(review);
            res.json(result)
         });

        //GET review API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });


        //GET order API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });


        //Delete order Api
        app.delete('/orders/:id',async(req, res)=>{
            var ObjectId = require('mongodb').ObjectID;
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            console.log('deleted',result);

            res.json(result);
        })


        //Delete product Api
        app.delete('/products/:id',async(req, res)=>{
            var ObjectId = require('mongodb').ObjectID;
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            console.log('deleted',result);
            res.json(result);
        })


       


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('phono server running')
})

app.listen(port, () => {
    console.log('Server running at port', port);
})