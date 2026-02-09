import { supabase } from './supabaseService';
import { UserProfile } from '../store/useUserStore';
import { GeneratedSession } from '../types';

// Environment Variables
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() || '';

// --- 1. COUCHE DE TRADUCTION ROBUSTE (INSENSIBLE À LA CASSE) ---

const translateEquipment = (eq: string | null | undefined): string | null => {
    // Nettoyage : minuscule et sans espaces superflus
    const cleanEq = (eq || "").trim().toLowerCase();

    // Mapping strict (Clé normalisée -> Valeur DB)
    const map: Record<string, string> = {
        // Français
        "poids du corps": "Bodyweight",
        "haltères uniquement": "Dumbbell",
        "haltères": "Dumbbell",
        "kettlebell": "Kettlebell",
        "élastique": "Resistance Band",
        "barre": "Barbell",
        "banc": "Bench",
        // Cas spéciaux "Full Gym" (Déclencheurs de NULL)
        "salle de sport complète": "FULL_GYM",
        "full gym": "FULL_GYM",
        "full gym access": "FULL_GYM",
        // Au cas où l'anglais arrive directement
        "bodyweight": "Bodyweight",
        "dumbbell": "Dumbbell"
    };

    const result = map[cleanEq] || null;

    // Si "FULL_GYM" ou pas trouvé, on renvoie null pour tout accepter
    return result === "FULL_GYM" ? null : result;
};

const translateGoal = (goal: string | null | undefined): string | null => {
    const cleanGoal = (goal || "").trim().toLowerCase();

    const map: Record<string, string> = {
        // Mappings exacts
        "perte de poids": "Cardio Blast",
        "prise de muscle": "Body Enforcement",
        "prise de masse": "Body Enforcement", // Ajout critique
        "force": "Body Enforcement",
        "hiit": "HIIT",
        "cardio": "HIIT", // Ou Cardio Blast selon préférence
        "yoga": "Yoga & Mobility",
        "mobilité": "Yoga & Mobility",
        "mobility": "Yoga & Mobility",
        "santé": "Yoga & Mobility"
    };

    const result = map[cleanGoal];
    // Si "General", vide ou inconnu -> null pour désactiver le filtre
    return result || null;
};

const translateLevel = (level: string | null | undefined): string => {
    const cleanLevel = (level || "").trim().toLowerCase();

    // Détection par mot-clé pour être plus souple
    if (cleanLevel.includes("débutant") || cleanLevel.includes("beginner")) return "Beginner";
    if (cleanLevel.includes("avancé") || cleanLevel.includes("advanced") || cleanLevel.includes("expert")) return "Advanced";

    // Fallback de sécurité : Intermédiaire (car c'est le plus commun en DB)
    return "Intermediate";
};

// 2. Helper to Create Embeddings (OpenAI via Fetch)
async function createEmbedding(text: string): Promise<number[]> {
    if (!OPENAI_API_KEY) throw new Error("Missing OpenAI API Key");

    try {
        console.log("Embedding: Fetching...");

        // Use Promise.race for timeout
        const timeout = 10000;
        const fetchPromise = fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "text-embedding-3-small",
                input: text
            })
        });

        const response = await Promise.race([
            fetchPromise,
            new Promise<Response>((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeout)
            )
        ]);

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.data[0].embedding;
    } catch (e) {
        console.error("Embedding Error:", e);
        throw e;
    }
}

// --- 2. FONCTION DE RÉCUPÉRATION RAG (HANDSHAKE AVEC SUPABASE) ---

async function fetchVettedExercises(profile: UserProfile) {
    // 1. Traduction des entrées UI vers le vocabulaire DB
    // On utilise ?. pour éviter les crashs si profile est incomplet
    const rawEquip = profile.equipment_disponible?.[0] || "";
    const rawGoal = profile.objectif_principal || "";
    const rawLevel = profile.niveau_sportif || "";

    const engEquip = translateEquipment(rawEquip); // ex: "Dumbbell" ou null
    const engGoal = translateGoal(rawGoal);        // ex: "Body Enforcement" ou null
    const engLevel = translateLevel(rawLevel);     // ex: "Intermediate"

    console.log(`RAG Params Translated -> Level: ${engLevel}, Goal: ${engGoal}, Equip: ${engEquip}`);

    // 2. Construction de la requête sémantique
    // On utilise des termes par défaut pour le texte, mais null pour le filtre SQL
    const textGoal = engGoal || "fitness";
    const textEquip = engEquip || "gym equipment";

    const queryText = `A ${engLevel} exercise for ${textGoal} using ${textEquip}.`;

    // 3. Génération de l'embedding (Vecteur)
    const embedding = await createEmbedding(queryText);
    if (!embedding) {
        console.error("Failed to generate embedding");
        return [];
    }

    // 4. Appel RPC Supabase (Antigravity Search)
    // 4. Appel RPC Supabase (Antigravity Search)
    let { data, error } = await supabase.rpc('match_exercises', {
        query_embedding: embedding,
        match_threshold: 0.20,      // Seuil tolérant pour avoir des résultats
        match_count: 20,            // Assez pour que l'IA ait du choix
        filter_level: engLevel,     // Toujours strict (Beginner/Intermediate/Advanced)
        filter_equipment: engEquip, // Envoie null si "Full Gym"
        filter_objective: engGoal   // Envoie null si "General"
    });

    if (error) {
        console.error("Supabase RPC Error:", error.message);
        return [];
    }

    // --- FALLBACK LOGIC ---
    // Si aucun résultat, on essaie d'élargir la recherche (Relax Goal)
    if (!data || data.length === 0) {
        console.warn("RAG: 0 results found with strict filters. Retrying with relaxed GOAL...");
        const retry1 = await supabase.rpc('match_exercises', {
            query_embedding: embedding,
            match_threshold: 0.18,      // Légèrement plus tolérant
            match_count: 20,
            filter_level: engLevel,     // Keep Level strict
            filter_equipment: engEquip, // Keep Equip strict
            filter_objective: null      // RELAX GOAL
        });

        if (!retry1.error && retry1.data && retry1.data.length > 0) {
            console.log(`RAG Retry 1 Success: Found ${retry1.data.length} exercises.`);
            return retry1.data;
        }

        // Si toujours rien, on relaxe AUSSI l'équipement (dernier recours)
        console.warn("RAG: Still 0 results. Retrying with relaxed GOAL + EQUIPMENT...");
        const retry2 = await supabase.rpc('match_exercises', {
            query_embedding: embedding,
            match_threshold: 0.15,      // Très tolérant
            match_count: 20,
            filter_level: engLevel,     // Keep Level strict (safety)
            filter_equipment: null,     // RELAX EQUIP
            filter_objective: null      // RELAX GOAL
        });

        if (!retry2.error && retry2.data) {
            console.log(`RAG Retry 2 Success: Found ${retry2.data.length} exercises.`);
            return retry2.data;
        }
    }

    console.log(`RAG Results: Found ${data?.length || 0} exercises.`);
    return data || [];
}

export async function generateWorkout(profile: UserProfile): Promise<GeneratedSession> {
    console.log("Starting Hybrid RAG Generation...");

    let vettedExercises: any[] = [];
    try {
        vettedExercises = await fetchVettedExercises(profile);
    } catch (error) {
        console.error("RAG Failed:", error);
        return { hypeText: "System Error: Could not retrieve exercises.", exercises: [] };
    }

    if (!vettedExercises || vettedExercises.length === 0) {
        console.warn("No vetted exercises found.");
        return { hypeText: "No specific exercises found for this criteria.", exercises: [] };
    }

    const libraryContext = vettedExercises.map((e: any) =>
        `NAME: ${e.name} | REGION: ${e.metadata?.body_region || e.body_region || 'General'} | TARGET: ${e.metadata?.targets?.[0] || e.targets?.[0] || 'Body'}`
    ).join('\n');

    const engGoal = translateGoal(profile.objectif_principal || "General") || "General Fitness";

    // Use gpt-4o for complex grouping and homogeneous session generation
    try {
        console.log("LLM: Generating workout JSON...");

        const timeout = 45000;
        const fetchPromise = fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are Coach Mike. Build a workout using the Library. Output JSON: { hypeText: string, exercises: [] }" },
                    { role: "user", content: `Library:\n${libraryContext}\n\nGoal: ${engGoal}` }
                ],
                response_format: { type: "json_object" }
            })
        });

        const response = await Promise.race([
            fetchPromise,
            new Promise<Response>((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeout)
            )
        ]);

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const content = data.choices[0].message.content;
        const result = JSON.parse(content);
        if (!result.exercises) result.exercises = [];

        // Sanitize exercises to prevent UI crashes
        result.exercises = result.exercises.map((ex: any) => ({
            ...ex,
            targets: ex.targets || [], // Ensure array
            name: ex.name || "Unknown Exercise",
            reps: ex.reps || 10,
            sets: ex.sets || 3,
            time: ex.time || 45,
            description: ex.description || "No description provided."
        }));

        return result as GeneratedSession;

    } catch (e) {
        console.error("Generation Error:", e);
        return { hypeText: "Error generating workout.", exercises: [] };
    }
}
