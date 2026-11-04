import { AppData, Computer, Lab, Ticket } from './models';
export function freshData(): AppData {
    const users = [
        { id: 'U001', name: 'Rhandell B.', email: 'student@plv.edu.ph', password: 'Student123!', role: 'student' as const, active: true, studentId: '2026-0001', notifications: true },
        { id: 'U002', name: 'Technical Rep 01', email: 'tech@plv.edu.ph', password: 'Tech123!', role: 'technical' as const, active: true, notifications: true },
        { id: 'U003', name: 'Admin User', email: 'admin@plv.edu.ph', password: 'Admin123!', role: 'admin' as const, active: true, notifications: true }
    ];
    const labs: Lab[] = Array.from({ length: 8 }, (_, i) => ({ id: `LAB-${String(i + 1).padStart(2, '0')}`, name: `Computer Lab ${String(i + 1).padStart(2, '0')}`, building: i < 4 ? 'CEIT Building' : 'Main Building', room: `Room ${201 + i}`, description: 'Computer laboratory for student practical sessions', active: true }));
    const computers: Computer[] = [];
    labs.forEach((lab, li) => {
        const count = [32, 28, 30, 26, 24, 24, 20, 24][li];
        for (let i = 1; i <= count; i++) {
            let status: Computer['status'] = 'Working';
            if (li === 0) {
                status = [4, 13, 21, 26, 30].includes(i) ? 'Repair' : [6, 18, 31].includes(i) ? 'Unavailable' : 'Working';
            }
            else {
                status = i % 13 === 0 ? 'Unavailable' : i % 7 === 0 ? 'Repair' : 'Working';
            }
            const id = `${lab.id}-PC-${String(i).padStart(2, '0')}`;
            computers.push({ id, labId: lab.id, name: `PC-${String(i).padStart(2, '0')}`, status, processor: 'Intel Core i5', memory: '8 GB RAM', storage: '256 GB SSD', peripherals: 'Monitor, keyboard, mouse', notes: '' });
        }
    });
    const now = new Date().toISOString();
    const mk = (id: string, computerId: string, category: string, status: Ticket['status'], priority: Ticket['priority']): Ticket => ({ id, labId: computers.find(c => c.id === computerId)?.labId || 'LAB-01', computerId, category, priority, status, description: `Observed ${category.toLowerCase()} during computer use.`, reporterId: 'U002', assignee: 'Unassigned', createdAt: now, updatedAt: now, history: [{ date: now, by: 'Technical Rep 01', message: 'Issue reported' }] });
    const tickets = [mk('TK-104', 'LAB-01-PC-08', 'No display', 'Pending', 'High'), mk('TK-103', 'LAB-01-PC-13', 'Keyboard issue', 'In progress', 'Medium'), mk('TK-102', 'LAB-03-PC-07', 'Network issue', 'Open', 'High')];
    return { users, labs, computers, tickets, inspections: [], announcements: [
            { id: 'ANN-01', title: 'Scheduled maintenance', body: 'Computer Lab 03 will undergo scheduled maintenance tomorrow.', category: 'Maintenance', date: now, archived: false, readBy: [] },
            { id: 'ANN-02', title: 'Lab access reminder', body: 'Please bring your student ID when accessing PLV computer laboratories.', category: 'Reminder', date: now, archived: false, readBy: [] },
            { id: 'ANN-03', title: 'Lab schedule update', body: 'Laboratory schedules are available at the department office.', category: 'Schedule', date: now, archived: false, readBy: [] }
        ], maintenance: [{ id: 'MT-01', computerId: 'LAB-01-PC-04', detail: 'Equipment referred for maintenance assessment', date: now, status: 'Pending external service' }], audit: [{ id: 'LOG-01', date: now, actor: 'System', action: 'Demo dataset initialized' }], settings: { notifications: true, maintenanceReminders: true, sessionTimeout: 30 } };
}
