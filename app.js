import express from 'express';
import { Sequelize } from 'sequelize';
import UserRoute from './routes/UserRoute.js';
import PostRoute from './routes/PostRoute.js';
import authMiddleware from './middlewares/AuthMiddleware.js';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const sequelize = new Sequelize(process.env.DATABASE_URL);

// Use CORS for all routes
app.use(cors());

// Or you can configure CORS specifically
app.use(cors({
  origin: '*', // only allow this domain to access
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // allowed methods
  credentials: true, // allow cookies
  optionsSuccessStatus: 204 // some older browsers choose 204 as the default value for successful responses
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