require('dotenv').config();
const express = require('express');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`收到請求: ${req.method} ${req.url}`);
  next();
});

app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
