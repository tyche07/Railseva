
import { GoogleGenAI, Type } from "@google/genai";
import { Fitting, IssueType, Severity } from "../types";

// This is a mock implementation. In a real app, the API key would be
// handled securely on a backend server, not exposed in the frontend.
// We use a placeholder here for demonstration purposes.
// process.env.API_KEY would be populated in a Node.js environment.
const API_KEY = process.env.API_KEY || "YOUR_API_KEY_HERE";

// A mock to prevent errors in a browser environment where process.env is not defined.
if (API_KEY === "YOUR_API_KEY_HERE" && typeof window !== 'undefined') {
  console.warn("Gemini API key is not set. Using mocked responses.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to convert File to base64 for the API
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); 
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export interface AIVisualAnalysis {
    issueType: IssueType;
    severity: Severity;
    notes: string;
}

/**
 * Analyzes an image of a railway component for defects.
 * @param imageFile The image file to analyze.
 * @returns A promise that resolves to an analysis object.
 */
export const analyzeIssueImage = async (imageFile: File): Promise<AIVisualAnalysis> => {
  if (API_KEY === "YOUR_API_KEY_HERE") {
    return new Promise(resolve => setTimeout(() => {
        resolve({
            issueType: IssueType.CRACKED_COMPONENT,
            severity: Severity.MEDIUM,
            notes: "Mock AI Response: A hairline crack is visible on the surface of the liner. No immediate signs of displacement, but it should be monitored."
        });
    }, 2000));
  }

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const prompt = `
      You are an expert railway track inspector. Analyze the provided image of a railway component.
      Based on your visual analysis, identify the primary issue.
      
      Respond with a JSON object that includes:
      1. "issueType": Classify the issue into one of the following categories: ${Object.values(IssueType).join(', ')}.
      2. "severity": Assess the severity as one of: ${Object.values(Severity).join(', ')}.
      3. "notes": Provide a concise, one-sentence description of what you see.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    issueType: { type: Type.STRING, enum: Object.values(IssueType) },
                    severity: { type: Type.STRING, enum: Object.values(Severity) },
                    notes: { type: Type.STRING, description: "A concise description of the observed issue." }
                },
                required: ["issueType", "severity", "notes"]
            }
        }
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse as AIVisualAnalysis;

  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Could not analyze image. The AI service may be unavailable.");
  }
};


/**
 * Generates a formal warranty claim text using Gemini.
 * @param fitting The faulty fitting details.
 * @param issueDescription A description of the issue.
 * @returns A promise that resolves to the generated claim text.
 */
export const generateWarrantyClaimText = async (
  fitting: Fitting,
  issueDescription: string
): Promise<string> => {
  // In a real app, you would make an API call. Here we mock it if the key isn't set.
  if (API_KEY === "YOUR_API_KEY_HERE") {
    return new Promise(resolve => setTimeout(() => {
        const mockResponse = `
**WARRANTY CLAIM SUBMISSION**

**Date:** ${new Date().toLocaleDateString()}
**Claimant:** RailTrack360 System (on behalf of Depot Manager)

**Subject: Warranty Claim for Defective Railway Component**

**Component Details:**
- **Unique ID (UID):** ${fitting.uid}
- **Component Type:** ${fitting.type}
- **Vendor:** ${fitting.vendor}
- **Lot Number:** ${fitting.lotNumber}
- **Installation Date:** ${fitting.installDate}
- **Warranty End Date:** ${fitting.warrantyEndDate}
- **Inspection Certificate:** ${fitting.inspectionCert}

**Description of Defect:**
${issueDescription}

This component has failed prematurely under normal operating conditions and is within its warranty period. We request a replacement or credit as per our warranty agreement. Please advise on the next steps for processing this claim.

Sincerely,
Depot Management
`;
        resolve(mockResponse);
    }, 1500));
  }

  try {
    const prompt = `
      Generate a formal warranty claim for a defective railway component. Use the following details:
      - Component Type: ${fitting.type}
      - Component UID: ${fitting.uid}
      - Vendor: ${fitting.vendor}
      - Lot Number: ${fitting.lotNumber}
      - Installation Date: ${fitting.installDate}
      - Warranty End Date: ${fitting.warrantyEndDate}
      - Issue Description: ${issueDescription}

      The tone should be professional and direct. The claim is from a depot manager.
      Format it clearly with sections for component details and the description of the defect.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating warranty claim with Gemini:", error);
    return "Error: Could not generate warranty claim. Please try again later.";
  }
};