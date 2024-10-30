require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Database connection URI and client instance
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let telematicsCollection;

// Connect to MongoDB and initialize the collection
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        const database = client.db("telematicsDB");
        telematicsCollection = database.collection("telematicsData");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

// POST endpoint to add telematics data
app.post('/telematics', async (req, res) => {
    try {
        const data = req.body;
        const result = await telematicsCollection.insertOne(data);
        res.status(201).json({ message: "Data added", id: result.insertedId });
    } catch (error) {
        console.error("Error saving telematics data:", error);
        res.status(500).json({ error: "Error saving data" });
    }
});

// GET endpoint to retrieve all telematics data
app.get('/telematics', async (req, res) => {
    try {
        const data = await telematicsCollection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error retrieving telematics data:", error);
        res.status(500).json({ error: "Error retrieving data" });
    }
});

// Start server and connect to DB
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
