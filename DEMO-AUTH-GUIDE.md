# 🎭 Demo Authentication Guide

## 🎯 Quick Fix for Authentication Issues

The app now has **Demo Mode** enabled to bypass Supabase authentication issues!

---

## 🚀 How to Sign In (Demo Mode)

### Any Email/Password Works!

You can sign in with **ANY** email and password combination:

**Examples**:
- Email: `test@example.com` | Password: `123456`
- Email: `demo@demo.com` | Password: `password`
- Email: `user@test.com` | Password: `mypass123`

### Steps:
1. Click **"Sign in"** button
2. Enter **any email** (doesn't need to be real)
3. Enter **any password** (minimum 6 characters)
4. Click **"Sign in"**
5. ✅ You're logged in!

---

## ✨ Features Available in Demo Mode

- ✅ Sign in with any credentials
- ✅ Sign up with any credentials  
- ✅ Premium activation works
- ✅ Profile page works
- ✅ Favorites work (stored locally)
- ✅ All app features functional

---

## 🔧 Technical Details

**Demo Mode is enabled** via `VITE_DEMO_MODE=true` in `.env`

### What Demo Mode Does:
- Bypasses Supabase authentication
- Creates fake user sessions
- Stores data in localStorage
- Simulates all auth functions
- No real database needed

### To Disable Demo Mode:
Change `.env` file:
```
VITE_DEMO_MODE=false
```

---

## 🎭 Demo User Examples

Try these demo accounts:

1. **Regular User**:
   - Email: `user@demo.com`
   - Password: `123456`

2. **Premium User** (activate premium after login):
   - Email: `premium@demo.com` 
   - Password: `premium123`

3. **Test User**:
   - Email: `test@test.com`
   - Password: `testpass`

---

## 🚨 Production Note

For production deployment:
1. Set `VITE_DEMO_MODE=false`
2. Configure proper Supabase settings
3. Set up authentication domains
4. Test with real Supabase project

---

**Demo mode makes testing super easy! 🎉**