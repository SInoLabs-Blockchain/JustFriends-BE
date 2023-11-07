const express = require('express');
const { Sequelize } = require('sequelize');
const UserRoute = require('./routes/UserRoute');
const PostRoute = require('./routes/PostRoute');
const authMiddleware = require('./middlewares/AuthMiddleware');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const app = express();
const sequelize = new Sequelize('postgres://myuser:mypassword@localhost:5432/mydb');

require('dotenv').config();

// Sử dụng CORS cho tất cả các route
app.use(cors());

// Hoặc bạn có thể cấu hình CORS một cách cụ thể
app.use(cors({
  origin: '*', // chỉ cho phép domain này truy cập
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // các phương thức được cho phép
  credentials: true, // cho phép cookie
  optionsSuccessStatus: 204 // một số trình duyệt cũ chọn 204 làm giá trị mặc định cho successful response
}));

app.use(bodyParser.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(authMiddleware);

app.use('/api', UserRoute, PostRoute);

sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});