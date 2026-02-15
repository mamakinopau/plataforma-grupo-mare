export type UserRole = 'super_admin' | 'admin' | 'manager' | 'employee';

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export type CourseCategory = string;


export type LessonType = 'video' | 'text' | 'pdf' | 'quiz' | 'presentation';

export interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain?: string; // Custom domain
    logoUrl?: string;
    theme?: {
        primaryColor: string;
        secondaryColor: string;
    };
    maxSeats: number;
    subscriptionStatus: 'active' | 'inactive' | 'trial';
    createdAt: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name
    criteria: string;
    xpReward: number;
}

export interface Level {
    id: number;
    name: string;
    minPoints: number;
    icon: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId: string;
    avatarUrl?: string;
    phone?: string;
    position?: string;

    // Gamification
    points?: number;
    level?: number;
    streak?: number;
    lastLearningDate?: string;
    badges?: string[]; // Badge IDs

    // User Management
    isActive: boolean;
    joinedAt: string;
    lastLoginAt?: string;
    onboardingCompleted: boolean;
    preferences: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        marketingEmails: boolean;
    };
}

export interface Question {
    id: string;
    text: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    options?: string[]; // For MCQ
    correctAnswer: string | number | boolean;
    explanation?: string;
    points: number;
}

export interface QuizConfig {
    passingScore: number;
    maxAttempts?: number;
    timeLimitMinutes?: number;
    questions: Question[];
    randomizeQuestions: boolean;
}

export interface Lesson {
    id: string;
    title: string;
    type: LessonType;
    content: string;
    quizConfig?: QuizConfig;
    durationMinutes: number;
    isMandatory: boolean;
    isPreview: boolean;
}

export interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: CourseCategory;
    durationMinutes: number;
    isMandatory: boolean;
    targetRoles: UserRole[];
    tenantIds?: string[];
    sections: Section[];
    prerequisites?: string[];
    validityMonths?: number;
    createdAt: string;
    updatedAt?: string;
    status: 'draft' | 'published' | 'archived';
}

export interface Certificate {
    id: string;
    userId: string;
    courseId: string;
    courseTitle: string;
    issuedAt: string;
    expiresAt?: string;
    validationCode: string;
    score: number;
}

export interface UserProgress {
    userId: string;
    courseId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    progressPercentage: number;
    completedLessons: string[];
    currentLessonId?: string;
    score?: number;
    quizAttempts?: Record<string, {
        count: number;
        bestScore: number;
        history: { date: string; score: number }[];
    }>;
    lastAccessedAt: string;
    completedAt?: string;
}

// Notifications & Announcements

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type AnnouncementPriority = 'low' | 'medium' | 'high';

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
    link?: string; // Optional link to navigate to
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: AnnouncementPriority;
    targetRoles?: UserRole[];
    targetTenantIds?: string[]; // Empty means all
    authorId: string;
    createdAt: string;
    expiresAt?: string;
    isActive: boolean;
}
