import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/config.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


// Middleware for JSON parsing
app.use(express.json());

// Connect to the database before starting the server
connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
});


app.get('/', (req, res) => {
    res.send('Hello World');
});
