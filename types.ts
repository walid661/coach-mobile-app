export interface WorkoutExercise {
    id: string;
    name: string;
    targets: string[];
    reps: number;
    sets: number;
    time: number; // in seconds, mainly for duration-based or rest calculation
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    icon: string;
    description: string;
    body_region?: string;
    content?: string;
    equipment_category?: string;
    metadata?: any;
}

export interface GeneratedSession {
    hypeText: string;
    exercises: WorkoutExercise[];
}
