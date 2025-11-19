const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', async () => {
    console.log("MongoDB database connection established successfully");

    try {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            if (collection.collectionName === 'cultures') {
                await collection.deleteMany({});
                console.log("Cleared 'cultures' collection.");
            }
        }

        console.log("Database cleared.");
        process.exit(0);
    } catch (err) {
        console.error("Error clearing database:", err);
        process.exit(1);
    }
});
