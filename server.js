require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', adminRoutes);

// Seed admin user
const seedAdmin = async () => {
    try {
        const adminData = {
            username: 'admin',
            password: 'admin@123',
            role: 'admin'
        };

        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            await User.create(adminData);
            console.log('Admin user seeded successfully');
        } else {
            // Ensure the password is updated to the one in the code
            adminExists.password = adminData.password;
            await adminExists.save();
            console.log('Admin password updated to match seed data');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

seedAdmin();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
