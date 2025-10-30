import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocument } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    // Validate API key is configured
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
      console.error('❌ ANTHROPIC_API_KEY is not configured');
      return NextResponse.json(
        {
          error: 'API key not configured',
          details: 'Please set ANTHROPIC_API_KEY in your .env file'
        },
        { status: 500 }
      );
    }

    console.log('📤 Receiving upload request...');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;

    console.log(`📄 File: ${file?.name}, Type: ${documentType}`);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    console.log('🔄 Converting PDF to base64...');
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    console.log(`✅ Converted ${file.size} bytes to base64`);

    try {
      console.log('🤖 Sending to Claude AI for analysis...');
      // Analyze document with Claude
      const extractedData = await analyzeDocument(base64, documentType);
      console.log('✅ Claude AI analysis complete');

      // Create a mock document object (without database)
      const document = {
        id: `doc_${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        documentType: documentType,
        uploadedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
        status: 'completed',
        extractedData: extractedData,
      };

      console.log('📤 Sending response to client');
      return NextResponse.json({
        success: true,
        document: document,
      });
    } catch (error: any) {
      console.error('❌ Document processing error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      return NextResponse.json(
        {
          error: 'Failed to process document with Claude AI',
          details: error.message || 'Unknown error occurred',
          errorType: error.name,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: 'Failed to upload document',
        details: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
