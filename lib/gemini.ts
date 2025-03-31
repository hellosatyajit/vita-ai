import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Schema,
  SchemaType,
} from "@google/generative-ai";
import { prompts, formatPrompt } from "./prompts";
import { DebateAnalysis } from "@/types/database.types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);

const analysisSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    argument_analysis: {
      type: SchemaType.OBJECT,
      properties: {
        main_arguments: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        reasoning_quality: { type: SchemaType.STRING },
        evidence_usage: { type: SchemaType.STRING },
        logical_fallacies: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: [
        "main_arguments",
        "reasoning_quality",
        "evidence_usage",
        "logical_fallacies",
      ],
    },
    rhetorical_analysis: {
      type: SchemaType.OBJECT,
      properties: {
        persuasiveness_score: { type: SchemaType.NUMBER },
        clarity_score: { type: SchemaType.NUMBER },
        language_effectiveness: { type: SchemaType.STRING },
        notable_phrases: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: [
        "persuasiveness_score",
        "clarity_score",
        "language_effectiveness",
        "notable_phrases",
      ],
    },
    strategy_analysis: {
      type: SchemaType.OBJECT,
      properties: {
        opening_effectiveness: { type: SchemaType.STRING },
        counterargument_handling: { type: SchemaType.STRING },
        time_management: { type: SchemaType.STRING },
        overall_strategy: { type: SchemaType.STRING },
      },
      required: [
        "opening_effectiveness",
        "counterargument_handling",
        "time_management",
        "overall_strategy",
      ],
    },
    improvement_areas: {
      type: SchemaType.OBJECT,
      properties: {
        priority_improvements: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        practice_suggestions: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        specific_examples: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: [
        "priority_improvements",
        "practice_suggestions",
        "specific_examples",
      ],
    },
    overall_assessment: {
      type: SchemaType.OBJECT,
      properties: {
        key_strengths: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        learning_points: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        effectiveness_score: { type: SchemaType.NUMBER },
        summary: { type: SchemaType.STRING },
      },
      required: [
        "key_strengths",
        "learning_points",
        "effectiveness_score",
        "summary",
      ],
    },
  },
  required: [
    "argument_analysis",
    "rhetorical_analysis",
    "strategy_analysis",
    "improvement_areas",
    "overall_assessment",
  ],
};

export async function generateDebateAnalysis(
  topic: string,
  stance: string,
  duration: number,
  transcript: Array<{ role: string; text: string; id: string }>
): Promise<DebateAnalysis> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const prompt = formatPrompt(prompts.debateAnalysis, {
      topic,
      stance,
      duration: Math.floor(duration / 60).toString(),
      transcript: transcript
        .map((msg) => `${msg.role}: ${msg.text}`)
        .join("\n"),
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());
    return analysis;
  } catch (error) {
    console.error("Error generating analysis:", error);
    throw new Error("Failed to generate debate analysis");
  }
}
