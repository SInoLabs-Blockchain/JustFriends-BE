const express = require('express');
const app = express();
const port = 3000;
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

app.use('/api', userRoutes); // Gắn kết routes cho người dùng

app.listen(port, () => {
  console.log(`Ứng dụng Express đang chạy tại http://localhost:${port}`);
});
