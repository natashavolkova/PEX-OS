// ============================================================================
// PEX-OS - MOCK DATA: PROMPTS
// ATHENA Architecture | Sample Data for Development
// ============================================================================

import type { TreeNode, Folder, Prompt } from '@/types/prompt-manager';

export const mockPrompts: TreeNode[] = [
  {
    id: 'f1',
    name: 'System Prompts',
    type: 'folder',
    emoji: '🤖',
    isSystem: true,
    children: [
      {
        id: 'f1-1',
        name: 'ATHENA Core',
        type: 'folder',
        emoji: '⚡',
        children: [
          {
            id: 'p1',
            name: 'ENTJ Master Prompt',
            type: 'prompt',
            emoji: '🎯',
            content: `Você é ATHENA, uma arquiteta ENTJ Omega Builder.

## Princípios Fundamentais:
1. **Produtividade Máxima** - Priorize output sobre conforto
2. **Velocidade Agressiva** - Ship rápido, itere mais rápido
3. **Impacto Real** - Meça resultados, não horas
4. **Eliminação Ruthless** - Kill low-ROI ideas fast

## Regras Operacionais:
- ROI > 2.0 = EXECUTE IMEDIATO
- ROI 1.0-2.0 = SCHEDULE
- ROI 0.5-1.0 = DELEGATE
- ROI < 0.5 = ELIMINATE

## Output Format:
- Código limpo e documentado
- Testes incluídos
- README atualizado
- Deploy ready`,
            tags: ['system', 'core', 'entj'],
            category: 'System',
            date: new Date().toLocaleDateString('pt-BR'),
          },
          {
            id: 'p2',
            name: 'Coding Assistant',
            type: 'prompt',
            emoji: '👨‍💻',
            content: `You are an expert full-stack developer specializing in:

## Tech Stack:
- **Frontend**: React 18, Next.js 15, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand, React Query
- **Backend**: Node.js, Express, Prisma

## Coding Standards:
1. TypeScript strict mode always
2. Functional components with hooks
3. Proper error boundaries
4. Accessible (WCAG 2.1 AA)
5. Performance optimized

## Response Format:
- Clean, well-commented code
- Explain complex logic
- Include usage examples
- Note any edge cases`,
            tags: ['dev', 'code', 'typescript'],
            category: 'Development',
            date: new Date().toLocaleDateString('pt-BR'),
          },
        ],
      },
      {
        id: 'f1-2',
        name: 'Analysis Prompts',
        type: 'folder',
        emoji: '📊',
        children: [
          {
            id: 'p3',
            name: 'Prompt Analyzer',
            type: 'prompt',
            emoji: '🔬',
            content: `Analyze the following prompt for:

## Clarity (1-10):
- Is the objective clear?
- Are instructions unambiguous?
- Is context sufficient?

## Specificity (1-10):
- Are requirements detailed?
- Are constraints defined?
- Are examples included?

## Effectiveness (1-10):
- Will it produce desired results?
- Is it efficient?
- Are edge cases handled?

## Suggestions:
- List 3-5 improvements
- Prioritize by impact
- Include examples

Output as JSON with scores and reasoning.`,
            tags: ['analysis', 'improvement'],
            category: 'Analysis',
            date: new Date().toLocaleDateString('pt-BR'),
          },
        ],
      },
    ],
  },
  {
    id: 'f2',
    name: 'Marketing',
    type: 'folder',
    emoji: '📈',
    children: [
      {
        id: 'p4',
        name: 'Cold Email Generator',
        type: 'prompt',
        emoji: '📧',
        content: `Generate a high-converting cold email sequence:

## Email 1 - Initial Contact
- Hook with relevance
- Brief value prop
- Soft CTA

## Email 2 - Follow Up
- Reference initial email
- Add social proof
- Stronger CTA

## Email 3 - Break Up
- Create urgency
- Final offer
- Clear CTA

Variables:
- {{recipientName}}
- {{companyName}}
- {{painPoint}}
- {{solution}}
- {{proofPoint}}`,
        tags: ['marketing', 'email', 'outreach'],
        category: 'Marketing',
        date: new Date().toLocaleDateString('pt-BR'),
      },
      {
        id: 'p5',
        name: 'Landing Page Copy',
        type: 'prompt',
        emoji: '🎯',
        content: `Create high-conversion landing page copy:

## Hero Section
- Headline (max 10 words)
- Subheadline (value prop)
- CTA button text

## Pain Points
- 3 specific problems
- Emotional triggers
- Visual descriptions

## Solution Benefits
- 3 clear benefits
- Quantified results
- Before/after contrast

## Social Proof
- Testimonials
- Logos/brands
- Statistics

## Final CTA
- Urgency element
- Risk reversal
- Action focus`,
        tags: ['marketing', 'copy', 'landing'],
        category: 'Marketing',
        date: new Date().toLocaleDateString('pt-BR'),
      },
    ],
  },
  {
    id: 'f3',
    name: 'Development',
    type: 'folder',
    emoji: '💻',
    children: [
      {
        id: 'f3-1',
        name: 'React Components',
        type: 'folder',
        emoji: '⚛️',
        children: [
          {
            id: 'p6',
            name: 'Component Generator',
            type: 'prompt',
            emoji: '🧩',
            content: `Create a React component with:

## Component Name: {{componentName}}

## Requirements:
- TypeScript strict mode
- Props interface
- Default props
- Forwardref if needed
- Proper memo usage

## Styling:
- Tailwind CSS only
- Responsive design
- Dark mode support
- Accessible colors

## Features:
- Loading state
- Error state
- Empty state
- Skeleton fallback

## Exports:
- Named export
- Types export
- Utility exports`,
            tags: ['react', 'component', 'typescript'],
            category: 'Development',
            date: new Date().toLocaleDateString('pt-BR'),
          },
        ],
      },
      {
        id: 'f3-2',
        name: 'API Templates',
        type: 'folder',
        emoji: '🔌',
        children: [
          {
            id: 'p7',
            name: 'REST API Route',
            type: 'prompt',
            emoji: '🛣️',
            content: `Create a Next.js API route:

## Endpoint: {{endpoint}}
## Method: {{method}}

## Handler Requirements:
- Input validation
- Error handling
- Response typing
- Logging

## Schema:
\`\`\`typescript
interface Request {
  // Define input
}

interface Response {
  success: boolean;
  data?: T;
  error?: string;
}
\`\`\`

## Security:
- Rate limiting
- Auth check
- CORS config
- Input sanitization`,
            tags: ['api', 'backend', 'nextjs'],
            category: 'Development',
            date: new Date().toLocaleDateString('pt-BR'),
          },
        ],
      },
    ],
  },
  {
    id: 'f4',
    name: 'Personal',
    type: 'folder',
    emoji: '🔒',
    children: [
      {
        id: 'p8',
        name: 'Daily Planning',
        type: 'prompt',
        emoji: '📅',
        content: `Create my ENTJ daily battle plan:

## Morning Review (5 min)
- Top 3 priorities
- Calendar check
- Energy forecast

## Priority Matrix
- URGENT + IMPORTANT: Execute first
- IMPORTANT + NOT URGENT: Schedule
- URGENT + NOT IMPORTANT: Delegate
- NEITHER: Eliminate

## Time Blocks
- Deep work: {{deepWorkHours}}
- Shallow work: {{shallowWorkHours}}
- Breaks: Every 90 min

## Evening Review
- Wins logged
- Blockers identified
- Tomorrow prep`,
        tags: ['personal', 'planning', 'entj'],
        category: 'Personal',
        date: new Date().toLocaleDateString('pt-BR'),
      },
    ],
  },
];

export const mockSharedItems = [
  {
    id: 'shared-1',
    name: 'Marketing Assets',
    type: 'folder' as const,
    emoji: '🎨',
    owner: {
      name: 'Ana Silva',
      initials: 'AS',
      color: 'bg-purple-500',
    },
    permission: 'edit' as const,
    date: '15/01/2024',
    itemsCount: 12,
    isShared: true as const,
  },
  {
    id: 'shared-2',
    name: 'API Documentation',
    type: 'prompt' as const,
    emoji: '📄',
    owner: {
      name: 'Carlos Dev',
      initials: 'CD',
      color: 'bg-blue-500',
    },
    permission: 'view' as const,
    date: '18/01/2024',
    content: 'API documentation content...',
    isShared: true as const,
  },
];

export default mockPrompts;
