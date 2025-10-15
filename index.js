const express = require('express')
var cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

// pass: todoapp

const uri = "mongodb+srv://mongodb:todoapp@cluster0.4nzmshr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

      // code for connect server and database
    const database = client.db('usersdb');
    const userCollection = database.collection('users');
    
    app.get('/users',async(req,res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    app.get('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    app.put('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const user = req.body;
      
      const updateDoc = {
        $set : {
          name:user.name,
          email:user.email
        }
      }
      const options = {upsert:true};
      console.log(user);
      const result = await userCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    })


    app.post('/users',async (req,res)=>{
      console.log('data is posted ',req.body);

      // code for userCollection
      const newUser = req.body
      const result = await userCollection.insertOne(newUser)
      res.send(result);
    })

    app.delete('/users/:id',async (req,res)=>{
      // console.log(req.params);
      const id = req.params;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);

app.get('/',(req, res)=>{
    res.send('simple data base server is running ');
})


app.listen(port,()=>{
    console.log(`Exalmple app is Listing on port: localhost:${port}`);
})

