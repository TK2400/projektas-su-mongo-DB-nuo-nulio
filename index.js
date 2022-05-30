require('dotenv').config();
const express = require('express');
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require('mongodb');

const cors = require('cors');
const { ObjectID } = require('bson');

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));


const client = new MongoClient(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.listen(process.env.PORT, () => {
  console.log('Serveris paleistas. Laukia užklausų');
});

app.get('/elements', (req, response) => {
  client.connect(async () => {
    const collection = client.db("nauji-elementai").collection("elementai");
    const result = await collection.find({}).toArray();
    response.json(result);
    client.close();
  });
});


// collection galima iskelti i .env (kaip aplinkos koda) pvz DB_NAME = "knygu-projektas"
//  DB_COLLECTION_NAME ir t.t.
// DB_URI - tokiu budu neliktu nei user namo nei slaptazodio kode
//  tada process.env.URI / env.DB_name ir t.t.

app.post('/element', (req, res) => {
  client.connect(async () => {
    const collection = client.db("nauji-elementai").collection("elementai");
    const result = await collection.insertOne({
      vardas: req.body.vardas,
      pavarde: req.body.pavarde,
      metai: req.body.metai,
      el_pastas: req.body.el_pastas
    });
    res.json(result);
    client.close();
  });
});


app.delete('/element', (req, res) => {
  console.log(ObjectId(req.body.id))
  client.connect(async () => {
    const collection = client.db("nauji-elementai").collection("elementai");
    const result = await collection.deleteOne({
      _id: ObjectId(req.body.id)
    })
    res.json(result);
    client.close();
  });
});


app.patch("/element", (req, res) => {
  client.connect(async function (err, client) {
    if (err) {
      res.send("Something went wrong!!");
      client.close();
    } else {
      const database = client.db("nauji-elementai");
      const collection = database.collection("elementai");
 
      const { _id, vardas } = req.body;
      // const _id = req.params.body._id;
      // const name = req.params.body.name;
      //82 ir 83 eilutes atitinka 81 eilute
      const filter = { _id: ObjectId(_id) };
      const newValues = { $set: { vardas: vardas } };
 
      try {
        const result = await collection.updateOne(filter, newValues);
        res.send(result);
        client.close();
      } catch (err) {
        res.send("Something went wrong!!");
        client.close();
      }
    }
  });
});