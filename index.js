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

app.get('/users', (req, res) => {
  client.connect(async () => {
    const collection = client.db('usersdb').collection('users');

    try {
      const result = await collection.find({}).toArray();
      res.json(result);
      client.close();
    } catch (err) {
      res.send("Something went wrong!!");
      client.close();
    }

  });
});


// collection galima iskelti i .env (kaip aplinkos koda) pvz DB_NAME = "knygu-projektas"
//  DB_COLLECTION_NAME ir t.t.
// DB_URI - tokiu budu neliktu nei user namo nei slaptazodio kode
//  tada process.env.URI / env.DB_name ir t.t.

app.post('/user', (req, res) => {
  client.connect(async () => {
    const collection = client.db('usersdb').collection('users');
    try {
      const result = await collection.insertOne({
        vardas: req.body.vardas,
        pavarde: req.body.pavarde,
        metai: req.body.metai,
        el_pastas: req.body.el_pastas
      });
      res.json(result);
      client.close();

    } catch (err) {
      res.send("Something went wrong!!");
      client.close();
    }
  });
});


app.delete('/user', (req, res) => {
  console.log(ObjectId(req.body.id))
  client.connect(async () => {
    const collection = client.db('usersdb').collection('users');
    const result = await collection.deleteOne({
      _id: ObjectId(req.body.id)
    })
    res.json(result);
    client.close();
  });
});


app.patch("/user", (req, res) => {
  client.connect(async function (err, client) {
    if (err) {
      res.send("Something went wrong!!");
      client.close();
    } else {
      const database = client.db('usersdb')
      const collection = database.collection('users')

      const { _id, vardas } = req.body;
      // const _id = req.params.body._id;
      // const name = req.params.body.name;
      //82 ir 83 eilutes atitinka 81 eilute
      const filter = { _id: ObjectId(_id) };
      const newValues = { $set: { vardas: vardas } }; // gali buti tik vardas
      // 86 eilutes syntax reikia atsiminti del mongodb PATCH metodo
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

// put updatins visa objekta
app.put("/user", (req, res) => {
  client.connect(async function (err, client) {
    if (err) {
      res.send("Something went wrong!!");
      client.close();
    } else {
      const database = client.db('usersdb')
      const collection = database.collection('users')

      const { _id, vardas, pavarde, metai, el_pastas } = req.body;
      // const _id = req.params.body._id;
      // const name = req.params.body.name;
      //82 ir 83 eilutes atitinka 81 eilute
      const filter = { _id: ObjectId(_id) };
      const newValues = {
        vardas: vardas,
        pavarde: pavarde,
        metai: metai,
        el_pastas: el_pastas
      };
      try {
        const result = await collection.replaceOne(filter, newValues);
        res.send(result);
        client.close();
      } catch (err) {
        res.send("something went wrong")
        client.close()
      }

    }
  });
});

app.get("/count/:number", (req, res) => {
  client.connect(async function (err, client) {
    if (err) {
      res.send("something went wrong")
      client.close()
    } else {
      const number = Number(req.params.number)
      console.log(number)
      const database = client.db('usersdb');
      const collection = database.collection('users');
      const result = await collection.countDocuments({ age: { $gt: number } })
      res.send(`result: ${result}`)
    }
  });
});

