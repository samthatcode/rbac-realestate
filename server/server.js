const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const axios = require('axios');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'public/images'); // use absolute paths

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir); // use the directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Export both 'dir' and 'upload'
module.exports = { dir, upload };

app.use('/public/images', express.static(dir));


const User = require('./Models/UserModel');

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
const roleRoute = require('./Routes/RoleRoute');
const categoryRoute = require('./Routes/CategoryRoute');
const verificationRoute = require('./Routes/VerificationRoute');

const ErrorHandler = require('./Middlewares/ErrorHandler');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5175;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to the Database successfully');
    try {
      const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

      if (!existingAdmin) {
        const adminUser = new User({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD, // plaintext password
          firstName: "Admin",
          lastName: "User",
          role: "admin",
        });

        await adminUser.save();
        console.log("Admin user has been seeded");
        console.log('Admin user:', adminUser); // Log the admin user data
      } else {
        console.log("Admin user already exists");
      }

    } catch (error) {
      console.error("Error seeding admin user:", error);
    }

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

// Paystack payment integration
app.post('/api/charge', async (req, res) => {
  try {
    const { email, amount } = req.body; // Paystack requires email and amount

    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: amount * 100, // convert to kobo
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`
      }
    });

    console.log(response.data);
    res.json({ message: 'Payment initialized!', data: response.data.data });
  } catch (error) {
    console.log(error);
    res.json({ message: 'Payment failed.' });
  }
});

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
app.use('/api', roleRoute);
app.use('/api', categoryRoute);
app.use('/api', verificationRoute);


// Add your error handling Middleware last
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})