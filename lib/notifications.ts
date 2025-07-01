
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'health' | 'task' | 'alert' | 'system' | 'breeding' | 'production' | 'sensor';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionRequired?: boolean;
  animalId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  expiresAt?: string;
}

interface NotificationState {
  notifications: Notification[];
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    healthAlerts: boolean;
    taskReminders: boolean;
    breedingUpdates: boolean;
    inventoryAlerts: boolean;
    systemUpdates: boolean;
    sensorAlerts: boolean;
  };
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearExpiredNotifications: () => void;
  updateSettings: (settings: Partial<NotificationState['settings']>) => void;
}

export const useNotifications = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 'notif_1',
          type: 'health',
          title: 'Health Alert: Bella',
          message: 'Temperature spike detected. Immediate veterinary attention recommended.',
          priority: 'urgent',
          read: false,
          actionRequired: true,
          animalId: 'animal_1',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'notif_2',
          type: 'task',
          title: 'Vaccination Due',
          message: 'Annual vaccination due for 5 cattle in Pasture A.',
          priority: 'high',
          read: false,
          actionRequired: true,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'notif_3',
          type: 'sensor',
          title: 'Sensor Battery Low',
          message: 'Activity tracker for Luna needs battery replacement.',
          priority: 'medium',
          read: false,
          actionRequired: true,
          animalId: 'animal_3',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        }
      ],
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        healthAlerts: true,
        taskReminders: true,
        breedingUpdates: true,
        inventoryAlerts: true,
        systemUpdates: false,
        sensorAlerts: true,
      },

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }));

        // Trigger browser notification if enabled
        const { settings } = get();
        if (settings.pushNotifications && notificationData.priority === 'urgent') {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notificationData.title, {
              body: notificationData.message,
              icon: '/favicon.ico',
              tag: newNotification.id,
            });
          }
        }
      },

      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        }));
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification => ({ ...notification, read: true }))
        }));
      },

      deleteNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(notification => notification.id !== id)
        }));
      },

      clearExpiredNotifications: () => {
        const now = new Date();
        set(state => ({
          notifications: state.notifications.filter(notification => {
            if (!notification.expiresAt) return true;
            return new Date(notification.expiresAt) > now;
          })
        }));
      },

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
    }),
    {
      name: 'notification-storage',
      version: 1,
    }
  )
);

// Helper functions for creating notifications
export const createHealthAlert = (animalId: string, title: string, message: string, priority: Notification['priority'] = 'high') => {
  const { addNotification, settings } = useNotifications.getState();
  
  if (settings.healthAlerts) {
    addNotification({
      type: 'health',
      title,
      message,
      priority,
      read: false,
      actionRequired: true,
      animalId,
    });
  }
};

export const createTaskReminder = (title: string, message: string, priority: Notification['priority'] = 'medium') => {
  const { addNotification, settings } = useNotifications.getState();
  
  if (settings.taskReminders) {
    addNotification({
      type: 'task',
      title,
      message,
      priority,
      read: false,
      actionRequired: true,
    });
  }
};

export const createSensorAlert = (animalId: string, title: string, message: string, priority: Notification['priority'] = 'medium') => {
  const { addNotification, settings } = useNotifications.getState();
  
  if (settings.sensorAlerts) {
    addNotification({
      type: 'sensor',
      title,
      message,
      priority,
      read: false,
      actionRequired: true,
      animalId,
    });
  }
};

export const createInventoryAlert = (title: string, message: string, priority: Notification['priority'] = 'medium') => {
  const { addNotification, settings } = useNotifications.getState();
  
  if (settings.inventoryAlerts) {
    addNotification({
      type: 'alert',
      title,
      message,
      priority,
      read: false,
      actionRequired: true,
    });
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};
