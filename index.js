const port = process.env.PORT || 5000;

require("dotenv").config();
require("colors");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmm92lc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const taskCollection = client.db("goProductiveDb").collection("tasks");

    // Add Tasks
    app.post("/add-task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.json(result);
    });

    //  Get All Tasks
    app.get("/all-tasks", async (req, res) => {
      const cursor = taskCollection.find({});
      const tasks = await cursor.toArray();
      res.json(tasks);
    });

    // User Specific Tasks
    app.get("/my-tasks/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = taskCollection.find(query);
      const tasks = await cursor.toArray();
      res.json(tasks);
    });

    // Delete Task
    app.delete("/delete-task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.json(result);
    });

    //  Make Complete
    app.patch("/make-complete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const update = { $set: { status: "completed" } };
      const result = await taskCollection.updateOne(query, update);
      res.json(result);
    });

    // Get Completed Task
    app.get("/completed-tasks/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email, status: "completed" };
      const cursor = taskCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // Make Pending Task
    app.patch("/make-pending/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const update = { $set: { status: "pending" } };
      const result = await taskCollection.updateOne(query, update);
      res.json(result);
    });

    // Get Pending Task
    app.get("/pending-tasks/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email, status: "pending" };
      const cursor = taskCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
  } catch (err) {
    console.log(err);
  } finally {
  }
};
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Server is running".cyan, `on port ${port}`.yellow);
});

// goProductiveDb
// gnYpGUzqqW1eVzd3
