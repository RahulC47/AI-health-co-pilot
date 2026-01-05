// API Route for ingredient analysis

import { NextRequest, NextResponse } from 'next/server';
import { analyzeIntent } from '@/lib/intent-analyzer';
import { generateReasoningOutput } from '@/lib/reasoning-engine';
import { determineUILayout } from '@/lib/ui-orchestrator';
import { getMockAnalysis } from '@/lib/data-sources/mock-data';
import { config } from '@/config';
import type { AnalysisRequest, AnalysisResponse } from '@/types';

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const body: AnalysisRequest = await request.json();

        const { input, inputType, userContext } = body;

        if (!input) {
            return NextResponse.json(
                { error: 'Input is required' },
                { status: 400 }
            );
        }

        // Step 1: Analyze user intent
        const intent = analyzeIntent(input, userContext);

        // Step 2: Generate reasoning (use mock data if configured)
        let reasoning;
        let ui;

        if (config.features.useMockData) {
            const mockResult = await getMockAnalysis(body);
            reasoning = mockResult.reasoning;
            ui = mockResult.ui;
        } else {
            reasoning = await generateReasoningOutput(input, intent);
            ui = determineUILayout(reasoning, intent);
        }

        const processingTime = Date.now() - startTime;

        const response: AnalysisResponse = {
            reasoning,
            ui,
            processingTime,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Analysis error:', error);

        return NextResponse.json(
            {
                error: 'Analysis failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
