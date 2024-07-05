const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const transactionsRouter = require("./routes/users"); // Adjust the path as necessary

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", transactionsRouter);

const url =
  "mongodb+srv://thakareniraj26:YqObWAmnT7DEzEoY@cluster0.gemcobu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "gfg";

mongoose.connect(`${url}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongo() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to database");
    return client;
  } catch (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
}

// Basic route
app.get("/", (req, res) => {
  res.send("Product Transactions API");
});

// app.get("/", async (req, res) => {
//   try {
//     const client = await connectToMongo();
//     const db = client.db(dbName);
//     const collection = db.collection("data");

//     const documents = await collection.find({}).toArray();
//     res.json(documents);
//   } catch (err) {
//     console.error("An error occurred:", err);
//     res.status(500).send("An error occurred while fetching data.");
//   }
// });

app.post("/data", (req, res) => {
  res.send("posted");
});

app.get("/data", async (req, res) => {
  try {
    const client = await connectToMongo();
    const db = client.db(dbName);
    const collection = db.collection("data");

    const documents = await collection.find({}).toArray();

    res.json(documents);
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send("An error occurred while fetching data.");
  }
});

app.get("/api/product-transactions", async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const perPage = 10; // Set to 10 as per your requirement

    let query = {};
    if (search) {
      query = {
        $or: [
          { productTitle: { $regex: search, $options: "i" } },
          { productDescription: { $regex: search, $options: "i" } },
          { productPrice: isNaN(search) ? null : parseFloat(search) },
        ],
      };
    }

    const total = await ProductTransaction.countDocuments(query);
    const transactions = await ProductTransaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({
      transactions,
      total,
      pages: Math.ceil(total / perPage),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}`);
});
