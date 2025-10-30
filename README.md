# Inmiform - Immigration Document Processor

An AI-powered React application for processing identity documents (passports, birth certificates, IDs) using Claude AI to extract information for USCIS immigration forms.

## ✨ Features

- **PDF Document Upload**: Drag-and-drop interface for uploading PDF documents
- **AI-Powered OCR**: Uses Claude 3.5 Sonnet to analyze and extract information from documents
- **Multiple Document Types**: Supports passports, birth certificates, national IDs, and driver licenses
- **Structured Data Extraction**: Automatically extracts relevant fields based on document type
- **Export Functionality**: Download extracted data as JSON
- **No Database Required**: Processes documents in memory for instant results

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude 3.5 Sonnet API
- **File Handling**: react-dropzone

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/migrative/inmiform2.git
cd inmiform2
git checkout claude/inmiform-pdf-upload-ocr-011CUcg4Doen4ngdNtm4trx1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Option 1: Copy from example
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser.

🎉 **That's it!** The application is ready to use.

---

## 📱 Usage

1. **Select Document Type**: Choose the type of document you're uploading (Passport, Birth Certificate, National ID, or Driver License)

2. **Upload PDF**: Drag and drop your PDF document or click to browse

3. **Wait for Processing**: The application will:
   - Upload the document
   - Send it to Claude AI for analysis
   - Extract structured information
   - Display results instantly

4. **View Results**: Extracted information will be displayed in a structured format

5. **Export Data**: Click "Export as JSON" to download the extracted data

---

## 📄 Supported Documents

### Passport
Extracts: Full name, date of birth, place of birth, nationality, passport number, issue/expiration dates, issuing authority, gender, visa stamps

### Birth Certificate
Extracts: Full name, date of birth, place of birth, parents' names, registration number, date of registration, issuing authority

### National ID / Driver License
Extracts: Full name, date of birth, ID/license number, issue/expiration dates, address, gender

---

## 🔧 API Endpoints

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
    "id": "doc_1234567890",
    "fileName": "passport.pdf",
    "documentType": "passport",
    "status": "completed",
    "extractedData": {
      "full_name": "John Doe",
      "date_of_birth": "1990-01-01",
      "passport_number": "AB1234567",
      "confidence": "high"
    },
    "processedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📂 Project Structure

```
inmiform2/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # Upload and processing API (no DB)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── DocumentUploader.tsx      # Upload component with drag-and-drop
│   └── DocumentViewer.tsx        # Display extracted data
├── lib/
│   └── claude.ts                 # Claude API integration
├── .env                          # Environment variables (your API key)
├── package.json
└── README.md
```

---

## 🎨 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

The only required environment variable is:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

---

## 🔒 Security Notes

- API keys should never be committed to version control
- The `.env` file is gitignored by default
- Consider implementing authentication for production use
- Add rate limiting for API routes
- Validate and sanitize all user inputs

---

## 🐛 Troubleshooting

### Claude API Errors
If document processing fails:
- Verify `ANTHROPIC_API_KEY` is valid and correctly set in `.env`
- Check API rate limits on your Anthropic account
- Ensure PDF is not corrupted and under 10MB
- Check console for detailed error messages

### Build Errors
If you encounter build errors:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

---

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `ANTHROPIC_API_KEY` environment variable
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🔮 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Database integration for document history (optional)
- [ ] Direct form filling for USCIS forms
- [ ] Support for image files (JPG, PNG)
- [ ] Batch document processing
- [ ] Document comparison and validation
- [ ] Multi-language support
- [ ] Document preview before processing

---

## 📝 License

MIT

## 💬 Support

For issues or questions, please open an issue on [GitHub](https://github.com/migrative/inmiform2/issues).

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Anthropic Claude AI](https://www.anthropic.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for simplifying immigration document processing**
