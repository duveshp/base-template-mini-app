# 🚀 Collab & Fun - Farcaster Mini App Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Your Neynar API key: `D569C265-283F-4CC7-9842-773FF2F0FEA3`

---

## 📋 Step 1: Prepare Environment Variables

You need to set up the following environment variables in production:

### Required Variables:

```env
# Neynar Configuration
NEYNAR_API_KEY=D569C265-283F-4CC7-9842-773FF2F0FEA3

# App URLs (will be updated after deployment)
NEXT_PUBLIC_URL=https://your-app.vercel.app

# Frame Configuration
NEXT_PUBLIC_FRAME_NAME=Collab & Fun
NEXT_PUBLIC_FRAME_DESCRIPTION=Join amazing collaborations and connect with your community!
NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY=social
NEXT_PUBLIC_FRAME_TAGS=collaboration,community,social,events
NEXT_PUBLIC_FRAME_BUTTON_TEXT=Open Collab & Fun
NEXT_PUBLIC_USE_WALLET=false
```

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **collab-and-fun** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **N**

5. **Set Environment Variables**:
```bash
vercel env add NEYNAR_API_KEY
# Paste: D569C265-283F-4CC7-9842-773FF2F0FEA3

vercel env add NEXT_PUBLIC_FRAME_NAME
# Enter: Collab & Fun

vercel env add NEXT_PUBLIC_FRAME_DESCRIPTION
# Enter: Join amazing collaborations and connect with your community!

vercel env add NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY
# Enter: social

vercel env add NEXT_PUBLIC_FRAME_TAGS
# Enter: collaboration,community,social,events

vercel env add NEXT_PUBLIC_FRAME_BUTTON_TEXT
# Enter: Open Collab & Fun

vercel env add NEXT_PUBLIC_USE_WALLET
# Enter: false
```

6. **Deploy to Production**:
```bash
vercel --prod
```

7. **Update NEXT_PUBLIC_URL**:
   - Copy your deployment URL (e.g., `https://collab-and-fun.vercel.app`)
   - Add it as an environment variable:
```bash
vercel env add NEXT_PUBLIC_URL
# Paste your deployment URL
```

8. **Redeploy with updated URL**:
```bash
vercel --prod
```

### Option B: Deploy via Vercel Dashboard

1. **Push code to GitHub**:
```bash
git add .
git commit -m "Ready for Farcaster deployment"
git push origin main
```

2. **Go to [Vercel Dashboard](https://vercel.com/new)**

3. **Import your GitHub repository**

4. **Configure Environment Variables**:
   - Click on "Environment Variables"
   - Add all the variables listed in Step 1
   - **Important**: Leave `NEXT_PUBLIC_URL` empty for now

5. **Deploy**

6. **After deployment**:
   - Copy your deployment URL
   - Go to Project Settings → Environment Variables
   - Add/Update `NEXT_PUBLIC_URL` with your deployment URL
   - Redeploy from the Deployments tab

---

## 🎨 Step 3: Add App Icons and Images

Create these files in your `public/` directory:

1. **icon.png** (256x256 px) - App icon
2. **splash.png** (1200x630 px) - Splash screen
3. **og-image.png** (1200x630 px) - Open Graph image

Quick tip: Use Canva or Figma to create these with your app branding (purple/pink gradients, 🎉 emoji).

---

## 🔧 Step 4: Configure Farcaster Frame

The app is already configured as a Farcaster Frame. The metadata is set in:
- `src/app/page.tsx` - Frame embed metadata
- `src/lib/utils.ts` - Frame configuration helper

No additional changes needed! ✅

---

## 📱 Step 5: Test on Farcaster Warpcast

### Method 1: Using Warpcast Developer Tools

1. **Open Warpcast Developer Tools**:
   - Go to: https://warpcast.com/~/developers
   - Scroll to "Preview Mini App" section

2. **Enter your deployment URL**:
   - Paste: `https://your-app.vercel.app`
   - Click "Preview"
   - Wait ~5 seconds for initial load

3. **Test the app**:
   - Login with demo profile
   - Create a collab
   - Join collabs
   - View profile

### Method 2: Share as a Cast

1. **Create a Cast on Warpcast**:
   - Click "New Cast"
   - Type: "Check out Collab & Fun! 🎉"
   - Add your deployment URL
   - Post the cast

2. **The Frame will automatically appear** in the cast preview

3. **Click to open** the mini app

---

## ✅ Step 6: Verify Everything Works

Test the complete flow:

- [ ] App loads on Farcaster
- [ ] Login works (demo mode)
- [ ] Dashboard shows collabs
- [ ] Can create new collabs
- [ ] Can view collab details
- [ ] Can join collabs
- [ ] Profile page works
- [ ] Stats are displayed correctly

---

## 🔄 Step 7: Enable Real Farcaster Authentication (Optional)

To use real Farcaster authentication instead of demo mode:

1. **Update environment variables**:
```bash
NEXT_PUBLIC_USE_WALLET=true
```

2. **Update API endpoints**:
   - Change `/api/collabs/create-demo` → `/api/collabs` in `AppContext.tsx`
   - Change `/api/collabs/join-demo` → `/api/collabs/join`
   - Change `/api/collabs/update-proof-demo` → `/api/collabs/update-proof`
   - Change demo user endpoints to real ones

3. **Update auth handling**:
   - The app will use Farcaster authentication via `@farcaster/frame-sdk`
   - Users will connect with their Farcaster account

---

## 🎯 Quick Deploy Command Summary

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables (do this for each variable)
vercel env add NEYNAR_API_KEY
vercel env add NEXT_PUBLIC_FRAME_NAME
vercel env add NEXT_PUBLIC_FRAME_DESCRIPTION
vercel env add NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY
vercel env add NEXT_PUBLIC_FRAME_TAGS
vercel env add NEXT_PUBLIC_FRAME_BUTTON_TEXT
vercel env add NEXT_PUBLIC_USE_WALLET

# Deploy to production
vercel --prod

# After getting deployment URL, update NEXT_PUBLIC_URL
vercel env add NEXT_PUBLIC_URL

# Redeploy with updated URL
vercel --prod
```

---

## 🐛 Troubleshooting

### App doesn't load on Farcaster
- Check `NEXT_PUBLIC_URL` is set correctly
- Verify all environment variables are set
- Check Vercel deployment logs for errors

### Database errors
- The SQLite database will be created automatically on first run
- Run `npm run seed` locally, then deploy

### Authentication issues
- Make sure `NEYNAR_API_KEY` is correct
- In demo mode, users don't need real Farcaster auth

### 401 errors when creating collabs
- Ensure you're using the demo endpoints
- Check that `createCollab` uses `/api/collabs/create-demo`

---

## 📚 Resources

- [Farcaster Frames Documentation](https://docs.farcaster.xyz/learn/what-is-farcaster/frames)
- [Neynar Documentation](https://docs.neynar.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Warpcast Developer Tools](https://warpcast.com/~/developers)

---

## 🎉 You're Done!

Your Collab & Fun mini app is now live on Farcaster! Share it with your community and start collaborating! 🚀

Deployment URL: `https://your-app.vercel.app`
