import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    // Mock analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      data: {
        score: 85,
        clarity: 90,
        specificity: 80,
        context: 85,
        suggestions: [
          'Consider adding more context about the target audience.',
          'Specify the desired output format more clearly.',
          'Add constraints to limit the scope of the response.'
        ]
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Analysis failed' },
      { status: 500 }
    );
  }
}
