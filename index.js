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
app.use(express.static("public")) // sita eilute leidzia node'ui express pagalba grazinti failus
app.use(cors({
  origin: '*'
}));


// is Egidijaus kodo pavyzdyus del env duomenu
const {
  PORT, DBC, URI, CE
} = process.env


const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.listen(PORT, () => {
  console.log(`Serveris paleistas. Laukia užklausų ant ${PORT} porto`);
});

app.get('/users', (req, res) => {
  client.connect(async () => {
    const collection = client.db(DBC).collection(CE);
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

// let sequenceNumber = 0



app.post('/users', (req, res) => {
  client.connect(async () => {
    const collection = client.db('usersdb').collection('users');
    const userCount = await collection.countDocuments()
      const sortedUserData = await collection.find().sort({ number: 1 }).toArray()
    const numbers = sortedUserData.map(el => el.number).sort((a, b) => a - b)
    
    function findMissingNumber(arr) {
      for (let i = 0; i < arr.length; i++) {
        if ((arr[i+1] - arr[i])>1 && arr[0] === 1) {
          return arr[i] + 1
        }  else if( arr[0]!=1){
          return 1
        } else  return userCount+1
      }
    }

    // function findMissingNumber(arr) {
    //   for (let i = 0; i < arr.length; i++) {
    //     if ((arr[i + 1] - arr[i]) > 1) {
    //       return (arr[i] + 1)
    //     } else if ((arr[0] != 1)) {
    //       return 1
    //     } else {
    //       return userCount
    //     }
    //   }
    // }
      const newNumber = findMissingNumber(numbers)
      console.log(newNumber)

      try {
        const result = await collection.insertOne({
          name: req.body.name,
          age: req.body.age,
          number: newNumber
        });
        res.json(result);
        client.close();

      } catch (err) {
        res.send("Something went wrong!!");
        client.close();
      }
    });
});


app.delete('/users/:id', (req, res) => {
  const id = req.params.id
  client.connect(async () => {
    const collection = client.db('usersdb').collection('users');
    const result = await collection.deleteOne({
      _id: ObjectId(id)
    })
    res.json(result);
    client.close();
  });
});


// app.patch("/user", (req, res) => {
//   client.connect(async function (err, client) {
//     if (err) {
//       res.send("Something went wrong!!");
//       client.close();
//     } else {
//       const database = client.db('usersdb')
//       const collection = database.collection('users')

//       const { _id, vardas } = req.body;
//       // const _id = req.params.body._id;
//       // const name = req.params.body.name;
//       //82 ir 83 eilutes atitinka 81 eilute
//       const filter = { _id: ObjectId(_id) };
//       const newValues = { $set: { vardas: vardas } }; // gali buti tik vardas
//       // 86 eilutes syntax reikia atsiminti del mongodb PATCH metodo
//       try {
//         const result = await collection.updateOne(filter, newValues);
//         res.send(result);
//         client.close();
//       } catch (err) {
//         res.send("Something went wrong!!");
//         client.close();
//       }
//     }
//   });
// });

// put updatins visa objekta
// app.put("/user", (req, res) => {
//   client.connect(async function (err, client) {
//     if (err) {
//       res.send("Something went wrong!!");
//       client.close();
//     } else {
//       const database = client.db('usersdb')
//       const collection = database.collection('users')

//       const { _id, vardas, pavarde, metai, el_pastas } = req.body;
//       // const _id = req.params.body._id;
//       // const name = req.params.body.name;
//       //82 ir 83 eilutes atitinka 81 eilute
//       const filter = { _id: ObjectId(_id) };
//       const newValues = {
//         vardas: vardas,
//         pavarde: pavarde,
//         metai: metai,
//         el_pastas: el_pastas
//       };
//       try {
//         const result = await collection.replaceOne(filter, newValues);
//         res.send(result);
//         client.close();
//       } catch (err) {
//         res.send("something went wrong")
//         client.close()
//       }

//     }
//   });
// });

// app.get("/count/:from/:to", (req, res) => {
//   client.connect(async function (err, client) {
//     if (err) {
//       res.send("something went wrong")
//       client.close()
//     } else {
//       const from = Number(req.params.from)
//       const to = Number(req.params.to)
//       const database = client.db('usersdb');
//       const collection = database.collection('users');
//       const result = await collection.countDocuments({ age: { $gt: from, $lt: to } })
//       res.send(`result: ${result}`)
//     }
//   });
// });

// app.get("/sum/:user", (req, res) => {
//   client.connect(async function (err, client) {
//     if (err) {
//       res.send("something went wrong")
//       client.close()
//     } else {
//       const database = client.db('usersdb');
//       const collection = database.collection('users');
//       const result = await collection
//         .aggregate([
//           { $match: { name: req.params.user } },
//           { $group: { _id: "$name", amziausVidurkis: { $avg: "$age" } } }])
//         .toArray()
//       res.send(result)
//     }
//   });
// });

// app.get("/count/:from/:to", (req, res) => {
//   client.connect(async function (err, client) {
//     if (err) {
//       res.send("something went wrong")
//       client.close()
//     } else {
//       const from = Number(req.params.from)
//       const to = Number(req.params.to)
//       const database = client.db('usersdb');
//       const collection = database.collection('users');
//       const result = await collection.countDocuments({ age: { $gt: from, $lt: to } })
//       res.send(`result: ${result}`)
//     }
//   });
// });

// app.get("/count", (req, res) => {
//   client.connect(async function (err, client) {
//     if (err) {
//       res.send("something went wrong")
//       client.close()
//     } else {

//       const database = client.db('usersdb');
//       const collection = database.collection('users');
//       const result = await collection.countDocuments(/*{ age: { $gt: 50 } }*/)
//       res.send({ result })
//     }
//   });
// });
