import express from 'express';
import AllRouter from './controllers/student';
import connectDB from './db';
const app = express();

app.use(express.json());
app.use('/api', AllRouter);

connectDB();

app.listen(3002, () => {
    console.log('Server listening on http://localhost:3002');
})