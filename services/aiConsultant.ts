import { WorkoutExercise } from '../types';
import { supabase } from './supabaseService';

const OPENAI_API_KEY = (process.env.EXPO_PUBLIC_OPENAI_API_KEY || '').trim();

// 1. Translation Layer (Shared Logic - could be extracted to utils)
const translateEquipment = (eq: string) => {
    const map: Record<string, string> = {
        "Poids du corps": "Bodyweight",
        "Haltères uniquement": "Dumbbell",
        "Salle de sport complète": "Full Gym",
        "Haltères": "Dumbbell",
        "Kettlebell": "Kettlebell",
        "Élastique": "Resistance Band",
        "Barre": "Barbell",
        "Banc": "Bench"
    };
    return map[eq] || eq;
};

// 2. Helper: Embed Question
async function createEmbedding(text: string): Promise<number[]> {
    if (!OPENAI_API_KEY) return [];
    try {
        const res = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
            body: JSON.stringify({ model: "text-embedding-3-small", input: text })
        });
        const data = await res.json();
        return data.data?.[0]?.embedding || [];
    } catch (e) {
        console.error("Consultant Embedding Error", e);
        return [];
    }
}

// 3. Helper: Search Vetted Exercises
async function searchKnowledgeBase(embedding: number[]) {
    if (embedding.length === 0) return [];
    try {
        const { data, error } = await supabase.rpc('match_exercises', {
            query_embedding: embedding,
            match_threshold: 0.4, // Matches service threshold
            match_count: 5,
            filter_equipment: [], // Search all for general knowledge
            filter_objective: null
        });

        if (error) throw new Error(error.message);
        return data || [];
    } catch (e) {
        console.error("Knowledge Base Error:", e);
        return [];
    }
}

export async function askCoach(question: string, exercise: WorkoutExercise | null, context: string): Promise<string> {
    console.log("AskCoach:", question);

    if (!OPENAI_API_KEY) return "I need a valid API key, athlete.";

    // 1. RAG Search
    // We translate the question for embedding content? No, user asks in natural language.
    // But if we want to filter by active exercise context, we might use it.
    // For now, simple semantic search is powerful enough.
    const embedding = await createEmbedding(question);
    const knowledge = await searchKnowledgeBase(embedding);

    // 2. Format Context
    const kbContext = knowledge.map((k: any) => `NAME: ${k.name} | CUE: ${k.content} | REGION: ${k.metadata?.body_region || 'General'}`).join('\n');

    const exerciseContext = exercise
        ? `Active Exercise: ${exercise.name}. Description: ${exercise.description}.`
        : "No specific active exercise.";

    // 3. Prompt
    const systemPrompt = `You are Coach Mike, an elite strength coach.
    Global Context: ${context}.
    Immediate Context: ${exerciseContext}
    
    Verified Knowledge Base:
    ${kbContext}

    Your Goal: Answer specific training questions using the Knowledge Base. 
    If the user asks about an exercise, use the 'CUE' from the Knowledge Base.
    Tone: Professional, elite, concise.
    Constraint: Answer in 2 sentences max. If suggesting form, use clinical cues from the Knowledge Base.
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ],
                max_tokens: 100
            })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "Keep pushing.";
    } catch (e) {
        console.error("Coach Error:", e);
        return "Focus on your form.";
    }
}
