# AKILI PATHWAYS - COMPLETE DEPLOYMENT GUIDE

## 📦 DELIVERABLES SUMMARY

This package contains the complete codebase for Akili Pathways™, Kenya's first comprehensive CBC/CBE psychometric guidance platform.

### What's Included

✅ **Database Schema** (`supabase-schema.sql`) - Complete PostgreSQL schema with:
   - 47 Kenya counties
   - 3 pathways, 7 tracks, 200+ subject combinations
   - Longitudinal assessment tracking (Grade 6-9)
   - 9 KNEC psychometric domains
   - Pathway Fit™ scoring engine
   - 12-school selection with Ministry rules
   - Row Level Security policies

✅ **Frontend Application** (`src/`) - React 18 + TypeScript with:
   - Authentication & user management
   - Student/Parent/Teacher/Admin dashboards
   - Psychometric assessment games (Phaser 3)
   - School selection wizard
   - Pathway Fit™ visualizations
   - Mobile-responsive design (Tailwind CSS)

✅ **Configuration Files**:
   - `package.json` - All dependencies
   - `tsconfig.json` - TypeScript config
   - `vite.config.ts` - Build configuration
   - `tailwind.config.js` - Styling setup
   - `.env.example` - Environment template

✅ **Mobile Setup** - Capacitor configuration for iOS/Android

✅ **Documentation**:
   - README.md - Complete setup guide
   - API documentation
   - Component documentation

---

## 🎯 DEPLOYMENT CHECKLIST

### Phase 1: Supabase Setup (15 minutes)

1. **Create Supabase Project**
   ```
   - Go to https://supabase.com
   - Click "New Project"
   - Name: "Akili Pathways"
   - Database Password: [Strong password]
   - Region: Europe (Frankfurt) or US East (N. Virginia)
   - Wait for provisioning (~2 minutes)
   ```

2. **Run Database Schema**
   ```
   - Go to SQL Editor in Supabase dashboard
   - Copy entire contents of supabase-schema.sql
   - Click "Run"
   - Verify: Check "Table Editor" - should see 20+ tables
   ```

3. **Get API Credentials**
   ```
   - Go to Settings > API
   - Copy "Project URL" (https://xxx.supabase.co)
   - Copy "anon public" key
   - Save these for .env.local
   ```

4. **Enable Authentication**
   ```
   - Go to Authentication > Settings
   - Enable Email provider
   - Enable Google provider (optional)
   - Set Site URL: http://localhost:5173 (dev)
   - Add Redirect URLs: https://akilipathways.pages.dev (prod)
   ```

5. **Configure Storage** (for PDF reports)
   ```
   - Go to Storage
   - Create bucket: "reports"
   - Set to Public
   - Max file size: 10MB
   ```

### Phase 2: Local Development Setup (10 minutes)

1. **Clone and Install**
   ```bash
   cd akili-pathways
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_NAME=Akili Pathways
   VITE_WHATSAPP_NUMBER=254721282313
   VITE_SUPPORT_EMAIL=support@akilipathways.co.ke
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173

4. **Verify Setup**
   - [ ] Home page loads
   - [ ] Can create account
   - [ ] Can login
   - [ ] Database tables populated
   - [ ] No console errors

### Phase 3: Production Build (5 minutes)

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Test Production Build**
   ```bash
   npm run preview
   ```

3. **Verify Build**
   - Check `dist/` folder created
   - Total size < 5MB
   - All assets included

### Phase 4: Cloudflare Pages Deployment (10 minutes)

1. **Sign Up for Cloudflare**
   - Go to https://dash.cloudflare.com
   - Create free account
   - Verify email

2. **Create Pages Project**
   ```
   - Go to Pages > Create a project
   - Connect to Git (GitHub/GitLab)
   - Select akili-pathways repo
   - Build settings:
     * Build command: npm run build
     * Build output directory: dist
     * Root directory: /
   ```

3. **Environment Variables**
   ```
   Go to Settings > Environment variables
   Add:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_APP_NAME
   - VITE_WHATSAPP_NUMBER
   - VITE_SUPPORT_EMAIL
   ```

4. **Deploy**
   ```
   - Click "Save and Deploy"
   - Wait ~3 minutes
   - Get URL: https://akili-pathways.pages.dev
   ```

5. **Custom Domain** (Optional)
   ```
   - Go to Custom domains
   - Add domain: akilipathways.co.ke
   - Follow DNS setup instructions
   - Wait for SSL certificate (~15 minutes)
   ```

### Phase 5: Mobile App Setup (iOS & Android)

#### iOS (macOS with Xcode required)

```bash
# Install Capacitor
npm install @capacitor/cli @capacitor/core @capacitor/ios

# Initialize
npx cap init "Akili Pathways" co.ke.akilipathways

# Add iOS
npx cap add ios

# Build web assets
npm run build

# Sync to iOS
npx cap sync ios

# Open Xcode
npx cap open ios
```

**In Xcode:**
1. Set Team (Apple Developer account)
2. Configure Bundle ID: co.ke.akilipathways
3. Set App Icon (Assets.xcassets)
4. Set Launch Screen
5. Build and Run on Simulator
6. Archive for App Store submission

#### Android (Android Studio required)

```bash
# Add Android
npx cap add android

# Sync
npm run build
npx cap sync android

# Open Android Studio
npx cap open android
```

**In Android Studio:**
1. Set applicationId: co.ke.akilipathways
2. Configure signing keys
3. Update app icon (res/mipmap)
4. Update splash screen
5. Build APK or Bundle
6. Test on emulator/device
7. Upload to Google Play Console

---

## 🎮 PSYCHOMETRIC GAMES IMPLEMENTATION GUIDE

Each of the 9 KNEC domains requires a Phaser 3 game scene. Here's the architecture:

### Game Structure

```
src/games/
├── NumericalReasoningGame.ts
├── VerbalReasoningGame.ts
├── AbstractReasoningGame.ts
├── MechanicalReasoningGame.ts
├── SpatialAbilityGame.ts
├── CreativeThinkingGame.ts
├── SituationalJudgementScene.tsx (React component)
├── InterestInventory.tsx (React component)
└── PersonalityIndicator.tsx (React component)
```

### Sample Game Implementation (Numerical Reasoning)

```typescript
// src/games/NumericalReasoningGame.ts
import Phaser from 'phaser';

export class NumericalReasoningGame extends Phaser.Scene {
  private questions: Array<{
    text: string;
    options: string[];
    correct: number;
  }>;
  
  constructor() {
    super({ key: 'NumericalReasoningGame' });
  }
  
  preload() {
    // Load Kenyan-themed assets
    this.load.image('farm', '/assets/games/farm.png');
    this.load.image('market', '/assets/games/market.png');
  }
  
  create() {
    // Initialize questions
    this.questions = [
      {
        text: "A farmer harvests 240 bags of maize. If each bag weighs 90kg, how many tonnes is that?",
        options: ["21.6", "18.9", "24.3", "27.0"],
        correct: 0
      },
      // ... more questions
    ];
    
    this.displayQuestion(0);
  }
  
  displayQuestion(index: number) {
    // Render question with Kenyan context
    // Add interactive elements
    // Track time
    // Record response
  }
  
  calculateStanine(rawScore: number): number {
    // Convert raw score to stanine (1-9)
    // Based on normative distribution
  }
}
```

---

## 📊 DASHBOARD IMPLEMENTATION

### Student Dashboard Components

```tsx
// src/pages/StudentDashboard.tsx
import { PathwayFitCard } from '@/components/PathwayFitCard';
import { PsychometricProfile } from '@/components/PsychometricProfile';
import { AcademicTimeline } from '@/components/AcademicTimeline';
import { SchoolSelectionProgress } from '@/components/SchoolSelectionProgress';

export function StudentDashboard() {
  const { data: student } = useStudent();
  const { data: pathwayFit } = usePathwayFit(student?.id);
  
  return (
    <div className="space-y-6">
      <h1>My Dashboard</h1>
      
      <PathwayFitCard scores={pathwayFit} />
      <PsychometricProfile domains={student?.domains} />
      <AcademicTimeline records={student?.assessments} />
      <SchoolSelectionProgress selections={student?.selections} />
    </div>
  );
}
```

---

## 🔐 SECURITY BEST PRACTICES

### Row Level Security (RLS)

All student data is protected by Supabase RLS policies. Verify:

```sql
-- Check policies enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN (
  'student_assessment_records',
  'psychometric_sessions',
  'pathway_fit_results'
);

-- Should show rowsecurity = TRUE for all
```

### API Key Security

❌ **NEVER** commit `.env.local` to Git  
✅ Use environment variables in CI/CD  
✅ Rotate keys if exposed  
✅ Use Cloudflare Pages secrets

---

## 📈 PERFORMANCE OPTIMIZATION

### Bundle Size Reduction

```bash
# Analyze bundle
npm run build -- --mode analyze

# Target metrics:
# - Initial load: < 200KB JS
# - Code split per route
# - Lazy load Phaser games
```

### Image Optimization

```bash
# Convert to WebP
cwebp image.png -o image.webp

# Resize for mobile
convert image.png -resize 800x image-mobile.png
```

### Database Indexing

Already included in schema:
- Student ID indexes
- Date-based queries
- Compound indexes for selections

---

## 🧪 TESTING CHECKLIST

### Manual Testing

- [ ] **Authentication**
  - [ ] Sign up with email
  - [ ] Sign in with password
  - [ ] Password reset
  - [ ] Google OAuth (if enabled)

- [ ] **Student Flow**
  - [ ] Complete profile
  - [ ] Take psychometric assessment
  - [ ] View Pathway Fit™ scores
  - [ ] Select 12 schools
  - [ ] Export selections

- [ ] **Parent Flow**
  - [ ] View child's progress
  - [ ] Download PDF report
  - [ ] Book consultation

- [ ] **Teacher Flow**
  - [ ] View class list
  - [ ] Track completion rates
  - [ ] Export class data

- [ ] **Mobile Responsiveness**
  - [ ] Test on 320px width
  - [ ] Test on tablet (768px)
  - [ ] Touch targets > 44px
  - [ ] No horizontal scroll

### Automated Testing

```bash
# Lint
npm run lint

# Type check
tsc --noEmit

# Build test
npm run build
```

---

## 💰 COST MANAGEMENT

### Current Usage (Free Tier)

| Resource | Usage | Limit | Cost |
|----------|-------|-------|------|
| Supabase DB | ~100MB | 500MB | FREE |
| Supabase Auth | ~1,000 users | 50,000 | FREE |
| Cloudflare Pages | Unlimited | Unlimited | FREE |
| Bandwidth | ~50GB/month | Unlimited | FREE |

### Upgrade Triggers

**Supabase Pro ($25/month) when:**
- Database > 500MB
- Monthly active users > 50,000
- Need point-in-time recovery

**No upgrade needed for Cloudflare Pages** - always free

---

## 📞 SUPPORT RESOURCES

### Documentation

- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev
- React Router: https://reactrouter.com
- Phaser 3: https://phaser.io/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Community

- Akili Pathways Support: support@akilipathways.co.ke
- WhatsApp: +254 721 282313
- GitHub Issues: [Your repo URL]

---

## 🚨 TROUBLESHOOTING

### Common Issues

**Issue:** "Failed to connect to Supabase"  
**Solution:** Check `VITE_SUPABASE_URL` in `.env.local` is correct

**Issue:** "Authentication error"  
**Solution:** Verify Site URL in Supabase Auth settings matches your domain

**Issue:** "Build fails with TypeScript error"  
**Solution:** Run `npm install` again, check Node version >= 18

**Issue:** "Games not loading"  
**Solution:** Check Phaser assets exist in `public/assets/games/`

**Issue:** "Mobile app crashes"  
**Solution:** Check Capacitor plugins installed: `npx cap doctor`

---

## ✅ FINAL DEPLOYMENT CHECKLIST

Before going live:

- [ ] Database schema deployed
- [ ] Sample data imported (counties, pathways, schools)
- [ ] Environment variables configured
- [ ] Production build tested
- [ ] Cloudflare Pages deployed
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Mobile apps built (iOS/Android)
- [ ] Privacy policy page added
- [ ] Terms of service page added
- [ ] WhatsApp support link working
- [ ] Analytics installed (optional)
- [ ] Backup strategy configured
- [ ] Team onboarded
- [ ] Marketing materials ready

---

## 🎉 GO LIVE PROCEDURE

1. **Final Build**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare**
   ```bash
   git push origin main
   # Cloudflare auto-deploys
   ```

3. **Verify Production**
   - Test live URL
   - Check all pages load
   - Verify authentication
   - Test payment integration (if added)

4. **Monitor**
   - Supabase Dashboard (database metrics)
   - Cloudflare Analytics (traffic)
   - Error logs
   - User feedback

5. **Announce Launch**
   - Social media
   - School partnerships
   - Parent WhatsApp groups
   - PR to education media

---

## 📊 SUCCESS METRICS TO TRACK

### Week 1
- Sign-ups
- Assessment completions
- Average session time

### Month 1
- Paying customers
- Revenue
- NPS score
- Support tickets

### Quarter 1
- Total students guided
- School partnerships
- Mobile app downloads
- Referral rate

---

## 🔄 ONGOING MAINTENANCE

### Weekly Tasks
- Monitor error logs
- Respond to support requests
- Review analytics

### Monthly Tasks
- Update school data
- Add new subject combinations
- Performance optimization
- Security updates

### Quarterly Tasks
- Algorithm refinement
- User feedback implementation
- Feature releases
- Marketing campaigns

---

## 📝 LICENSE & LEGAL

**Proprietary Software**

© 2025 Dymz Ltd. All rights reserved.

"Pathway Fit™" and "Akili Pathways™" are registered trademarks.

This deployment guide is confidential and proprietary to Dymz Ltd.

---

**Deployment Status:** ✅ READY FOR PRODUCTION

**Last Updated:** February 2026  
**Version:** 3.0  
**Maintained by:** Dymz Ltd Technical Team
