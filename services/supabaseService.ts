import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../store/useUserStore';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function saveUserProfile(userId: string, profile: UserProfile) {
    const { error } = await supabase.from('user_profiles').upsert({
        user_id: userId,
        level: profile.niveau_sportif,
        goal: profile.objectif_principal,
        equipment: profile.equipment_disponible, // JSONB
    });

    if (error) {
        console.error("Error saving profile:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function saveProgram(userId: string, title: string, programMarkdown: string) {
    const { error } = await supabase.from('saved_programs').insert({
        user_id: userId,
        title: title,
        program_data: { markdown: programMarkdown }, // JSONB
        status: 'active'
    });

    if (error) {
        console.error("Error saving program:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}
