# Custom Authentication Guide

## Overview

ClickBazaar now uses a custom email/password authentication system. This guide covers how to use and extend the new auth system.

---

## Login Flow

### For End Users

1. Click "Sign In" button in the header
2. Enter your email and password
3. Click "Sign In" button
4. If credentials are valid:
   - User is logged in
   - Session stored in localStorage
   - Redirected to home page (or checkout if coming from checkout flow)
5. If credentials are invalid:
   - Error message displayed
   - Form remains on login page

### Test Login
```
Email: admin@clickbazaar.com
Password: test123
Role: ADMIN
```

---

## Registration Flow

### For New Users

1. Click "Sign In" button in the header
2. Click "Sign Up" link in the form
3. Enter your full name, email, and password
4. Click "Create Account" button
5. If successful:
   - Account created in database
   - User automatically logged in
   - Redirected to home page
6. If email already exists:
   - Error message displayed
   - Form remains on registration page

---

## Component Structure

### **pages/Auth.tsx** - Main Authentication Component

**State Variables:**
```typescript
const [mode, setMode] = useState<'login' | 'register'>('login');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [name, setName] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

**Key Functions:**

#### `handleLogin()`
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const user = await api.login(email, password);
    context?.setUser(user);
    
    const redirectTo = searchParams.get('redirect');
    if (redirectTo === 'checkout') {
      navigate('/checkout');
    } else {
      navigate('/');
    }
  } catch (err: any) {
    setError(err.message || 'Login failed. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};
```

#### `handleRegister()`
```typescript
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const user = await api.register(name, email, password);
    context?.setUser(user);
    navigate('/');
  } catch (err: any) {
    setError(err.message || 'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

**Features:**
- Beautiful animated background with gradient blobs
- Responsive design (mobile, tablet, desktop)
- Password show/hide toggle
- Login/Register mode switching
- Error message display
- Loading state during submission
- Redirect support via URL parameters

---

## API Integration

### **services/api.ts** - Authentication Methods

#### `api.login(email, password)`
**Purpose:** Authenticate user with email and password

**Request:**
```typescript
const user = await api.login('user@example.com', 'password123');
```

**Response:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}
```

**Error:** Throws error if credentials invalid or user not found

---

#### `api.register(name, email, password)`
**Purpose:** Create new user account

**Request:**
```typescript
const user = await api.register('John Doe', 'john@example.com', 'password123');
```

**Response:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER';
}
```

**Error:** Throws error if email already exists or validation fails

---

#### `api.logout()`
**Purpose:** End user session

**Request:**
```typescript
await api.logout();
```

**Effect:** Clears localStorage tokens

---

#### `api.getCurrentUser()`
**Purpose:** Get current logged-in user from session

**Request:**
```typescript
const user = api.getCurrentUser();
```

**Response:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
} | null
```

---

## Database Schema

### **User Table** (in db.ts)

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;  // Plain text in demo (hash in production!)
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
}
```

**Example:**
```typescript
{
  id: '1',
  name: 'Admin User',
  email: 'admin@clickbazaar.com',
  password: 'test123',
  role: 'ADMIN',
  createdAt: '2024-01-01T00:00:00Z'
}
```

---

## Session Management

### **localStorage Keys**

```typescript
// User session token
localStorage.getItem('clickbazaar_user');

// Cart items
localStorage.getItem('clickbazaar_cart');

// Wishlist items
localStorage.getItem('clickbazaar_wishlist');
```

### **AppContext**

Located in `shared.tsx`:

```typescript
const [user, setUser] = useState<User | null>(null);
```

**Access in Components:**
```typescript
const context = useContext(AppContext);
const currentUser = context?.user;
```

---

## Protected Routes

### **Admin Routes**

To add admin protection to routes:

```typescript
// In App.tsx or route guards
if (!user || user.role !== 'ADMIN') {
  return <Navigate to="/auth" />;
}
```

### **Protected Page Example**

```typescript
const AdminPage: React.FC = () => {
  const context = useContext(AppContext);
  
  if (!context?.user) {
    return <Navigate to="/auth" />;
  }
  
  if (context.user.role !== 'ADMIN') {
    return <h1>Access Denied</h1>;
  }
  
  return <div>Admin Content</div>;
};
```

---

## Redirect Parameters

### **Checkout Redirect**

To redirect user to checkout after login:

```typescript
// Navigate to auth with redirect parameter
navigate('/auth?redirect=checkout');
```

**In Auth Component:**
The form automatically checks for `redirect` parameter and redirects after successful login.

### **Checkout Page Redirect Example**

```typescript
if (!user) {
  navigate('/auth?redirect=checkout');
  return null;
}
```

---

## Error Handling

### **Login Errors**

**Possible Errors:**
- User not found
- Invalid password
- Invalid email format
- Server error

**Error Messages:**
```typescript
try {
  const user = await api.login(email, password);
} catch (err: any) {
  console.error(err.message); // "Invalid credentials"
}
```

### **Registration Errors**

**Possible Errors:**
- Email already exists
- Invalid email format
- Password too short
- Name required
- Server error

**Error Messages:**
```typescript
try {
  const user = await api.register(name, email, password);
} catch (err: any) {
  console.error(err.message); // "Email already registered"
}
```

---

## Logout Flow

```typescript
// In App.tsx or any component
const logout = useCallback(async () => {
  await api.logout();
  setUser(null);
  setCart([]);
  setWishlist([]);
  localStorage.removeItem('clickbazaar_cart');
  localStorage.removeItem('clickbazaar_wishlist');
}, []);
```

**Effect:**
- Clears user from state
- Clears cart and wishlist
- Removes localStorage tokens
- User redirected to home page

---

## Password Requirements

Currently, no specific password requirements are enforced. For production, add:

```typescript
const validatePassword = (password: string): boolean => {
  // At least 8 characters
  // At least one uppercase letter
  // At least one lowercase letter
  // At least one number
  // At least one special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};
```

---

## Email Validation

Current validation uses basic HTML5 validation. For production, implement:

```typescript
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

---

## Production Considerations

### **Security Improvements Needed**

1. **Password Hashing**
   ```typescript
   import bcrypt from 'bcryptjs';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Secure Sessions**
   - Use HTTP-only cookies instead of localStorage
   - Implement session tokens with expiration
   - Add CSRF protection

3. **Rate Limiting**
   - Limit login attempts per IP
   - Implement exponential backoff

4. **Two-Factor Authentication**
   - Optional 2FA for enhanced security
   - Email or SMS verification

5. **Password Reset**
   - Email-based password recovery
   - Secure token-based reset links

---

## Testing

### **Test Login**
```
Email: admin@clickbazaar.com
Password: test123
```

### **Test Registration**
1. Create new email: `testuser@example.com`
2. Set password: `Test123!`
3. Full name: `Test User`

### **Test Redirect to Checkout**
1. Go to `/cart`
2. Click checkout without logging in
3. Should redirect to `/auth?redirect=checkout`
4. After successful login, should redirect to `/checkout`

---

## Troubleshooting

### **Login Not Working**

**Check:**
1. Email matches exactly (case-sensitive)
2. Password is correct
3. Browser console for errors
4. localStorage has 'clickbazaar_user' key

**Solution:**
- Clear browser cache and localStorage
- Check database in `db.ts` for correct user

### **Redirect Not Working**

**Check:**
1. URL parameter is `?redirect=checkout`
2. AppContext is properly set up
3. useNavigate hook is working

**Solution:**
- Verify navigate is called with correct path
- Check URL parameters are parsed correctly

### **Form Not Submitting**

**Check:**
1. All required fields are filled
2. Email has valid format
3. JavaScript is enabled
4. No console errors

**Solution:**
- Check browser console for specific error
- Verify form onSubmit handler is attached

---

## Further Development

### **Add Social Login**
```typescript
// Google OAuth integration
// GitHub OAuth integration
// Facebook OAuth integration
```

### **Add Two-Factor Authentication**
```typescript
// Email-based 2FA
// SMS-based 2FA
// TOTP-based 2FA
```

### **Add Password Reset**
```typescript
// Email-based password reset
// Secure reset tokens
// Token expiration
```

---

**For more information, see the main README.md or START_HERE.md**
