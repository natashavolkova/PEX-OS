import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, instruction } = await request.json();

    if (!content || !instruction) {
      return NextResponse.json(
        { success: false, message: 'Content and instruction are required' },
        { status: 400 }
      );
    }

    // Mock AI refinement delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      data: {
        refinedContent: `${content}\n\n[Refined based on: ${instruction}]\n\nAdded more specific details and constraints as requested.`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Refinement failed' },
      { status: 500 }
    );
  }
}
