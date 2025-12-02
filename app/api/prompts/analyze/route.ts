// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - PROMPT ANALYSIS API
// ATHENA Architecture | AI-Powered Prompt Analysis
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// POST /api/prompts/analyze - Analyze a prompt for improvements
export async function POST(request: NextRequest) {
  try {
    const { content, promptId } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    // Simulated analysis (in production, use AI service)
    const analysis = {
      id: `analysis-${Date.now()}`,
      promptId: promptId || null,
      clarity: calculateClarity(content),
      specificity: calculateSpecificity(content),
      effectiveness: calculateEffectiveness(content),
      suggestions: generateSuggestions(content),
      analyzedAt: Date.now(),
    };

    return NextResponse.json({
      data: analysis,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to analyze prompt' },
      { status: 500 }
    );
  }
}

// Helper functions for analysis
function calculateClarity(content: string): number {
  // Simple heuristics for clarity
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  const avgLength = content.length / Math.max(sentences.length, 1);
  
  // Optimal sentence length for clarity is 15-20 words
  if (avgLength < 50) return 9;
  if (avgLength < 100) return 8;
  if (avgLength < 150) return 7;
  return 5;
}

function calculateSpecificity(content: string): number {
  // Check for specific elements
  let score = 5;
  
  if (content.includes('specific') || content.includes('exactly')) score += 1;
  if (content.includes('example') || content.includes('such as')) score += 1;
  if (content.match(/\d+/)) score += 1; // Contains numbers
  if (content.includes('must') || content.includes('should')) score += 1;
  if (content.length > 200) score += 1;
  
  return Math.min(score, 10);
}

function calculateEffectiveness(content: string): number {
  // Check for effective prompt patterns
  let score = 5;
  
  if (content.includes('role') || content.includes('act as')) score += 1;
  if (content.includes('context')) score += 1;
  if (content.includes('output') || content.includes('format')) score += 1;
  if (content.includes('step') || content.includes('first')) score += 1;
  if (content.length > 100 && content.length < 1000) score += 1;
  
  return Math.min(score, 10);
}

function generateSuggestions(content: string): string[] {
  const suggestions: string[] = [];
  
  if (content.length < 50) {
    suggestions.push('Add more context and specific instructions to improve results');
  }
  
  if (!content.includes('role') && !content.includes('act as')) {
    suggestions.push('Consider defining a specific role or persona for the AI');
  }
  
  if (!content.includes('format') && !content.includes('output')) {
    suggestions.push('Specify the desired output format (list, paragraph, code, etc.)');
  }
  
  if (!content.match(/\d+/)) {
    suggestions.push('Add specific numbers or quantities where applicable');
  }
  
  if (content.length > 1000) {
    suggestions.push('Consider breaking down into smaller, more focused prompts');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Prompt looks well-structured! Consider A/B testing variations');
  }
  
  return suggestions;
}
