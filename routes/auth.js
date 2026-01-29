const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render('register', {
                error: 'Username and password are required'
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('register', {
                error: 'Username already exists'
            });
        }

        const user = new User({
            username,
            password,
            role: 'user'
        });

        await user.save();
        res.redirect('/login?registered=true');
    } catch (error) {
        res.render('register', {
            error: 'Registration failed. Please try again.'
        });
    }
});

router.get('/login', (req, res) => {
    const registered = req.query.registered === 'true';
    res.render('login', { registered });
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render('login', {
                error: 'Username and password are required'
            });
        }

        // VULNERABILITY: The application accepts complex query objects
        // This allows attackers to inject MongoDB operators
        const query = {
            username: username,
            password: password
        };

        const user = await User.findOne(query);

        if (!user) {
            return res.render('login', {
                error: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/dashboard');
        }
    } catch (error) {
        res.render('login', {
            error: 'Login failed. Please try again.'
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;
