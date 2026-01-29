# SecureAuth - MongoDB NoSQL Injection CTF

A production-grade web application intentionally vulnerable to MongoDB NoSQL injection attacks. This CTF challenge demonstrates advanced NoSQL injection techniques for educational purposes.

## 🎯 Challenge Information

- **Difficulty:** Hard
- **Category:** Web Security / NoSQL Injection
- **Flag:** `CTF{advanced_nosql_injection_admin_bypass}`

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── config/
│   └── db.js              # Database connection
├── middleware/
│   └── auth.js            # JWT authentication
├── models/
│   └── User.js            # User schema
├── routes/
│   ├── auth.js            # Authentication routes (VULNERABLE)
│   ├── dashboard.js       # User dashboard
│   └── admin.js           # Admin panel with flag
├── views/
│   ├── index.ejs          # Landing page
│   ├── login.ejs          # Login page
│   ├── register.ejs       # Registration page
│   ├── dashboard.ejs      # User dashboard
│   ├── admin.ejs          # Admin panel
│   └── error.ejs          # Error page
├── public/
│   └── css/
│       └── style.css      # Styling
├── server.js              # Application entry point
├── .env                   # Environment variables
└── package.json
```

## 🎮 How to Play

1. **Explore the Application**
   - Visit `http://localhost:3000`
   - Register a new account
   - Log in with your credentials
   - Notice you have "user" role, not "admin"

2. **Find the Vulnerability**
   - The admin panel at `/admin` requires admin role
   - Admin credentials are unknown
   - Find a way to bypass authentication

3. **Capture the Flag**
   - Successfully exploit the vulnerability
   - Access the admin panel
   - Retrieve the flag

## 🔍 Hints

<details>
<summary>Hint 1 (Click to reveal)</summary>

The application uses MongoDB. How does MongoDB handle query operators?
</details>

<details>
<summary>Hint 2 (Click to reveal)</summary>

What happens when you send JSON objects instead of strings in the login form?
</details>

<details>
<summary>Hint 3 (Click to reveal)</summary>

Try using MongoDB operators like `$ne`, `$gt`, or `$regex` in your payload.
</details>

## 📚 Learning Objectives

After completing this challenge, you will understand:
- How NoSQL injection attacks work
- The difference between SQL and NoSQL injection
- MongoDB query operators and their security implications
- Proper input validation techniques
- Secure authentication implementation

## ⚠️ Disclaimer

This application is **intentionally vulnerable** and designed for educational purposes only. 

**DO NOT:**
- Deploy this application in production
- Use these techniques on systems you don't own
- Share exploits without proper context

**DO:**
- Learn about NoSQL injection vulnerabilities
- Practice secure coding techniques
- Share knowledge responsibly

## 📖 Additional Resources

- [OWASP NoSQL Injection](https://owasp.org/www-community/attacks/NoSQL_injection)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 📝 License

This project is for educational purposes only.

---

**Happy Hacking! 🚩**
