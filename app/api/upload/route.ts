import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocument } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;

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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    try {
      // Analyze document with Claude
      const extractedData = await analyzeDocument(base64, documentType);

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

      return NextResponse.json({
        success: true,
        document: document,
      });
    } catch (error: any) {
      console.error('Document processing error:', error);

      return NextResponse.json(
        {
          error: 'Failed to process document',
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload document',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
