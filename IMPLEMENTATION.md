# AKILI PATHWAYS - COMPLETE IMPLEMENTATION GUIDE

## 🎯 PROJECT STATUS

This package provides the **complete foundation** for Akili Pathways. Here's what's included and what needs to be built:

---

## ✅ COMPLETED (INCLUDED IN THIS PACKAGE)

### 1. Database Architecture (100% Complete)

**File:** `supabase-schema.sql` (23,000+ lines)

Includes:
- ✅ 47 Kenya counties with regions and headquarters
- ✅ 3 pathways (STEM, Social Sciences, Arts & Sports)
- ✅ 7 tracks within pathways
- ✅ Subject combinations with ST-codes
- ✅ School database structure (9,606 schools capacity)
- ✅ Longitudinal assessment tracking (KPSEA, SBA, KJSEA)
- ✅ 9 KNEC psychometric domains with weights
- ✅ Psychometric questions, sessions, and responses tables
- ✅ Pathway Fit™ results and scoring
- ✅ School selection (3 combinations × 4 schools = 12 total)
- ✅ Row Level Security policies for all tables
- ✅ Performance indexes
- ✅ User profiles (Student/Parent/Teacher/Admin)

**Deployment:** Copy-paste into Supabase SQL Editor and run

### 2. Project Configuration (100% Complete)

**Files Included:**
- ✅ `package.json` - All dependencies (React, TypeScript, Phaser, Supabase, etc.)
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `vite.config.ts` - Build configuration with path aliases
- ✅ `tailwind.config.js` - Tailwind CSS with brand colors (#2C5AA0, #0D9276, #D97706)
- ✅ `.env.example` - Environment variable template
- ✅ `README.md` - Complete setup guide
- ✅ `DEPLOYMENT.md` - Step-by-step deployment instructions

### 3. Core Infrastructure

**Files Included:**
- ✅ `src/lib/supabase.ts` - Supabase client configuration
- ✅ `src/main.tsx` - App entry point
- ✅ Project structure created (`components/`, `pages/`, `lib/`, `hooks/`, `types/`)

---

## 🚧 TO BE IMPLEMENTED (DEVELOPER TASKS)

Based on the complete specification, here are the remaining components to build:

### PHASE 1: UI Components (shadcn/ui) - ~2 weeks

Create these reusable components in `src/components/ui/`:

1. **Button Component** (`button.tsx`)
   - Primary, secondary, ghost variants
   - Loading state
   - Icon support

2. **Card Component** (`card.tsx`)
   - Header, content, footer sections
   - Hover effects
   - Clickable variant

3. **Input Components** (`input.tsx`, `select.tsx`, `checkbox.tsx`)
   - Form controls with validation
   - Error states
   - Disabled states

4. **Dialog/Modal** (`dialog.tsx`)
   - Confirmation dialogs
   - Info modals
   - Full-screen overlays

5. **Progress Indicators** (`progress.tsx`, `spinner.tsx`)
   - Linear progress bar
   - Circular progress (for pathway scores)
   - Loading spinners

6. **Toast Notifications** (`toast.tsx`)
   - Success/error/info/warning
   - Auto-dismiss
   - Action buttons

7. **Tabs Component** (`tabs.tsx`)
   - For switching between dashboard views
   - Active state styling

8. **Badge Component** (`badge.tsx`)
   - Status badges (stanine levels)
   - Category labels (cluster badges)

**Tech Stack:**
- Radix UI primitives (already in package.json)
- Tailwind CSS for styling
- Class Variance Authority for variants

**Example Structure:**
```tsx
// src/components/ui/button.tsx
import { cva, VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'rounded-lg font-semibold transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-[#2C5AA0] text-white hover:bg-[#234780]',
        secondary: 'bg-[#0D9276] text-white hover:bg-[#0A7460]',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
      },
    },
  }
);

export function Button({ variant, size, children, ...props }: Props) {
  return (
    <button className={buttonVariants({ variant, size })} {...props}>
      {children}
    </button>
  );
}
```

---

### PHASE 2: Authentication & User Management - ~1 week

**Files to Create:**

1. **Auth Components**
   - `src/components/auth/LoginForm.tsx`
   - `src/components/auth/SignupForm.tsx`
   - `src/components/auth/ResetPasswordForm.tsx`
   - `src/components/auth/ProfileSetup.tsx`

2. **Auth Pages**
   - `src/pages/Login.tsx`
   - `src/pages/Signup.tsx`
   - `src/pages/ResetPassword.tsx`
   - `src/pages/CompleteProfile.tsx`

3. **Auth Context/Store**
   - `src/lib/auth.ts` - Zustand store for auth state
   - `src/hooks/useAuth.ts` - Custom hook for authentication

**Features:**
- Email/password authentication
- Magic link login
- Google OAuth (optional)
- Password reset flow
- Profile completion wizard (grade, school, county)
- Parent-child linking

**Integration:**
```tsx
// src/lib/auth.ts
import { create } from 'zustand';
import { supabase } from './supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    const { data } = await supabase.auth.signInWithPassword({ email, password });
    set({ user: data.user });
  },
  // ... other methods
}));
```

---

### PHASE 3: Psychometric Assessment Games (Phaser 3) - ~8 weeks

This is the **core feature**. Create 9 games in `src/games/`:

#### Game 1: Numerical Reasoning (Week 1-2)

**File:** `src/games/NumericalReasoningGame.ts`

**Features:**
- Pattern completion (number sequences)
- Mathematical word problems with Kenyan context:
  - Farming: "A farmer harvests X bags at Y kg each..."
  - Market: "Tomatoes cost KES 50/kg, onions KES 80/kg..."
  - Transport: "Matatu fare from Nairobi to Kisumu..."
- Data interpretation (bar charts, tables)
- Timed questions (30 seconds each)
- Visual feedback on correct/incorrect
- Running score tracker

**Assets Needed:**
- Kenyan farm imagery
- Market stall graphics
- Number tiles/cards
- Progress bar sprites

#### Game 2: Verbal Reasoning (Week 3-4)

**File:** `src/games/VerbalReasoningGame.ts`

**Features:**
- Reading comprehension with Kenyan passages:
  - Wildlife conservation
  - School life scenarios
  - Historical events (independence, etc.)
- Word analogies (English & Kiswahili)
- Logical deduction puzzles
- Vocabulary in context
- 45 seconds per question

**Assets Needed:**
- Text rendering with word wrap
- Highlight selections
- Dictionary icon for hints

#### Game 3: Abstract Reasoning (Week 5-6)

**File:** `src/games/AbstractReasoningGame.ts`

**Features:**
- Matrix pattern completion (Raven's style)
- Figure classification (odd one out)
- Shape analogies
- Non-verbal sequences
- Mental rotation
- 35 seconds per question

**Assets Needed:**
- Geometric shapes (circle, square, triangle, hexagon)
- Pattern grid system (3×3, 4×4)
- Rotation animations
- Color palette (limited for clarity)

#### Game 4: Mechanical Reasoning (Week 7-8)

**File:** `src/games/MechanicalReasoningGame.ts`

**Features:**
- Pulley systems (Kenyan context: water pumps, construction)
- Gear rotations
- Lever principles (see-saw, wheelbarrow)
- Tool identification (agricultural, technical)
- Physical causality (what happens if...)
- 40 seconds per question

**Assets Needed:**
- Pulley sprites with rope
- Gear animations
- Tool icons (hoe, hammer, wrench)
- Physics-based interactions

#### Game 5: Spatial Ability (Week 9-10)

**File:** `src/games/SpatialAbilityGame.ts`

**Features:**
- 3D cube folding/unfolding
- Map navigation (Kenya county map)
- Mental rotation of objects
- Assembly instructions
- Perspective taking
- 50 seconds per question

**Assets Needed:**
- Cube net templates
- Kenya map (interactive)
- 3D object sprites (multiple angles)
- Directional arrows

#### Game 6: Creative Thinking (Week 11-12)

**File:** `src/games/CreativeThinkingGame.ts`

**Features:**
- Alternative uses task ("How many uses for a matatu tire?")
- Picture completion
- Story generation from prompts
- Product improvement ideas
- Divergent thinking scoring
- 60 seconds per question

**Assets Needed:**
- Object images (tire, bucket, rope)
- Story prompt cards
- Drawing canvas (if implemented)
- Creativity meter

#### Non-Game Assessments (React Components)

**Game 7-9:** These don't require Phaser, just React forms

7. **Situational Judgement** (`src/components/assessment/SituationalJudgement.tsx`)
   - Scenario-based questions (school conflicts, peer pressure)
   - Multiple choice decisions
   - Ethics and empathy focus

8. **Interest Inventory** (`src/components/assessment/InterestInventory.tsx`)
   - Drag-drop activity cards into "Like/Dislike"
   - Career matching game
   - Subject enjoyment rating (1-5 stars)

9. **Personality Indicators** (`src/components/assessment/PersonalityIndicator.tsx`)
   - Learning style assessment (visual/auditory/kinesthetic)
   - Collaboration preference (group vs individual)
   - Resilience scenarios
   - Likert scale questionnaires

**Scoring Engine** (`src/lib/scoring.ts`)
```typescript
export function calculateStanine(rawScore: number, mean: number, stdev: number): number {
  const zScore = (rawScore - mean) / stdev;
  
  // Convert z-score to stanine (1-9)
  if (zScore < -1.75) return 1;
  if (zScore < -1.25) return 2;
  if (zScore < -0.75) return 3;
  if (zScore < -0.25) return 4;
  if (zScore < 0.25) return 5;
  if (zScore < 0.75) return 6;
  if (zScore < 1.25) return 7;
  if (zScore < 1.75) return 8;
  return 9;
}

export function calculatePathwayFit(domainScores: DomainScores): PathwayScores {
  // Implement Pathway Fit™ formula
  const stemScore = (
    domainScores.numerical * 0.35 +
    domainScores.mechanical * 0.20 +
    domainScores.abstract * 0.20 +
    domainScores.spatial * 0.10 +
    // ... other weights
  );
  
  return { stem: stemScore, socialSciences: soscScore, artsSports: artsScore };
}
```

---

### PHASE 4: Student Dashboard - ~2 weeks

**Files to Create:**

1. `src/pages/StudentDashboard.tsx` - Main layout
2. `src/components/dashboard/PathwayFitCard.tsx` - Radar chart of 3 pathway scores
3. `src/components/dashboard/PsychometricProfile.tsx` - 9 domain stanines
4. `src/components/dashboard/AcademicTimeline.tsx` - KPSEA → SBA → KJSEA progression
5. `src/components/dashboard/SchoolSelectionProgress.tsx` - 12/12 tracker
6. `src/components/dashboard/RecommendedActions.tsx` - Next steps

**Visualizations:**
- **Pathway Scores:** Recharts radar chart
- **Domain Stanines:** Horizontal bar chart (1-9 scale)
- **Academic Timeline:** Line chart with milestones
- **Selection Progress:** Circular progress (X/12 schools)

**Example:**
```tsx
// src/components/dashboard/PathwayFitCard.tsx
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

export function PathwayFitCard({ scores }: Props) {
  const data = [
    { pathway: 'STEM', score: scores.stem },
    { pathway: 'Social Sciences', score: scores.socialSciences },
    { pathway: 'Arts & Sports', score: scores.artsSports },
  ];
  
  return (
    <Card>
      <CardHeader>
        <h2>Your Pathway Fit™ Scores</h2>
      </CardHeader>
      <CardContent>
        <RadarChart data={data} width={400} height={300}>
          <PolarGrid />
          <PolarAngleAxis dataKey="pathway" />
          <Radar dataKey="score" fill="#2C5AA0" fillOpacity={0.6} />
        </RadarChart>
      </CardContent>
    </Card>
  );
}
```

---

### PHASE 5: School Selection Wizard - ~3 weeks

**Files to Create:**

1. `src/pages/SelectionWizard.tsx` - Multi-step wizard
2. `src/components/selection/PathwaySelector.tsx` - Step 1
3. `src/components/selection/TrackSelector.tsx` - Step 2
4. `src/components/selection/CombinationSelector.tsx` - Step 3 (3 rounds)
5. `src/components/selection/SchoolSelector.tsx` - Step 4 (4 schools per combo)
6. `src/components/selection/ReviewSelections.tsx` - Step 5
7. `src/components/selection/SchoolCard.tsx` - Individual school display
8. `src/components/selection/ValidationEngine.tsx` - Rule enforcement

**Validation Rules (Must Implement):**
```typescript
// src/lib/validation.ts
export function validateSchoolSelections(selections: Selection[]): ValidationResult {
  const errors: string[] = [];
  
  // Rule 1: Exactly 12 schools
  if (selections.length !== 12) {
    errors.push('Must select exactly 12 schools');
  }
  
  // Rule 2: No duplicates
  const schoolIds = selections.map(s => s.schoolId);
  const unique = new Set(schoolIds);
  if (unique.size !== schoolIds.length) {
    errors.push('Cannot select the same school twice');
  }
  
  // Rule 3: 9 boarding + 3 day
  const boardingCount = selections.filter(s => 
    s.selectionType.includes('BOARDING')
  ).length;
  if (boardingCount !== 9) {
    errors.push('Must select exactly 9 boarding schools');
  }
  
  // Rule 4: Cluster distribution per combination
  const combinations = groupBy(selections, 'combinationId');
  for (const [combId, schools] of Object.entries(combinations)) {
    const clusters = schools.map(s => s.clusterPosition);
    if (!includes(clusters, 1, 2, 3, 4)) {
      errors.push(`Combination ${combId} missing required cluster`);
    }
  }
  
  // Rule 5: County compliance
  // ... implement 3 home county + 6 outside county rule
  
  return { valid: errors.length === 0, errors };
}
```

**KEMIS Export** (`src/lib/export.ts`)
```typescript
export function exportToKEMIS(selections: Selection[]): string {
  // Generate CSV in Ministry format
  const headers = ['Student Name', 'Assessment Number', 'UIC', 'School Code 1', 'School Code 2', ...];
  const rows = selections.map(s => [
    s.studentName,
    s.assessmentNumber,
    s.uic,
    s.schools.map(school => school.knecCode).join(',')
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
```

---

### PHASE 6: Parent Dashboard - ~1 week

**Files to Create:**

1. `src/pages/ParentDashboard.tsx`
2. `src/components/parent/ChildSelector.tsx` (if multiple children)
3. `src/components/parent/LongitudinalComparison.tsx`
4. `src/components/parent/ReportDownload.tsx`
5. `src/components/parent/ConsultationBooking.tsx`

**Features:**
- Switch between multiple children
- View child's Pathway Fit™ scores
- Download PDF reports
- Schedule video consultations
- View payment history

---

### PHASE 7: Teacher & Admin Dashboards - ~1 week

**Teacher Dashboard:**
1. `src/pages/TeacherDashboard.tsx`
2. `src/components/teacher/ClassOverview.tsx`
3. `src/components/teacher/PathwayDistribution.tsx`
4. `src/components/teacher/AtRiskStudents.tsx`
5. `src/components/teacher/ExportClassData.tsx`

**Admin Dashboard:**
1. `src/pages/AdminDashboard.tsx`
2. `src/components/admin/SchoolManagement.tsx`
3. `src/components/admin/UserManagement.tsx`
4. `src/components/admin/Analytics.tsx`
5. `src/components/admin/SystemConfig.tsx`

---

### PHASE 8: Mobile Optimization - ~1 week

**Responsive Design Tasks:**
1. Test all pages at 320px, 375px, 768px, 1024px, 1440px
2. Implement touch-friendly controls (min 44px × 44px)
3. Optimize images for mobile (WebP, lazy loading)
4. Add swipe gestures for carousels
5. Test on actual iOS and Android devices

**Capacitor Integration:**
```bash
# After building web app
npm run build
npx cap sync

# Test on emulators
npx cap open ios
npx cap open android
```

---

### PHASE 9: Payment Integration - ~1 week

**Options:**
1. **M-PESA PayBill/Till Number** (Recommended for Kenya)
   - User pays to Till Number
   - Upload receipt
   - Admin verifies and activates

2. **Stripe** (International cards)
   - Requires business verification
   - 3.5% + KES 50 per transaction

3. **Flutterwave** (African focus)
   - M-PESA, card, bank transfer
   - 3.8% per transaction

**Implementation:**
```tsx
// src/components/payment/MpesaPayment.tsx
export function MpesaPayment() {
  return (
    <div>
      <h3>Pay via M-PESA</h3>
      <p>Till Number: <strong>5123456</strong></p>
      <p>Amount: <strong>KES 2,999</strong></p>
      <FileUpload label="Upload M-PESA receipt" />
      <Button onClick={submitReceipt}>Submit for Verification</Button>
    </div>
  );
}
```

---

## 📊 DATA POPULATION

### Seed Data Required

1. **Sample Psychometric Questions** (Minimum 50)
   - 5-10 per domain
   - Culturally adapted to Kenya
   - Balanced difficulty levels

2. **Subject Combinations** (Complete 200+)
   - All ST-codes from Ministry document
   - Career cluster mapping
   - Difficulty ratings

3. **Schools Database** (Minimum 100, target 9,606)
   - Name, county, sub-county
   - Cluster, category, accommodation
   - Contact information
   - Subject combinations offered

4. **Sample Students** (For testing)
   - Complete profiles
   - Assessment records
   - Pathway Fit scores
   - School selections

**Bulk Import Script:**
```typescript
// scripts/seed-schools.ts
import { createClient } from '@supabase/supabase-js';
import schools from './data/schools.json';

const supabase = createClient(url, key);

async function seedSchools() {
  const { data, error } = await supabase
    .from('schools')
    .insert(schools);
  
  console.log(`Imported ${data.length} schools`);
}
```

---

## 🎨 DESIGN ASSETS NEEDED

### UI Components
- Logo (SVG, multiple sizes)
- App icon (1024×1024)
- Splash screen (2048×2732)

### Game Assets
- Number tiles (0-9)
- Shape sprites (circle, square, triangle, etc.)
- Kenyan imagery (farm, market, school)
- Tool icons (hoe, hammer, wrench, etc.)
- Map of Kenya (interactive SVG)
- Progress indicators
- Sound effects (correct, incorrect, complete)

### Icons
- Pathway icons (STEM, SOSC, ARTS)
- Domain icons (9 psychometric domains)
- School type icons (boarding, day, mixed)
- Cluster badges (C1, C2, C3, C4)

**Design Tool:** Figma (free tier)  
**Stock Photos:** Unsplash, Pexels (free)  
**Icons:** Lucide React (already included)

---

## ⚡ PERFORMANCE TARGETS

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| Initial Load | < 2s | Code splitting, lazy loading |
| Game Load | < 1s | Preload assets, optimize sprites |
| Database Query | < 500ms | Proper indexing, RLS optimization |
| Mobile FPS | 60fps | Phaser canvas optimization |
| Lighthouse Score | 90+ | Follow web vitals best practices |

---

## 🧪 QUALITY ASSURANCE

### Testing Checklist

**Unit Tests:**
- [ ] Pathway Fit™ algorithm
- [ ] Stanine calculation
- [ ] Selection validation rules
- [ ] Scoring engine

**Integration Tests:**
- [ ] Authentication flow
- [ ] Payment processing
- [ ] School selection wizard
- [ ] Report generation

**User Acceptance Testing:**
- [ ] 10 students complete full flow
- [ ] 5 parents review dashboards
- [ ] 2 teachers test class management
- [ ] 1 admin tests bulk operations

---

## 📱 MARKETING MATERIALS TO CREATE

1. **Landing Page** (`src/pages/Home.tsx`)
   - Hero section
   - 3-step process
   - Testimonials
   - Pricing tiers
   - FAQ
   - WhatsApp contact button

2. **Pricing Page** (`src/pages/Pricing.tsx`)
   - Basic (KES 2,999)
   - Premium (KES 5,499)
   - Comprehensive (KES 7,999)
   - Sibling discount (-20%)

3. **How It Works** (`src/pages/HowItWorks.tsx`)
   - Video explainer
   - Step-by-step guide
   - Screenshots

4. **About Us** (`src/pages/About.tsx`)
   - Company story
   - Team profiles
   - Mission/vision

5. **Legal Pages**
   - Privacy Policy
   - Terms of Service
   - Refund Policy

---

## 🚀 LAUNCH STRATEGY

### Pre-Launch (2 weeks before)
- [ ] Beta test with 50 students
- [ ] Train 5 pilot teachers
- [ ] Prepare press release
- [ ] Set up social media accounts

### Launch Week
- [ ] Go live on production
- [ ] Post to Facebook/Instagram
- [ ] WhatsApp broadcast to PTA groups
- [ ] Email to school principals

### Post-Launch (4 weeks after)
- [ ] Monitor error logs daily
- [ ] Respond to support within 24hrs
- [ ] Collect user feedback
- [ ] Iterate on top issues

---

## 💰 REVENUE MILESTONES

| Milestone | Target | Timeline |
|-----------|--------|----------|
| First paying customer | 1 | Week 1 |
| KES 1M revenue | 350 customers | Month 3 |
| Break-even | KES 2.5M | Month 6 |
| Profitability | KES 5M/month | Year 1 |

---

## ✅ DEFINITION OF DONE

The project is complete when:

1. ✅ All 9 psychometric games functional
2. ✅ Pathway Fit™ algorithm validated
3. ✅ School selection wizard enforces all rules
4. ✅ All 4 dashboards (Student/Parent/Teacher/Admin) operational
5. ✅ Mobile apps deployed (iOS App Store, Google Play)
6. ✅ Supabase database populated with real school data
7. ✅ Payment system active
8. ✅ Support infrastructure in place
9. ✅ 100+ beta users tested successfully
10. ✅ Marketing site live

---

## 🤝 TEAM ROLES

### Required Skills

| Role | Skills Needed | Time Commitment |
|------|---------------|-----------------|
| **Full-Stack Developer** | React, TypeScript, Supabase | Full-time (3 months) |
| **Game Developer** | Phaser 3, JavaScript | Full-time (2 months) |
| **UI/UX Designer** | Figma, Mobile design | Part-time (1 month) |
| **Psychometrician** | Psychometric validation | Consultant (ongoing) |
| **Content Creator** | Kenyan curriculum, question writing | Part-time (2 months) |
| **QA Tester** | Manual testing, mobile | Part-time (1 month) |

---

## 📞 GETTING HELP

**Technical Questions:**
- Supabase Discord: https://discord.supabase.com
- React Community: https://react.dev/community
- Phaser Forum: https://phaser.discourse.group

**Business Questions:**
- Founder: [Your email]
- WhatsApp: +254 721 282313

---

**FINAL NOTE:**

This project is **substantial but achievable**. With the database schema complete, configuration files ready, and clear implementation guide above, a skilled team can build this in **3-4 months**.

**Priority Order:**
1. Authentication (week 1)
2. UI components (weeks 2-3)
3. Psychometric games (weeks 4-11)
4. Dashboards (weeks 12-14)
5. School selection (weeks 15-17)
6. Polish & testing (weeks 18-20)

**Total Development Time:** 20 weeks = ~5 months

**Budget (if outsourcing):**
- Developer (Kenya rates): KES 150K/month × 5 = **KES 750K**
- Designer: KES 80K/month × 2 = **KES 160K**
- Testing: KES 50K
- **Total: KES 960K** (~$7,500 USD)

**ROI:** With Year 1 revenue target of KES 29M, this is a **30× return**.

---

**Let's build the future of Kenyan education! 🚀🇰🇪**

© 2025 Dymz Ltd. Proprietary and Confidential.
