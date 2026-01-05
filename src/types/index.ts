// Core type definitions for the AI Health Co-Pilot

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

export type ConcernCategory =
    | 'ultra-processing'
    | 'allergen'
    | 'preservative'
    | 'artificial-additive'
    | 'sugar'
    | 'controversial'
    | 'none';

export type UncertaintyType =
    | 'well-established'
    | 'emerging-research'
    | 'debated'
    | 'unknown';

export interface Ingredient {
    name: string;
    scientificName?: string;
    category: ConcernCategory;
    confidence: ConfidenceLevel;
}

export interface HealthConcern {
    category: ConcernCategory;
    severity: 'low' | 'medium' | 'high';
    description: string;
    reasoning: string;
    confidence: ConfidenceLevel;
    affectedGroups?: string[]; // e.g., "pregnant women", "children", "diabetics"
}

export interface IngredientAnalysis {
    ingredient: Ingredient;
    humanReadableName: string;
    purpose: string; // Why this ingredient exists (preservation, flavor, texture)
    healthImpact: string;
    concerns: HealthConcern[];
    tradeoffs: string; // Why manufacturers use it despite concerns
    alternatives?: string[];
    uncertainty?: UncertaintyInfo;
}

export interface UncertaintyInfo {
    type: UncertaintyType;
    message: string;
    reasoning: string;
    suggestedAction?: string;
}

export interface ReasoningOutput {
    overallVerdict: 'safe' | 'caution' | 'avoid' | 'uncertain';
    verdictConfidence: ConfidenceLevel;
    summary: string; // One-line takeaway
    keyInsights: string[]; // Bullet points of what matters most
    ingredientAnalyses: IngredientAnalysis[];
    overallUncertainty?: UncertaintyInfo;
    contextualGuidance?: string; // e.g., for specific user contexts like pregnancy
}

export interface UserIntent {
    primaryConcern?: ConcernCategory;
    context?: string; // e.g., "pregnancy", "diabetes", "weight loss"
    implicitNeeds: string[]; // Inferred from input
}

export interface UIDirective {
    layout: 'simple-card' | 'detailed-breakdown' | 'warning-first' | 'comparison';
    showAlternatives: boolean;
    showUncertaintyWidget: boolean;
    showIngredientBreakdown: boolean;
    priorityMessage?: string;
}

export interface AnalysisRequest {
    input: string; // Text or base64 encoded image
    inputType: 'text' | 'image';
    userContext?: string;
}

export interface AnalysisResponse {
    reasoning: ReasoningOutput;
    ui: UIDirective;
    processingTime?: number;
}
