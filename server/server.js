import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/AdminRoute.js';
import blogRouter from './routes/blogRoutes.js';

// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
await connectDB();

// // Serve static frontend for any unknown route (React SPA)
// app.use(express.static(path.join(__dirname, "client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/dist", "index.html"));
// });

//middlewarees
app.use(express.json())
app.use(cors())

//routes
app.get('/', (req,res) => res.send('API is working'))
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`
))

export default app;