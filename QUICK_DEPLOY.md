# 🚀 Quick Deploy to Farcaster - Collab & Fun

## ✅ **Dependency Fix Applied**
The peer dependency conflict has been fixed! Your app is now ready to deploy.

---

## **Deploy in 3 Minutes** ⏱️

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login & Deploy**
```bash
vercel login
vercel
```

Follow prompts:
- Project name: `collab-and-fun`
- Keep all other defaults

### **Step 3: Set Environment Variables**

Run these commands (copy-paste one at a time):

```bash
vercel env add NEYNAR_API_KEY production
```
**Enter:** `D569C265-283F-4CC7-9842-773FF2F0FEA3`

```bash
vercel env add NEXT_PUBLIC_FRAME_NAME production
```
**Enter:** `Collab & Fun`

```bash
vercel env add NEXT_PUBLIC_FRAME_DESCRIPTION production
```
**Enter:** `Join amazing collaborations and connect with your community!`

```bash
vercel env add NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY production
```
**Enter:** `social`

```bash
vercel env add NEXT_PUBLIC_FRAME_TAGS production
```
**Enter:** `collaboration,community,social,events`

```bash
vercel env add NEXT_PUBLIC_FRAME_BUTTON_TEXT production
```
**Enter:** `Open Collab & Fun`

```bash
vercel env add NEXT_PUBLIC_USE_WALLET production
```
**Enter:** `false`

After first deployment completes, you'll get a URL. Then run:

```bash
vercel env add NEXT_PUBLIC_URL production
```
**Enter your deployment URL:** e.g., `https://collab-and-fun.vercel.app`

### **Step 4: Deploy to Production**
```bash
vercel --prod
```

---

## **Test on Farcaster** 🎯

1. **Go to:** https://warpcast.com/~/developers
2. **Scroll to:** "Preview Mini App"
3. **Enter URL:** Your Vercel deployment URL
4. **Click:** "Preview"
5. **Wait:** ~5 seconds for first load
6. **Test:** Login → Create Collab → Join Collab ✅

---

## **That's It!** 🎉

Your Collab & Fun mini app is now live on Farcaster!

**Questions?** Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
