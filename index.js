const express = require('express');
const cors = require('cors')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()

const PORT = process.env.PORT || 4000

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uoagi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() { 
    try { 
        await client.connect();
        const database = client.db('versity_student')
        const studentCollection = database.collection('students')

        app.get('/students',async (req, res) => {
        const student = req.body
        const cursor = studentCollection.find(student);
        const students = await cursor.toArray();
        console.log(students); 
        res.json(students)
        })
        
        app.get('/students/:uniqueId', async (req, res) => {
        const id = req.params.uniqueId;
        const query = { uniqueId : id }
        const result = await studentCollection.findOne(query)   
        res.json(result)     
      })
     }
    finally {
      //   await client.close();
    }
  }
run().catch(console.dir);
  
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
