export type Role = 'student' | 'technical' | 'admin';
export type ComputerStatus = 'Working' | 'Repair' | 'Unavailable';
export type TicketStatus = 'Open' | 'Pending' | 'In progress' | 'Resolved' | 'Closed';
export type Priority = 'Low' | 'Medium' | 'High';
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    active: boolean;
    studentId?: string;
    notifications: boolean;
    avatar?: string;
}
export interface Lab {
    id: string;
    name: string;
    building: string;
    room: string;
    description: string;
    active: boolean;
}
export interface Computer {
    id: string;
    labId: string;
    name: string;
    status: ComputerStatus;
    processor: string;
    memory: string;
    storage: string;
    peripherals: string;
    notes: string;
}
export interface Ticket {
    id: string;
    labId: string;
    computerId: string;
    category: string;
    priority: Priority;
    description: string;
    photo?: string;
    reporterId: string;
    status: TicketStatus;
    assignee: string;
    createdAt: string;
    updatedAt: string;
    history: {
        date: string;
        by: string;
        message: string;
    }[];
}
export interface Inspection {
    id: string;
    labId: string;
    computerId: string;
    authorId: string;
    monitor: string;
    keyboard: string;
    boot: string;
    network: string;
    notes: string;
    photo?: string;
    createdAt: string;
}
export interface Announcement {
    id: string;
    title: string;
    body: string;
    category: string;
    date: string;
    archived: boolean;
    readBy: string[];
}
export interface MaintenanceRecord {
    id: string;
    computerId: string;
    detail: string;
    date: string;
    status: string;
}
export interface AuditEntry {
    id: string;
    date: string;
    actor: string;
    action: string;
}
export interface Preferences {
    notifications: boolean;
    maintenanceReminders: boolean;
    sessionTimeout: number;
}
export interface AppData {
    users: User[];
    labs: Lab[];
    computers: Computer[];
    tickets: Ticket[];
    inspections: Inspection[];
    announcements: Announcement[];
    maintenance: MaintenanceRecord[];
    audit: AuditEntry[];
    settings: Preferences;
}
