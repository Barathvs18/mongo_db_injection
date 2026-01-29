const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', {
        username: req.user.username,
        role: req.user.role
    });
});

module.exports = router;
