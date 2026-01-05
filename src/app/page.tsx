'use client';

import { useState } from 'react';
import AnalysisResult from '@/components/AnalysisResult';
import type { AnalysisResponse } from '@/types';

export default function Home() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: input.trim(),
                    inputType: 'text',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const data: AnalysisResponse = await response.json();
            setResult(data);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const examples = [
        'Water, Sugar, Citric Acid, Natural Flavors',
        'High Fructose Corn Syrup, TBHQ, Red 40, Partially Hydrogenated Oils',
        'Is this safe for pregnancy: Organic Apples, Cane Sugar, Vitamin C',
    ];

    return (
        <div className="container">
            <div className="hero">
                <h1 className="hero-title">Health Co-Pilot</h1>
                <p className="hero-subtitle">
                    Your AI-powered ingredient analyst
                </p>
            </div>

            <div className="input-section">
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <textarea
                            className="input-field"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your ingredient list or ask a question...&#10;&#10;Example: &quot;Water, Sugar, TBHQ, Red 40, Natural Flavors&quot;"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !input.trim()}
                    >
                        {loading ? 'Analyzing...' : 'Analyze Ingredients'}
                    </button>
                </form>

                {!result && !loading && (
                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-sm)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            Try these examples:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            {examples.map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(example)}
                                    className="example-button"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {loading && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Analyzing ingredients and generating insights...</p>
                </div>
            )}

            {error && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-avoid-light)',
                    borderLeft: '4px solid var(--color-avoid)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-avoid)',
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <AnalysisResult
                    reasoning={result.reasoning}
                    ui={result.ui}
                />
            )}
        </div>
    );
}
