# 🚀 Deployment Guide - EcomStore

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via GitHub

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - EcomStore Product Dashboard"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ecomstore.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"
   - Done! Your app will be live in ~2 minutes

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Deploy to Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `.next`
3. **Deploy:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

## Pre-Deployment Checklist

✅ No build errors (`npm run build` succeeds)
✅ All dependencies in package.json
✅ Environment variables configured (if any)
✅ next.config.ts properly configured
✅ Images configured for cdn.dummyjson.com
✅ CSP headers configured
✅ No console errors in production build

## Environment Variables

No environment variables required for this project as it uses public DummyJSON API.

## Post-Deployment Testing

- [ ] Homepage loads correctly
- [ ] Product search works
- [ ] Category filter works
- [ ] Date range calendar works
- [ ] Pagination functions
- [ ] Product detail pages load
- [ ] Favorites persist
- [ ] Theme toggle works
- [ ] URL parameters work
- [ ] Images load from CDN
- [ ] Responsive on mobile

## Live URL

Once deployed, your live URL will be:
- **Vercel**: `https://your-project-name.vercel.app`
- **Netlify**: `https://your-project-name.netlify.app`

## Troubleshooting

**Issue: Build fails**
- Run `npm run build` locally first
- Check for TypeScript errors
- Ensure all dependencies are installed

**Issue: Images don't load**
- Verify `next.config.ts` includes image configuration
- Check browser console for CSP errors

**Issue: API calls fail**
- Check CSP headers allow dummyjson.com
- Verify network tab in browser dev tools

## Custom Domain (Optional)

After deployment, you can add a custom domain:
- **Vercel**: Project Settings → Domains
- **Netlify**: Site Settings → Domain Management
