import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function analyzeDocument(
  pdfBase64: string,
  documentType: string
): Promise<any> {
  const prompt = `You are an AI assistant specialized in extracting information from identity documents for USCIS immigration forms.

Analyze this ${documentType} document and extract ALL relevant information in a structured format.

For each document type, extract the following:

**Passport:**
- Full name (Given names and Surname)
- Date of birth
- Place of birth
- Nationality
- Passport number
- Issue date
- Expiration date
- Issuing authority
- Gender
- Any visible visa stamps or entry/exit stamps

**Birth Certificate:**
- Full name
- Date of birth
- Place of birth (city, state, country)
- Father's full name
- Mother's full name
- Registration number/Certificate number
- Date of registration
- Issuing authority

**National ID/Driver License:**
- Full name
- Date of birth
- ID/License number
- Issue date
- Expiration date
- Address
- Gender
- Any other identifying information

Return the extracted data in a clean JSON format with clear field names. If any field is not visible or not applicable, mark it as "Not found" or omit it.

Also include a "confidence" field (high/medium/low) for the overall extraction quality and a "notes" field for any observations, warnings, or unclear information.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  // Extract the text response
  const textContent = message.content.find((block) => block.type === 'text');
  if (textContent && textContent.type === 'text') {
    // Try to parse JSON from the response
    const text = textContent.text;

    // Look for JSON in the response (might be wrapped in markdown code blocks)
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        // Return the raw text if JSON parsing fails
        return { raw_text: text, error: 'Failed to parse JSON response' };
      }
    }

    return { raw_text: text };
  }

  throw new Error('No text content in Claude response');
}

export { anthropic };
