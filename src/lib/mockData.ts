import { Course, Tenant, User, UserProgress, Category } from '../types';


export const MOCK_TENANTS: Tenant[] = [
    {
        id: 't1',
        name: 'Mare Restaurant Lisbon',
        slug: 'mare-lisbon',
        theme: { primaryColor: '#0ea5e9', secondaryColor: '#0284c7' },
        maxSeats: 50,
        subscriptionStatus: 'active',
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 't2',
        name: 'Mare Restaurant Porto',
        slug: 'mare-porto',
        theme: { primaryColor: '#f59e0b', secondaryColor: '#d97706' },
        maxSeats: 30,
        subscriptionStatus: 'active',
        createdAt: '2024-01-15T00:00:00Z'
    },
    {
        id: 't3',
        name: 'Mare Beach Club',
        slug: 'mare-beach',
        theme: { primaryColor: '#10b981', secondaryColor: '#059669' },
        maxSeats: 100,
        subscriptionStatus: 'trial',
        createdAt: '2024-02-01T00:00:00Z'
    },
];

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@grupomare.com',
        role: 'super_admin',
        tenantId: 't1',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User',
        isActive: true,
        joinedAt: '2024-01-01',
        onboardingCompleted: true,
        preferences: { emailNotifications: true, pushNotifications: true, marketingEmails: false },
        points: 5000,
        streak: 15,
        badges: ['Fast Learner', 'Safe Choice']
    },
    {
        id: 'u2',
        name: 'Manager Lisbon',
        email: 'manager.lisbon@grupomare.com',
        role: 'manager',
        tenantId: 't1',
        avatarUrl: 'https://ui-avatars.com/api/?name=Manager+Lisbon',
        isActive: true,
        joinedAt: '2024-01-02',
        onboardingCompleted: true,
        preferences: { emailNotifications: true, pushNotifications: true, marketingEmails: false },
        points: 3450,
        streak: 8,
        badges: ['Team Leader']
    },
    {
        id: 'u3',
        name: 'João Silva',
        email: 'joao.silva@grupomare.com',
        role: 'employee',
        tenantId: 't1',
        position: 'Cozinheiro',
        avatarUrl: 'https://ui-avatars.com/api/?name=João+Silva',
        isActive: true,
        joinedAt: '2024-01-05',
        onboardingCompleted: false,
        preferences: { emailNotifications: true, pushNotifications: false, marketingEmails: false },
        points: 3200,
        streak: 12,
        badges: ['Hygiene Master']
    },
    {
        id: 'u4',
        name: 'Ana Costa',
        email: 'ana.costa@grupomare.com',
        role: 'employee',
        tenantId: 't1',
        position: 'Empregado de Mesa',
        avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Costa',
        isActive: true,
        joinedAt: '2024-01-10',
        onboardingCompleted: true,
        preferences: { emailNotifications: true, pushNotifications: true, marketingEmails: false },
        points: 2900,
        streak: 5,
        badges: ['Service Star']
    },
    {
        id: 'u5',
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@grupomare.com',
        role: 'employee',
        tenantId: 't2',
        position: 'Cozinheiro',
        avatarUrl: 'https://ui-avatars.com/api/?name=Pedro+Oliveira',
        isActive: true,
        joinedAt: '2024-01-15',
        onboardingCompleted: true,
        preferences: { emailNotifications: true, pushNotifications: false, marketingEmails: false },
        points: 2750,
        streak: 10,
        badges: ['Kitchen Hero']
    },
    {
        id: 'u6',
        name: 'Sofia Martins',
        email: 'sofia.martins@grupomare.com',
        role: 'manager',
        tenantId: 't2',
        avatarUrl: 'https://ui-avatars.com/api/?name=Sofia+Martins',
        isActive: true,
        joinedAt: '2024-01-20',
        onboardingCompleted: true,
        preferences: { emailNotifications: true, pushNotifications: true, marketingEmails: false },
        points: 2600,
        streak: 4
    },
    {
        id: 'u7',
        name: 'Rui Ferreira',
        email: 'rui@grupomare.com',
        role: 'employee',
        tenantId: 't1',
        position: 'Empregado de Mesa',
        avatarUrl: 'https://ui-avatars.com/api/?name=Rui+Ferreira',
        isActive: true,
        joinedAt: '2024-01-25',
        onboardingCompleted: true,
        preferences: { emailNotifications: true, pushNotifications: false, marketingEmails: false },
        points: 2400,
        streak: 7
    }
];


export const MOCK_COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Food Safety Basics',
        description: 'Essential food safety guidelines for all staff.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1000',
        category: 'food_safety',
        durationMinutes: 45,
        isMandatory: true,
        targetRoles: ['employee', 'manager'],
        status: 'published',
        tenantIds: ['t1', 't2', 't3'], // Shared course
        sections: [
            {
                id: 's1',
                title: 'Introduction',
                lessons: [
                    {
                        id: 'l1',
                        title: 'Why Hygiene Matters',
                        type: 'text',
                        content: '<h1>Hygiene is crucial</h1><p>Wash your hands...</p>',
                        durationMinutes: 10,
                        isMandatory: true,
                        isPreview: true
                    }
                ]
            }
        ],
        createdAt: '2024-01-15',
    },
    {
        id: 'c2',
        title: 'Customer Service Excellence',
        description: 'How to provide a 5-star experience to our guests.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=1000',
        category: 'service',
        durationMinutes: 60,
        isMandatory: true,
        targetRoles: ['employee'],
        status: 'published',
        tenantIds: ['t1'], // Private to t1
        sections: [],
        createdAt: '2024-02-01',
    },
    {
        id: 'c3',
        title: 'Inventory Management',
        description: 'Advanced techniques for stock control.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000',
        category: 'management',
        durationMinutes: 90,
        isMandatory: false,
        targetRoles: ['manager'],
        status: 'published',
        tenantIds: ['t1', 't2'],
        sections: [],
        createdAt: '2024-02-10',
    },
    {
        id: 'c4',
        title: 'Wine Pairing Masterclass',
        description: 'Learn to pair wine with our seasonal menu.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1000',
        category: 'beverage',
        durationMinutes: 120,
        isMandatory: false,
        targetRoles: ['employee'],
        status: 'published',
        tenantIds: ['t1', 't2', 't3'],
        sections: [],
        createdAt: '2024-02-15',
    },
    {
        id: 'c5',
        title: 'HACCP Advanced',
        description: 'Advanced hazard analysis and critical control points.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000',
        category: 'food_safety',
        durationMinutes: 180,
        isMandatory: true,
        targetRoles: ['manager'],
        status: 'published',
        tenantIds: ['t1', 't2'],
        sections: [],
        createdAt: '2024-02-20',
    },
    {
        id: 'c6',
        title: 'Upselling Techniques',
        description: 'Increase average check with subtle suggestions.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000',
        category: 'service',
        durationMinutes: 30,
        isMandatory: false,
        targetRoles: ['employee'],
        status: 'published',
        tenantIds: ['t1', 't3'],
        sections: [],
        createdAt: '2024-02-25',
    },
];

export const MOCK_PROGRESS: UserProgress[] = [
    {
        userId: 'u3',
        courseId: 'c1',
        status: 'completed',
        progressPercentage: 100,
        completedLessons: ['l1'],
        score: 95,
        lastAccessedAt: '2024-03-10T10:00:00Z',
    },
    {
        userId: 'u4',
        courseId: 'c1',
        status: 'completed',
        progressPercentage: 100,
        completedLessons: ['l1'],
        score: 88,
        lastAccessedAt: '2024-03-12T10:00:00Z',
    },
    {
        userId: 'u5',
        courseId: 'c1',
        status: 'completed',
        progressPercentage: 100,
        completedLessons: ['l1'],
        score: 92,
        lastAccessedAt: '2024-03-15T10:00:00Z',
    },
    {
        userId: 'u3',
        courseId: 'c2',
        status: 'completed',
        progressPercentage: 100,
        completedLessons: [],
        score: 100,
        lastAccessedAt: '2024-03-11T10:00:00Z',
    },
    {
        userId: 'u4',
        courseId: 'c6',
        status: 'completed',
        progressPercentage: 100,
        completedLessons: [],
        score: 85,
        lastAccessedAt: '2024-03-14T10:00:00Z',
    },
    {
        userId: 'u1',
        courseId: 'c4',
        status: 'completed',
        progressPercentage: 100,
        completedLessons: [],
        score: 98,
        lastAccessedAt: '2024-03-16T10:00:00Z',
    },
    {
        userId: 'u2',
        courseId: 'c5',
        status: 'completed',
        progressPercentage: 100,
        completedLessons: [],
        score: 94,
        lastAccessedAt: '2024-03-17T10:00:00Z',
    }
];

export const INITIAL_CATEGORIES: Category[] = [
    { id: 'food_safety', name: 'Food Safety' },
    { id: 'service', name: 'Customer Service' },
    { id: 'management', name: 'Management' },
    { id: 'beverage', name: 'Beverage' },
    { id: 'culinary', name: 'Culinary' },
    { id: 'compliance', name: 'Compliance' }
];

