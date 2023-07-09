const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();


const authRoute = require('./Routes/AuthRoute');
const orderRoute = require('./Routes/OrderRoute');
const purchaseRoute = require('./Routes/PurchaseRoute');
const propertyRoute = require('./Routes/PropertyRoute');
const productRoute = require('./Routes/ProductRoute');
const adminRoute = require('./Routes/AdminRoute');
const marketerRoute = require('./Routes/MarketerRoute');
const eventRoute = require('./Routes/EventRoute');
const clientRoute = require('./Routes/ClientRoute');
const referralRoute = require('./Routes/ReferralRoute');
const buyerRoute = require('./Routes/BuyerRoute');
const recruitmentRoute = require('./Routes/RecruitmentRoute');
const investmentRoute = require('./Routes/InvestmentRoute');
const registrationRoute = require('./Routes/RegistrationRoute');

const ErrorHandler = require('./Middlewares/ErrorHandler');

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5175;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to the Database successfully')
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5175", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse request bodies as JSON: app.use(express.json());
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoute);
app.use('/api', orderRoute);
app.use('/api', purchaseRoute);
app.use('/api', propertyRoute);
app.use('/api', productRoute);
app.use('/api', adminRoute);
app.use('/api', marketerRoute);
app.use('/api', eventRoute);
app.use('/api', clientRoute);
app.use('/api', referralRoute);
app.use('/api', buyerRoute);
app.use('/api', recruitmentRoute);
app.use('/api', investmentRoute);
app.use('/api', registrationRoute);

// Add your error handling Middleware last
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})