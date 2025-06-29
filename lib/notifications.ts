import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'health' | 'task' | 'alert' | 'system' | 'breeding';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  createdAt: string;
  animalId?: string;
  actionRequired?: boolean;
  emailSent?: boolean;
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
  };
  
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationState['settings']>) => void;
  sendEmailNotification: (notification: Notification) => Promise<boolean>;
}

export const useNotifications = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: '1',
          type: 'health',
          title: 'Health Alert: Bella',
          message: 'Temperature spike detected. Immediate veterinary attention recommended.',
          priority: 'urgent',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          animalId: 'animal_1',
          actionRequired: true,
        },
        {
          id: '2',
          type: 'task',
          title: 'Vaccination Due',
          message: 'Annual vaccination due for 5 cattle in Pasture A.',
          priority: 'high',
          read: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          actionRequired: true,
        },
      ],
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        healthAlerts: true,
        taskReminders: true,
        breedingUpdates: true,
        inventoryAlerts: true,
        systemUpdates: false,
      },

      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          notifications: [notification, ...state.notifications]
        }));

        // Send email if enabled
        const { settings, sendEmailNotification } = get();
        if (settings.emailNotifications && shouldSendEmail(notification, settings)) {
          sendEmailNotification(notification);
        }
      },

      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      },

      deleteNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      sendEmailNotification: async (notification) => {
        try {
          // Simulate email sending
          console.log('Sending email notification:', notification);
          
          // In a real app, this would call an email service
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            notifications: state.notifications.map(n => 
              n.id === notification.id ? { ...n, emailSent: true } : n
            )
          }));
          
          return true;
        } catch (error) {
          console.error('Failed to send email notification:', error);
          return false;
        }
      },
    }),
    {
      name: 'agroinsight-notifications',
      version: 1,
    }
  )
);

function shouldSendEmail(notification: Notification, settings: NotificationState['settings']): boolean {
  switch (notification.type) {
    case 'health':
      return settings.healthAlerts;
    case 'task':
      return settings.taskReminders;
    case 'breeding':
      return settings.breedingUpdates;
    case 'alert':
      return settings.inventoryAlerts;
    case 'system':
      return settings.systemUpdates;
    default:
      return false;
  }
}