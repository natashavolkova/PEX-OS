// ============================================================================
// AthenaPeX - MOCK DATA: STRATEGIC TEMPLATES
// ATHENA Architecture | Sample Data for Development
// ============================================================================

import type { StrategicTemplate, TemplateVariable } from '@/types';

export const mockTemplates: StrategicTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Micro-MVP Blueprint',
    category: 'mvp',
    description: 'Rapid MVP development blueprint for validating ideas in 48-72 hours',
    emoji: '🚀',
    content: `# {{projectName}} - Micro-MVP Blueprint

## Core Hypothesis
**Problem:** {{problemStatement}}
**Solution:** {{solutionStatement}}
**Target User:** {{targetUser}}

## MVP Scope (Max 3 Features)
1. **{{feature1Name}}**: {{feature1Description}}
2. **{{feature2Name}}**: {{feature2Description}}
3. **{{feature3Name}}**: {{feature3Description}}

## Tech Stack
- Frontend: {{frontend}}
- Backend: {{backend}}
- Database: {{database}}
- Hosting: {{hosting}}

## Timeline: {{timeline}} hours

## Success Metrics
- **Primary:** {{primaryMetric}}
- **Secondary:** {{secondaryMetric}}

## Go/No-Go Criteria
- Proceed if: {{proceedIf}}
- Pivot if: {{pivotIf}}
- Kill if: {{killIf}}

## Launch Checklist
- [ ] Core feature 1 working
- [ ] Core feature 2 working
- [ ] Basic error handling
- [ ] Mobile responsive
- [ ] Analytics tracking
- [ ] Feedback mechanism

---
*ENTJ Rule: Ship in {{timeline}}h or kill the idea.*`,
    variables: [
      { name: 'projectName', description: 'Project name', type: 'text', required: true },
      { name: 'problemStatement', description: 'Problem being solved', type: 'textarea', required: true },
      { name: 'solutionStatement', description: 'Your solution', type: 'textarea', required: true },
      { name: 'targetUser', description: 'Target user persona', type: 'text', required: true },
      { name: 'feature1Name', description: 'Feature 1 name', type: 'text', required: true },
      { name: 'feature1Description', description: 'Feature 1 description', type: 'text', required: true },
      { name: 'feature2Name', description: 'Feature 2 name', type: 'text', required: false },
      { name: 'feature2Description', description: 'Feature 2 description', type: 'text', required: false },
      { name: 'feature3Name', description: 'Feature 3 name', type: 'text', required: false },
      { name: 'feature3Description', description: 'Feature 3 description', type: 'text', required: false },
      { name: 'frontend', description: 'Frontend tech', type: 'select', options: ['React', 'Next.js', 'Vue', 'Svelte', 'HTML/CSS'], required: true },
      { name: 'backend', description: 'Backend tech', type: 'select', options: ['Node.js', 'Python', 'Go', 'None (Serverless)', 'Supabase'], required: true },
      { name: 'database', description: 'Database', type: 'select', options: ['PostgreSQL', 'MongoDB', 'SQLite', 'Supabase', 'Firebase'], required: true },
      { name: 'hosting', description: 'Hosting', type: 'select', options: ['Vercel', 'Netlify', 'Railway', 'AWS', 'Cloudflare'], required: true },
      { name: 'timeline', description: 'Timeline in hours', type: 'number', required: true },
      { name: 'primaryMetric', description: 'Primary success metric', type: 'text', required: true },
      { name: 'secondaryMetric', description: 'Secondary metric', type: 'text', required: false },
      { name: 'proceedIf', description: 'Proceed condition', type: 'text', required: true },
      { name: 'pivotIf', description: 'Pivot condition', type: 'text', required: true },
      { name: 'killIf', description: 'Kill condition', type: 'text', required: true },
    ],
    tags: ['mvp', 'rapid', 'validation'],
    usageCount: 15,
    avgRating: 4.8,
    isCustom: false,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'tpl-002',
    name: 'High-Conversion Landing Page',
    category: 'landing_page',
    description: 'Landing page structure optimized for maximum conversions',
    emoji: '🎯',
    content: `# {{productName}} - Landing Page Copy

## Hero Section
**Headline:** {{headline}}
**Subheadline:** {{subheadline}}
**CTA Button:** {{ctaText}}
**Hero Visual:** {{heroVisual}}

---

## Pain Points Section
"Are you struggling with..."

1. ❌ {{pain1}}
2. ❌ {{pain2}}
3. ❌ {{pain3}}

---

## Solution Section
"Introducing {{productName}}"

✅ **{{benefit1Title}}**: {{benefit1Description}}
✅ **{{benefit2Title}}**: {{benefit2Description}}
✅ **{{benefit3Title}}**: {{benefit3Description}}

---

## Social Proof
> "{{testimonialQuote}}"
> — **{{testimonialAuthor}}**, {{testimonialRole}}

**Trust Badges:**
- {{trustBadge1}}
- {{trustBadge2}}
- {{trustBadge3}}

---

## Pricing Section
**{{pricingModel}}**

{{pricingDetails}}

---

## Final CTA
**{{finalCTA}}**

**Urgency:** {{urgencyElement}}

**Risk Reversal:** {{guarantee}}

---

## FAQ
**Q: {{faq1Question}}**
A: {{faq1Answer}}

**Q: {{faq2Question}}**
A: {{faq2Answer}}`,
    variables: [
      { name: 'productName', description: 'Product name', type: 'text', required: true },
      { name: 'headline', description: 'Main headline (max 10 words)', type: 'text', required: true },
      { name: 'subheadline', description: 'Supporting subheadline', type: 'textarea', required: true },
      { name: 'ctaText', description: 'CTA button text', type: 'text', required: true },
      { name: 'heroVisual', description: 'Hero image/video description', type: 'text', required: true },
      { name: 'pain1', description: 'Pain point 1', type: 'text', required: true },
      { name: 'pain2', description: 'Pain point 2', type: 'text', required: true },
      { name: 'pain3', description: 'Pain point 3', type: 'text', required: true },
      { name: 'benefit1Title', description: 'Benefit 1 title', type: 'text', required: true },
      { name: 'benefit1Description', description: 'Benefit 1 description', type: 'text', required: true },
      { name: 'benefit2Title', description: 'Benefit 2 title', type: 'text', required: true },
      { name: 'benefit2Description', description: 'Benefit 2 description', type: 'text', required: true },
      { name: 'benefit3Title', description: 'Benefit 3 title', type: 'text', required: true },
      { name: 'benefit3Description', description: 'Benefit 3 description', type: 'text', required: true },
      { name: 'testimonialQuote', description: 'Testimonial quote', type: 'textarea', required: true },
      { name: 'testimonialAuthor', description: 'Testimonial author', type: 'text', required: true },
      { name: 'testimonialRole', description: 'Author role/company', type: 'text', required: true },
      { name: 'trustBadge1', description: 'Trust badge 1', type: 'text', required: true },
      { name: 'trustBadge2', description: 'Trust badge 2', type: 'text', required: false },
      { name: 'trustBadge3', description: 'Trust badge 3', type: 'text', required: false },
      { name: 'pricingModel', description: 'Pricing model', type: 'select', options: ['Free Trial', 'Freemium', 'One-time', 'Subscription', 'Pay-as-you-go'], required: true },
      { name: 'pricingDetails', description: 'Pricing details', type: 'textarea', required: true },
      { name: 'finalCTA', description: 'Final call to action', type: 'text', required: true },
      { name: 'urgencyElement', description: 'Urgency element', type: 'text', required: false },
      { name: 'guarantee', description: 'Guarantee/risk reversal', type: 'text', required: true },
      { name: 'faq1Question', description: 'FAQ 1 question', type: 'text', required: true },
      { name: 'faq1Answer', description: 'FAQ 1 answer', type: 'textarea', required: true },
      { name: 'faq2Question', description: 'FAQ 2 question', type: 'text', required: false },
      { name: 'faq2Answer', description: 'FAQ 2 answer', type: 'textarea', required: false },
    ],
    tags: ['landing', 'conversion', 'marketing'],
    usageCount: 28,
    avgRating: 4.6,
    isCustom: false,
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'tpl-003',
    name: 'Cold Email Sequence',
    category: 'cold_email',
    description: 'High-response cold email template for B2B outreach',
    emoji: '📧',
    content: `# Cold Email Sequence: {{campaignName}}

## Email 1 - Initial Contact
**Subject:** {{subject1}}

Hi {{recipientName}},

{{openingHook}}

{{valueProposition}}

{{credibility}}

{{cta1}}

Best,
{{senderName}}
{{senderTitle}}

---

## Email 2 - Follow Up (Day 3)
**Subject:** Re: {{subject1}}

Hi {{recipientName}},

{{followUpHook}}

{{additionalValue}}

{{cta2}}

{{senderName}}

---

## Email 3 - Social Proof (Day 5)
**Subject:** Quick question about {{topic}}

{{recipientName}},

{{socialProofIntro}}

{{caseStudy}}

{{cta3}}

{{senderName}}

---

## Email 4 - Break Up (Day 8)
**Subject:** Should I close your file?

{{recipientName}},

{{breakUpMessage}}

{{finalOffer}}

{{ctaFinal}}

{{senderName}}

---

## Campaign Notes
- **Personalization tokens:** {{personalizationNotes}}
- **Best send times:** {{sendTimes}}
- **Expected response rate:** {{expectedRate}}%`,
    variables: [
      { name: 'campaignName', description: 'Campaign name', type: 'text', required: true },
      { name: 'subject1', description: 'Initial subject line', type: 'text', required: true },
      { name: 'recipientName', description: 'Recipient variable', type: 'text', defaultValue: '{{name}}', required: true },
      { name: 'openingHook', description: 'Opening hook', type: 'textarea', required: true },
      { name: 'valueProposition', description: 'Value proposition', type: 'textarea', required: true },
      { name: 'credibility', description: 'Credibility statement', type: 'text', required: true },
      { name: 'cta1', description: 'Email 1 CTA', type: 'text', required: true },
      { name: 'senderName', description: 'Your name', type: 'text', required: true },
      { name: 'senderTitle', description: 'Your title', type: 'text', required: true },
      { name: 'followUpHook', description: 'Follow up hook', type: 'textarea', required: true },
      { name: 'additionalValue', description: 'Additional value', type: 'textarea', required: true },
      { name: 'cta2', description: 'Email 2 CTA', type: 'text', required: true },
      { name: 'topic', description: 'Discussion topic', type: 'text', required: true },
      { name: 'socialProofIntro', description: 'Social proof intro', type: 'textarea', required: true },
      { name: 'caseStudy', description: 'Brief case study', type: 'textarea', required: true },
      { name: 'cta3', description: 'Email 3 CTA', type: 'text', required: true },
      { name: 'breakUpMessage', description: 'Break up message', type: 'textarea', required: true },
      { name: 'finalOffer', description: 'Final offer', type: 'text', required: true },
      { name: 'ctaFinal', description: 'Final CTA', type: 'text', required: true },
      { name: 'personalizationNotes', description: 'Personalization notes', type: 'textarea', required: false },
      { name: 'sendTimes', description: 'Best send times', type: 'text', required: false },
      { name: 'expectedRate', description: 'Expected response rate', type: 'number', required: false },
    ],
    tags: ['email', 'outreach', 'b2b', 'sales'],
    usageCount: 42,
    avgRating: 4.4,
    isCustom: false,
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 7,
  },
  {
    id: 'tpl-004',
    name: 'Impact vs Effort Matrix',
    category: 'matrix',
    description: 'ENTJ-style prioritization matrix for ruthless task evaluation',
    emoji: '📊',
    content: `# Impact vs Effort Matrix: {{contextName}}

## Date: {{date}}
## Evaluator: {{evaluator}}

---

## ⚡ QUICK WINS (High Impact, Low Effort)
**Action: EXECUTE IMMEDIATELY**
**ROI: > 2.0**

| Task | Impact | Effort | ROI | Deadline |
|------|--------|--------|-----|----------|
| {{qw1Task}} | {{qw1Impact}}/10 | {{qw1Effort}}/10 | {{qw1ROI}} | {{qw1Deadline}} |
| {{qw2Task}} | {{qw2Impact}}/10 | {{qw2Effort}}/10 | {{qw2ROI}} | {{qw2Deadline}} |
| {{qw3Task}} | {{qw3Impact}}/10 | {{qw3Effort}}/10 | {{qw3ROI}} | {{qw3Deadline}} |

---

## 🎯 STRATEGIC PROJECTS (High Impact, High Effort)
**Action: SCHEDULE & RESOURCE**
**ROI: 1.0 - 2.0**

| Task | Impact | Effort | ROI | Resource Needs |
|------|--------|--------|-----|----------------|
| {{sp1Task}} | {{sp1Impact}}/10 | {{sp1Effort}}/10 | {{sp1ROI}} | {{sp1Resources}} |
| {{sp2Task}} | {{sp2Impact}}/10 | {{sp2Effort}}/10 | {{sp2ROI}} | {{sp2Resources}} |

---

## 📝 FILL-INS (Low Impact, Low Effort)
**Action: DELEGATE OR BATCH**
**ROI: 0.5 - 1.0**

| Task | Impact | Effort | ROI | Delegate To |
|------|--------|--------|-----|-------------|
| {{fi1Task}} | {{fi1Impact}}/10 | {{fi1Effort}}/10 | {{fi1ROI}} | {{fi1Delegate}} |

---

## 🚫 TIME WASTERS (Low Impact, High Effort)
**Action: ELIMINATE**
**ROI: < 0.5**

| Task | Impact | Effort | ROI | Reason to Kill |
|------|--------|--------|-----|----------------|
| {{tw1Task}} | {{tw1Impact}}/10 | {{tw1Effort}}/10 | {{tw1ROI}} | {{tw1Reason}} |

---

## ACTION PLAN
1. {{action1}}
2. {{action2}}
3. {{action3}}

## ENTJ Notes
{{entjNotes}}`,
    variables: [
      { name: 'contextName', description: 'Context/Sprint name', type: 'text', required: true },
      { name: 'date', description: 'Date', type: 'text', required: true },
      { name: 'evaluator', description: 'Evaluator name', type: 'text', required: true },
      { name: 'qw1Task', description: 'Quick Win 1 task', type: 'text', required: true },
      { name: 'qw1Impact', description: 'QW1 impact', type: 'number', required: true },
      { name: 'qw1Effort', description: 'QW1 effort', type: 'number', required: true },
      { name: 'qw1ROI', description: 'QW1 ROI', type: 'number', required: true },
      { name: 'qw1Deadline', description: 'QW1 deadline', type: 'text', required: true },
      { name: 'qw2Task', description: 'Quick Win 2 task', type: 'text', required: false },
      { name: 'qw2Impact', description: 'QW2 impact', type: 'number', required: false },
      { name: 'qw2Effort', description: 'QW2 effort', type: 'number', required: false },
      { name: 'qw2ROI', description: 'QW2 ROI', type: 'number', required: false },
      { name: 'qw2Deadline', description: 'QW2 deadline', type: 'text', required: false },
      { name: 'qw3Task', description: 'Quick Win 3 task', type: 'text', required: false },
      { name: 'qw3Impact', description: 'QW3 impact', type: 'number', required: false },
      { name: 'qw3Effort', description: 'QW3 effort', type: 'number', required: false },
      { name: 'qw3ROI', description: 'QW3 ROI', type: 'number', required: false },
      { name: 'qw3Deadline', description: 'QW3 deadline', type: 'text', required: false },
      { name: 'sp1Task', description: 'Strategic Project 1', type: 'text', required: true },
      { name: 'sp1Impact', description: 'SP1 impact', type: 'number', required: true },
      { name: 'sp1Effort', description: 'SP1 effort', type: 'number', required: true },
      { name: 'sp1ROI', description: 'SP1 ROI', type: 'number', required: true },
      { name: 'sp1Resources', description: 'SP1 resources', type: 'text', required: true },
      { name: 'sp2Task', description: 'Strategic Project 2', type: 'text', required: false },
      { name: 'sp2Impact', description: 'SP2 impact', type: 'number', required: false },
      { name: 'sp2Effort', description: 'SP2 effort', type: 'number', required: false },
      { name: 'sp2ROI', description: 'SP2 ROI', type: 'number', required: false },
      { name: 'sp2Resources', description: 'SP2 resources', type: 'text', required: false },
      { name: 'fi1Task', description: 'Fill-in task', type: 'text', required: false },
      { name: 'fi1Impact', description: 'FI impact', type: 'number', required: false },
      { name: 'fi1Effort', description: 'FI effort', type: 'number', required: false },
      { name: 'fi1ROI', description: 'FI ROI', type: 'number', required: false },
      { name: 'fi1Delegate', description: 'Delegate to', type: 'text', required: false },
      { name: 'tw1Task', description: 'Time waster task', type: 'text', required: true },
      { name: 'tw1Impact', description: 'TW impact', type: 'number', required: true },
      { name: 'tw1Effort', description: 'TW effort', type: 'number', required: true },
      { name: 'tw1ROI', description: 'TW ROI', type: 'number', required: true },
      { name: 'tw1Reason', description: 'Reason to kill', type: 'text', required: true },
      { name: 'action1', description: 'Action item 1', type: 'text', required: true },
      { name: 'action2', description: 'Action item 2', type: 'text', required: true },
      { name: 'action3', description: 'Action item 3', type: 'text', required: false },
      { name: 'entjNotes', description: 'ENTJ notes', type: 'textarea', required: false },
    ],
    tags: ['matrix', 'prioritization', 'entj', 'planning'],
    usageCount: 35,
    avgRating: 4.9,
    isCustom: false,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

export const getTemplateById = (id: string): StrategicTemplate | undefined => {
  return mockTemplates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: StrategicTemplate['category']): StrategicTemplate[] => {
  return mockTemplates.filter(t => t.category === category);
};

export const getMostUsedTemplates = (limit: number = 5): StrategicTemplate[] => {
  return [...mockTemplates].sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
};

export default mockTemplates;
