const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/admin', authenticateToken, requireAdmin, (req, res) => {
    res.render('admin', {
        username: req.user.username,
        flag: process.env.FLAG
    });
});

module.exports = router;
