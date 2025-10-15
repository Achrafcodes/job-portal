# 🚀 Job Portal Backend Development Roadmap

A step-by-step guide to building your Express.js + MongoDB job portal backend.

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ Node.js (v16+) installed
- ✅ MongoDB installed locally or MongoDB Atlas account
- ✅ Postman or Thunder Client for API testing
- ✅ Basic knowledge of Express.js and MongoDB
- ✅ Git for version control

---

## Phase 1: Project Setup & Configuration (Day 1)

### Step 1.1: Initialize Project

```bash
mkdir job-portal-backend
cd job-portal-backend
npm init -y
```

### Step 1.2: Install Dependencies

```bash
# Core dependencies
npm install express mongoose dotenv cors helmet

# Authentication
npm install jsonwebtoken bcryptjs

# Validation & Security
npm install express-validator express-rate-limit

# File Upload
npm install multer cloudinary

# Utilities
npm install morgan winston

# Development dependencies
npm install -D nodemon
```

### Step 1.3: Create Folder Structure

```bash
mkdir -p src/{config,models,controllers,routes,middleware,services,utils,validators}
mkdir tests logs
```

### Step 1.4: Setup Environment Variables

Create `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=30m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 1.5: Create Entry Point

Create `server.js` and `src/app.js`

**✅ Checkpoint:** Server should start successfully

---

## Phase 2: Database Setup (Day 1-2)

### Step 2.1: Database Connection

Create `src/config/database.js`

- Setup MongoDB connection with Mongoose
- Add connection error handling
- Add connection event listeners

### Step 2.2: Create Models

#### User Model (`src/models/User.js`)

- username, email, passwordHash, role
- profile object (firstName, lastName, phone, etc.)
- Pre-save hook for password hashing
- Method to compare passwords
- Virtual for fullName

#### Job Model (`src/models/Job.js`)

- title, description, company, location
- salary object, skills array
- recruiterId reference
- status enum
- Add indexes for search optimization

#### Application Model (`src/models/Application.js`)

- candidateId, jobId references
- resumeUrl, coverLetter, status
- Compound unique index on candidateId + jobId

#### RefreshToken Model (`src/models/RefreshToken.js`)

- userId, token, expiresAt
- TTL index for automatic deletion

**✅ Checkpoint:** Models created with proper schemas and indexes

---

## Phase 3: Authentication System (Day 2-3)

### Step 3.1: JWT Utilities

Create `src/utils/jwt.js`

- generateAccessToken()
- generateRefreshToken()
- verifyToken()

### Step 3.2: Auth Middleware

Create `src/middleware/auth.js`

- authenticate() - Verify JWT token
- authorize(roles) - Check user roles

### Step 3.3: Auth Controller

Create `src/controllers/authController.js`

Implement:

- `signup()` - Register new user

  - Validate input
  - Check if user exists
  - Hash password
  - Create user
  - Generate tokens
  - Return response

- `login()` - Authenticate user

  - Find user by email
  - Compare password
  - Generate tokens
  - Save refresh token
  - Return response

- `refreshToken()` - Get new access token

  - Verify refresh token
  - Check in database
  - Generate new access token
  - Return new token

- `logout()` - Invalidate session
  - Delete refresh token from DB
  - Return success

### Step 3.4: Auth Routes

Create `src/routes/auth.routes.js`

- POST /signup
- POST /login
- POST /refresh
- POST /logout

**✅ Checkpoint:** Test all auth endpoints with Postman

---

## Phase 4: User Management (Day 3-4)

### Step 4.1: User Controller

Create `src/controllers/userController.js`

Implement:

- `getProfile()` - Get current user
- `updateProfile()` - Update user info
- `changePassword()` - Update password
- `deleteAccount()` - Delete user
- `getAllUsers()` - Admin only
- `getUserById()` - Admin only

### Step 4.2: User Routes

Create `src/routes/user.routes.js`

- GET /profile (authenticated)
- PUT /profile (authenticated)
- PUT /password (authenticated)
- DELETE /account (authenticated)
- GET / (admin only)
- GET /:id (admin only)

### Step 4.3: Input Validation

Create `src/validators/userValidator.js`

- Use express-validator
- Validate email format
- Password strength requirements
- Phone number format

**✅ Checkpoint:** Test user CRUD operations

---

## Phase 5: Job Management (Day 4-5)

### Step 5.1: Job Controller

Create `src/controllers/jobController.js`

Implement:

- `createJob()` - Recruiter creates job
- `getAllJobs()` - List with filters & pagination
- `getJobById()` - Get single job details
- `updateJob()` - Recruiter updates own job
- `deleteJob()` - Recruiter deletes own job
- `getMyJobs()` - Recruiter's jobs
- `searchJobs()` - Advanced search

### Step 5.2: Job Service (Optional)

Create `src/services/jobService.js`

- buildSearchQuery() - Build MongoDB query
- applyFilters() - Filter logic
- paginateResults() - Pagination helper

### Step 5.3: Job Routes

Create `src/routes/job.routes.js`

- POST / (recruiter only)
- GET / (public)
- GET /search (public)
- GET /my-jobs (recruiter only)
- GET /:id (public)
- PUT /:id (recruiter only)
- DELETE /:id (recruiter only)

### Step 5.4: Job Validators

Create `src/validators/jobValidator.js`

- Validate required fields
- Validate enums (jobType, locationType)
- Validate salary range
- Validate dates

**✅ Checkpoint:** Test job CRUD and search functionality

---

## Phase 6: Application System (Day 5-6)

### Step 6.1: File Upload Setup

Create `src/config/cloudinary.js`

- Configure Cloudinary
- Create upload middleware with Multer

### Step 6.2: Application Controller

Create `src/controllers/applicationController.js`

Implement:

- `submitApplication()` - Candidate applies

  - Check if already applied
  - Upload resume to Cloudinary
  - Create application
  - Increment job applicationsCount

- `getMyApplications()` - Candidate's applications
- `getApplicationById()` - Get single application
- `getJobApplications()` - Recruiter views applicants
- `updateApplicationStatus()` - Recruiter updates status
- `withdrawApplication()` - Candidate withdraws

### Step 6.3: Application Routes

Create `src/routes/application.routes.js`

- POST / (candidate only)
- GET / (authenticated)
- GET /:id (authenticated)
- GET /job/:jobId (recruiter only)
- PUT /:id/status (recruiter only)
- DELETE /:id (candidate only)

**✅ Checkpoint:** Test application submission with file upload

---

## Phase 7: Middleware & Security (Day 6-7)

### Step 7.1: Error Handling

Create `src/middleware/errorHandler.js`

- Global error handler
- Custom error classes
- Format error responses

### Step 7.2: Rate Limiting

Create `src/middleware/rateLimiter.js`

- General rate limit (100 requests/15min)
- Auth rate limit (5 requests/15min)
- Apply to routes

### Step 7.3: Input Validation Middleware

Create `src/middleware/validate.js`

- Centralized validation error handler
- Works with express-validator

### Step 7.4: Security Headers

In `src/app.js`:

- Apply helmet()
- Configure CORS
- Add security best practices

### Step 7.5: Logging

Create `src/utils/logger.js`

- Setup Winston logger
- Log to file and console
- Different log levels

**✅ Checkpoint:** Test error handling and rate limiting

---

## Phase 8: Advanced Features (Day 7-8)

### Step 8.1: Search Optimization

- Add text indexes to Job model
- Implement full-text search
- Add filters (location, salary, skills)
- Add sorting options

### Step 8.2: Pagination Helper

Create `src/utils/pagination.js`

- Reusable pagination logic
- Calculate total pages
- Return metadata

### Step 8.3: Email Service (Optional)

Create `src/services/emailService.js`

- Welcome email on signup
- Application confirmation
- Status update notifications

### Step 8.4: Password Reset (Optional)

- Add forgot-password endpoint
- Generate reset token
- Send reset email
- Verify and reset password

**✅ Checkpoint:** Test advanced features

---

## Phase 9: Testing & Documentation (Day 8-9)

### Step 9.1: API Testing

- Create Postman collection
- Test all endpoints
- Test error scenarios
- Test authentication flow

### Step 9.2: Create README.md

Include:

- Project description
- Installation instructions
- Environment variables
- API endpoints documentation
- Usage examples

### Step 9.3: Add Comments

- Document complex functions
- Add JSDoc comments
- Explain business logic

**✅ Checkpoint:** All endpoints tested and documented

---

## Phase 10: Optimization & Deployment Prep (Day 9-10)

### Step 10.1: Performance Optimization

- Add database indexes
- Implement query optimization
- Add response caching (Redis - optional)
- Compress responses

### Step 10.2: Security Audit

- Review authentication logic
- Check for SQL/NoSQL injection
- Validate all user inputs
- Review CORS settings
- Check rate limiting

### Step 10.3: Environment Setup

- Create `.env.example`
- Document all environment variables
- Setup for different environments

### Step 10.4: Deployment Preparation

- Add production database
- Setup MongoDB Atlas
- Configure Cloudinary for production
- Add process manager (PM2)

**✅ Checkpoint:** Ready for deployment

---

## 📚 Additional Enhancements (Optional)

### Week 2+: Advanced Features

1. **Caching with Redis**

   - Cache popular jobs
   - Store refresh tokens in Redis
   - Implement cache invalidation

2. **Real-time Notifications**

   - Socket.io integration
   - Real-time application updates
   - Notification system

3. **Analytics Dashboard**

   - Track job views
   - Application statistics
   - User activity metrics

4. **Advanced Search**

   - Elasticsearch integration
   - Fuzzy search
   - Search suggestions

5. **Job Recommendations**
   - ML-based recommendations
   - Match candidates to jobs
   - Skill-based matching

---

## 🎯 Daily Goals Summary

| Day  | Focus            | Deliverable                         |
| ---- | ---------------- | ----------------------------------- |
| 1    | Setup + Database | Project initialized, models created |
| 2-3  | Authentication   | Complete auth system working        |
| 3-4  | User Management  | User CRUD operations                |
| 4-5  | Job Management   | Job CRUD + search                   |
| 5-6  | Applications     | Application system + file upload    |
| 6-7  | Security         | Middleware + error handling         |
| 7-8  | Advanced         | Search, pagination, extras          |
| 8-9  | Testing          | All endpoints tested + documented   |
| 9-10 | Polish           | Optimized + deployment ready        |

---

## 🛠️ Tech Stack Checklist

- [x] Express.js - Web framework
- [x] MongoDB + Mongoose - Database
- [x] JWT - Authentication
- [x] Bcrypt - Password hashing
- [x] Multer - File upload
- [x] Cloudinary - File storage
- [x] Helmet - Security headers
- [x] CORS - Cross-origin requests
- [x] Express-validator - Input validation
- [x] Express-rate-limit - Rate limiting
- [x] Winston - Logging
- [x] Morgan - HTTP logger

---

## 📖 Learning Resources

- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Mongoose**: https://mongoosejs.com/
- **JWT**: https://jwt.io/
- **REST API Best Practices**: https://restfulapi.net/

---

## 🚨 Common Pitfalls to Avoid

1. ❌ Don't store passwords in plain text
2. ❌ Don't expose sensitive data in responses
3. ❌ Don't skip input validation
4. ❌ Don't forget error handling
5. ❌ Don't hardcode secrets
6. ❌ Don't skip rate limiting
7. ❌ Don't forget to add indexes
8. ❌ Don't return full error stack in production

---

## ✅ Final Checklist Before Deployment

- [ ] All endpoints tested
- [ ] Error handling implemented
- [ ] Input validation on all routes
- [ ] Authentication working
- [ ] Authorization checks in place
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] Logging implemented
- [ ] Environment variables documented
- [ ] README.md completed
- [ ] Database indexes added
- [ ] File upload working
- [ ] CORS configured properly
- [ ] Production database setup

---

**Good luck with your backend development! 🚀**

Start with Phase 1 and work your way through. Take your time to understand each component before moving to the next phase.
