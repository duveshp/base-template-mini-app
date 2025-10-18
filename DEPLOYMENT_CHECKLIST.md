# ✅ Deployment Checklist

## Pre-Deployment
- [x] Fix peer dependency conflict
- [x] Update package.json with compatible versions
- [x] Create .npmrc for legacy peer deps
- [x] Test locally at http://localhost:3000
- [x] Modernized UI with glassmorphism
- [x] All API endpoints working (demo mode)

## Deployment Steps
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Deploy: `vercel`
- [ ] Set environment variables (see QUICK_DEPLOY.md)
- [ ] Deploy to production: `vercel --prod`
- [ ] Note your deployment URL

## Post-Deployment
- [ ] Test on Warpcast Developer Tools
- [ ] Verify login works
- [ ] Test creating a collab
- [ ] Test joining a collab
- [ ] Check profile page
- [ ] Share with community!

## Environment Variables Needed
- [ ] NEYNAR_API_KEY
- [ ] NEXT_PUBLIC_URL
- [ ] NEXT_PUBLIC_FRAME_NAME
- [ ] NEXT_PUBLIC_FRAME_DESCRIPTION
- [ ] NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY
- [ ] NEXT_PUBLIC_FRAME_TAGS
- [ ] NEXT_PUBLIC_FRAME_BUTTON_TEXT
- [ ] NEXT_PUBLIC_USE_WALLET

## Testing URLs
- Local: http://localhost:3000
- Warpcast Dev Tools: https://warpcast.com/~/developers
- Production: (add after deployment)

## Quick Commands
```bash
# Deploy
vercel

# Add env var
vercel env add VARIABLE_NAME production

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

## Support
- Full guide: `DEPLOYMENT_GUIDE.md`
- Quick start: `QUICK_DEPLOY.md`
- Issues: Check Vercel logs or local dev server
