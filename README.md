# Inmiform - Immigration Document Processor

An AI-powered React application for processing identity documents (passports, birth certificates, IDs) using Claude AI to extract information for USCIS immigration forms.

## Features

- **PDF Document Upload**: Drag-and-drop interface for uploading PDF documents
- **AI-Powered OCR**: Uses Claude 3.5 Sonnet to analyze and extract information from documents
- **Multiple Document Types**: Supports passports, birth certificates, national IDs, and driver licenses
- **Structured Data Extraction**: Automatically extracts relevant fields based on document type
- **Database Storage**: Stores documents and extracted data in PostgreSQL
- **Export Functionality**: Download extracted data as JSON

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude 3.5 Sonnet API
- **Database**: PostgreSQL with Prisma ORM
- **File Handling**: react-dropzone

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
- PostgreSQL database
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Anthropic Claude API
ANTHROPIC_API_KEY=your_actual_api_key_here

# Database (update with your PostgreSQL credentials)
DATABASE_URL="postgresql://username:password@localhost:5432/inmiform2?schema=public"
```

### 3. Set Up Database

Create a PostgreSQL database named `inmiform2` (or your preferred name matching the DATABASE_URL).

Then run Prisma migrations to create the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Select Document Type**: Choose the type of document you're uploading (Passport, Birth Certificate, National ID, or Driver License)

2. **Upload PDF**: Drag and drop your PDF document or click to browse

3. **Wait for Processing**: The application will:
   - Upload the document
   - Send it to Claude AI for analysis
   - Extract structured information
   - Store results in the database

4. **View Results**: Extracted information will be displayed in a structured format

5. **Export Data**: Click "Export as JSON" to download the extracted data

## Supported Documents

### Passport
Extracts: Full name, date of birth, place of birth, nationality, passport number, issue/expiration dates, issuing authority, gender, visa stamps

### Birth Certificate
Extracts: Full name, date of birth, place of birth, parents' names, registration number, date of registration, issuing authority

### National ID / Driver License
Extracts: Full name, date of birth, ID/license number, issue/expiration dates, address, gender

## API Endpoints

### POST `/api/upload`
Upload and process a document

**Request**: `multipart/form-data`
- `file`: PDF file (max 10MB)
- `documentType`: One of `passport`, `birth_certificate`, `national_id`, `driver_license`

**Response**:
```json
{
  "success": true,
  "document": {
    "id": "...",
    "fileName": "passport.pdf",
    "documentType": "passport",
    "status": "completed",
    "extractedData": { ... },
    "processedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET `/api/upload`
Retrieve all uploaded documents

**Response**:
```json
{
  "documents": [...]
}
```

## Database Schema

```prisma
model Document {
  id              String   @id @default(cuid())
  fileName        String
  fileSize        Int
  fileType        String
  documentType    String
  uploadedAt      DateTime @default(now())
  processedAt     DateTime?
  status          String   @default("pending")
  extractedData   Json?
  filePath        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Development

### Project Structure

```
inmiform2/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # Upload and processing API
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── DocumentUploader.tsx      # Upload component with drag-and-drop
│   └── DocumentViewer.tsx        # Display extracted data
├── lib/
│   ├── claude.ts                 # Claude API integration
│   └── db.ts                     # Prisma client singleton
├── prisma/
│   └── schema.prisma             # Database schema
└── package.json
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Security Notes

- API keys should never be committed to version control
- The `.env` file is gitignored by default
- Consider implementing authentication for production use
- Add rate limiting for API routes
- Validate and sanitize all user inputs

## Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Document versioning and history
- [ ] Direct form filling for USCIS forms
- [ ] Support for image files (JPG, PNG)
- [ ] Batch document processing
- [ ] Document comparison and validation
- [ ] Enhanced error handling and retry logic
- [ ] Document preview before processing

## Troubleshooting

### Prisma Connection Issues
If you encounter database connection errors, ensure:
- PostgreSQL is running
- DATABASE_URL is correct in `.env`
- Database exists and is accessible

### Claude API Errors
If document processing fails:
- Verify ANTHROPIC_API_KEY is valid
- Check API rate limits
- Ensure PDF is not corrupted and under 10MB

### Build Errors
If you encounter build errors:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
