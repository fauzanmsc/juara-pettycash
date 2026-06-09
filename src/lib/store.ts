import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
}

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'date'>) => void;
  markAsRead: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  notifications: [
    {
      id: '1',
      title: 'Approval Pending',
      message: 'Pengajuan dana PJD-20260609-001 menunggu persetujuan Anda.',
      read: false,
      date: new Date().toISOString(),
    },
  ],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Math.random().toString(36).substring(7),
          read: false,
          date: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
}));
