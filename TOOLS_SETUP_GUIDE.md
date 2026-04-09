# Tools Setup Guide - Building Maintenance System

This guide explains the 5 tools that have been set up for your project and how to use them.

## 📋 Overview

| Tool | Purpose | Location |
|------|---------|----------|
| Helmet + Rate Limit | Security | Backend |
| Swagger | API Documentation | Backend |
| GitHub Actions | CI/CD | `.github/workflows/` |
| React Hot Toast | Better UX | Frontend |
| Compression | Performance | Backend |

---

## 1. 🔒 Helmet + Rate Limiting (Security)

### What It Does
- **Helmet**: Secures your Express app by setting various HTTP headers
- **Rate Limiting**: Prevents brute force attacks by limiting requests per IP

### Configuration
Located in `Backend/server.js`:

```javascript
// Rate Limiting - allows 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);
```

### Customization
To change rate limit settings:
```javascript
// Stricter: 10 requests per 5 minutes
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
});

// Lenient: 500 requests per hour
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
});
```

### Testing
```bash
# Make 101 requests quickly to trigger rate limit
for i in {1..101}; do curl http://localhost:5000/; done
```

---

## 2. 📚 Swagger (API Documentation)

### What It Does
Generates interactive API documentation automatically from your code

### Access API Docs
- **Local**: http://localhost:5000/api-docs
- **Endpoint Info**: http://localhost:5000/api/docs

### Adding Documentation to Routes

Add JSDoc comments above your route handlers:

```javascript
/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a maintenance request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created successfully
 *       401:
 *         description: Unauthorized
 */
```

### Swagger Config File
- **Location**: `Backend/swagger-config.js`
- **Purpose**: Contains all Swagger definitions and schemas
- **Edit this to**: Add new API endpoints, update schemas, modify server URLs

### Example Usage in Swagger
1. Go to http://localhost:5000/api-docs
2. Click "Try it out" on any endpoint
3. Fill in parameters and execute
4. See the response in real-time

---

## 3. ⚙️ GitHub Actions (CI/CD)

### What It Does
Automatically runs tests, builds, and deploys your code when you push to GitHub

### Workflow Files
Two workflows have been created:

#### A. **ci.yml** - Main CI/CD Pipeline
- Tests backend (Node 16.x and 18.x)
- Tests frontend
- Builds both applications
- Runs security scans
- Deploys to dev/prod based on branch

#### B. **quality.yml** - Code Quality Checks
- Lints code
- Runs security audits
- Checks API health

### Triggering Workflows
Workflows automatically run on:
- Push to `main` or `develop` branch
- Pull requests to `main` or `develop`

### Manual Trigger
1. Go to GitHub: Actions tab
2. Select workflow
3. Click "Run workflow"

### Environment Variables Needed
Create GitHub Secrets (Settings → Secrets → Actions):

```
SNYK_TOKEN          # For Snyk security scanning
SLACK_WEBHOOK       # For Slack notifications
SONARCLOUD_TOKEN    # For SonarCloud code quality
```

### Deployment Setup
The workflows have placeholders for deployment. Update:
- `ci.yml` lines ~172 and ~190 (dev and prod deployment)
- Add deployment commands for your platform (Vercel, Heroku, AWS, etc.)

### View Workflow Results
1. GitHub repo → Actions tab
2. Select workflow run
3. View logs and artifacts

---

## 4. 🍞 React Hot Toast (Better UX)

### What It Does
Displays beautiful, non-intrusive notifications to users

### Setup
Already configured in `Frontend/src/App.js`:
```javascript
import { Toaster } from 'react-hot-toast';

// Inside App component
<Toaster position="top-right" containerClassName="mt-4" />
```

### Using Notifications
A utility file has been created: `Frontend/src/utils/toastNotifications.js`

### Import and Use
```javascript
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo 
} from '../utils/toastNotifications';

// Show success
showSuccess('Request submitted successfully!');

// Show error
showError('Failed to submit request');

// Show loading
const toastId = showLoading('Processing...');

// Update loading toast
updateToast(toastId, 'Request approved!', 'success');
```

### Available Functions

| Function | Usage | Icon |
|----------|-------|------|
| `showSuccess(msg)` | Success message | ✅ |
| `showError(msg)` | Error message | ❌ |
| `showWarning(msg)` | Warning message | ⚠️ |
| `showInfo(msg)` | Info message | ℹ️ |
| `showLoading(msg)` | Loading state | ⏳ |
| `updateToast(id, msg, type)` | Update existing toast | - |
| `dismissAll()` | Close all toasts | - |

### Example: Form Submission
```javascript
async function handleSubmit() {
  const toastId = showLoading('Submitting request...');
  
  try {
    const response = await api.post('/requests', data);
    updateToast(toastId, 'Request submitted!', 'success');
  } catch (error) {
    updateToast(toastId, error.message, 'error');
  }
}
```

### Customization
Edit `toastNotifications.js` to change:
- Default position (top-right, top-center, bottom-right, etc.)
- Duration (how long toasts appear)
- Icons/emojis

---

## 5. ⚡ Compression (Performance)

### What It Does
Compresses response bodies (gzip, deflate, brotli) to reduce bandwidth

### Configuration
Located in `Backend/server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### How It Works
1. HTTP request comes in
2. Express compresses response
3. Much smaller payload sent to client
4. Browser decompresses automatically

### Benefits
- ~70% reduction in response size
- Faster page loads
- Less bandwidth usage
- Better SEO (Google factors in page speed)

### Monitoring
Check compression in browser DevTools:
1. Network tab
2. Look for "Content-Encoding: gzip" in response headers
3. Compare "Size" vs "Transferred" columns

### Customization
```javascript
// Default: compress all responses > 1KB
app.use(compression({
  threshold: 1024  // Only compress responses larger than 1KB
}));

// Specific types
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 16.x or 18.x
npm 8.x or higher
MongoDB (for development)
GitHub account
```

### Installation
All tools are already installed! Verify:

**Backend:**
```bash
cd Backend
npm list helmet express-rate-limit compression swagger-jsdoc swagger-ui-express
```

**Frontend:**
```bash
cd Frontend
npm list react-hot-toast
```

### Starting Development

**Backend:**
```bash
cd Backend
npm start
# API docs available at http://localhost:5000/api-docs
```

**Frontend:**
```bash
cd Frontend
npm start
# App runs at http://localhost:3000
```

### Verify All Tools

1. **Helmet & Rate Limit**: Check response headers in DevTools
2. **Swagger**: Visit http://localhost:5000/api-docs
3. **Compression**: Network tab shows gzip encoding
4. **React Hot Toast**: Trigger any action that uses `showSuccess()`
5. **GitHub Actions**: Push code to GitHub, check Actions tab

---

## 📝 Best Practices

### Security
- Keep rate limit settings appropriate for your use case
- Regularly update packages (`npm audit fix`)
- Never commit secrets; use environment variables
- Use HTTPS in production only

### API Documentation
- Add JSDoc comments to new endpoints
- Keep descriptions clear and concise
- Include example requests/responses
- Update when API changes

### CI/CD
- Don't skip tests in workflows
- Fail fast on linting errors
- Review action logs regularly
- Set up proper deployment environments

### Notifications
- Don't overuse toast notifications
- Keep messages short and actionable
- Group related toasts
- Use appropriate notification types

### Performance
- Monitor compression ratios
- Test on slow networks
- Keep bundle size small
- Profile with DevTools

---

## 🔧 Troubleshooting

### Swagger Not Showing Endpoints
- Ensure JSDoc comments are correctly formatted
- Check that routes are in files scanned by swagger config
- Restart backend server after adding docs
- Verify comment syntax in Swagger UI

### Rate Limit Too Strict/Lenient
- Adjust `max` and `windowMs` in server.js
- Different limits for different endpoints
- Check `req.rateLimit` for current status

### GitHub Actions Not Running
- Verify workflows are in `.github/workflows/` folder
- Check file has `.yml` extension
- Ensure branch names match (main, develop)
- Check GitHub permissions

### Toasts Not Appearing
- Verify `<Toaster />` is in App.js within Router
- Check import path is correct
- DevTools Console for errors
- Verify react-hot-toast is installed

### Compression Not Working
- Check response headers for "Content-Encoding"
- Ensure response is large enough (> 1KB)
- Verify middleware order (should be early)
- Test with different response types

---

## 📚 Resources

- [Helmet Documentation](https://helmetjs.github.io/)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Swagger Documentation](https://swagger.io/tools/swagger-ui/)
- [React Hot Toast](https://hot-toast.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Node.js Compression](https://nodejs.org/api/zlib.html)

---

## 💡 Next Steps

1. **Customize rate limits** for your API's usage patterns
2. **Add API documentation** to all new endpoints
3. **Set up GitHub secrets** for CI/CD deployments
4. **Test all notifications** in your application
5. **Monitor performance** improvements from compression
6. **Review and merge** any GitHub Actions improvements

---

For questions or issues, refer to individual tool documentation or consult your team!
