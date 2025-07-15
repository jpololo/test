import { NotificationPreferences, NotificationCategory } from '../types';

export const mockNotificationPreferences: NotificationPreferences = {
  userId: 'user-001',
  globalSettings: {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    inAppEnabled: true,
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '08:00'
    },
    frequency: 'immediate'
  },
  categories: [
    {
      id: 'warehouse-orders',
      name: 'Warehouse Orders',
      description: 'Notifications related to warehouse order management and updates',
      icon: '📦',
      isCollapsible: true,
      isExpanded: true,
      notifications: [
        {
          id: 'warehouse-order-shipping-update',
          name: 'Warehouse Order Need Update Shipping',
          description: 'Get notified when warehouse orders require shipping updates',
          categoryId: 'warehouse-orders',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'high'
        },
        {
          id: 'warehouse-order-approval',
          name: 'Warehouse Order Need Approval',
          description: 'Receive alerts when warehouse orders require approval',
          categoryId: 'warehouse-orders',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'high'
        },
        {
          id: 'warehouse-order-rejected',
          name: 'Warehouse Order Rejected',
          description: 'Get notified when warehouse orders are rejected',
          categoryId: 'warehouse-orders',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'warehouse-order-approved',
          name: 'Warehouse Order Approved',
          description: 'Receive confirmation when warehouse orders are approved',
          categoryId: 'warehouse-orders',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'warehouse-order-paid',
          name: 'Warehouse Order Has Been Paid',
          description: 'Get notified when warehouse orders have been paid',
          categoryId: 'warehouse-orders',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'warehouse-order-change',
          name: 'Warehouse Order Requires Change',
          description: 'Receive alerts when warehouse orders need modifications',
          categoryId: 'warehouse-orders',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'high'
        }
      ]
    },
    {
      id: 'items',
      name: 'Items',
      description: 'Notifications about item changes and approvals',
      icon: '📋',
      isCollapsible: true,
      isExpanded: false,
      notifications: [
        {
          id: 'item-change-approval',
          name: 'Item change of a Item Requires Approval',
          description: 'Get notified when item changes need approval',
          categoryId: 'items',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'item-stock-low',
          name: 'Low Stock Alert',
          description: 'Receive alerts when item stock is running low',
          categoryId: 'items',
          channels: { email: true, push: false, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'item-price-change',
          name: 'Item Price Change',
          description: 'Get notified when item prices are updated',
          categoryId: 'items',
          channels: { email: true, push: false, sms: false, inApp: true },
          isEnabled: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'quotes',
      name: 'Quotes',
      description: 'Quote-related notifications and updates',
      icon: '💰',
      isCollapsible: true,
      isExpanded: false,
      notifications: [
        {
          id: 'new-quote-assigned',
          name: 'New Quote Request Assigned',
          description: 'Get notified when new quote requests are assigned to you',
          categoryId: 'quotes',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'high'
        },
        {
          id: 'new-quote-request',
          name: 'New Request Quote',
          description: 'Receive alerts for new quote requests',
          categoryId: 'quotes',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'high'
        },
        {
          id: 'quote-internal-approval',
          name: 'Quote Needs Internal Approval',
          description: 'Get notified when quotes require internal approval',
          categoryId: 'quotes',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'high'
        },
        {
          id: 'quote-approved',
          name: 'Quote has been approved',
          description: 'Receive confirmation when quotes are approved',
          categoryId: 'quotes',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'quote-expired',
          name: 'Quote Expired',
          description: 'Get notified when quotes expire',
          categoryId: 'quotes',
          channels: { email: true, push: false, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        }
      ]
    },
    {
      id: 'invitations',
      name: 'Invitations',
      description: 'Company and team invitation notifications',
      icon: '✉️',
      isCollapsible: true,
      isExpanded: false,
      notifications: [
        {
          id: 'company-invitation-sent',
          name: 'Company Invitation Sent',
          description: 'Get notified when company invitations are sent',
          categoryId: 'invitations',
          channels: { email: true, push: false, sms: false, inApp: true },
          isEnabled: true,
          priority: 'low'
        },
        {
          id: 'invitation-accepted',
          name: 'Invitation Accepted',
          description: 'Receive alerts when invitations are accepted',
          categoryId: 'invitations',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'invitation-declined',
          name: 'Invitation Declined',
          description: 'Get notified when invitations are declined',
          categoryId: 'invitations',
          channels: { email: true, push: false, sms: false, inApp: true },
          isEnabled: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'projects',
      name: 'Projects',
      description: 'Project management and milestone notifications',
      icon: '🚀',
      isCollapsible: true,
      isExpanded: false,
      notifications: [
        {
          id: 'project-created',
          name: 'Project Created',
          description: 'Get notified when new projects are created',
          categoryId: 'projects',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'project-milestone',
          name: 'Project Milestone Reached',
          description: 'Receive alerts when project milestones are reached',
          categoryId: 'projects',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        },
        {
          id: 'project-deadline',
          name: 'Project Deadline Approaching',
          description: 'Get notified when project deadlines are approaching',
          categoryId: 'projects',
          channels: { email: true, push: true, sms: true, inApp: true },
          isEnabled: true,
          priority: 'high'
        },
        {
          id: 'project-completed',
          name: 'Project Completed',
          description: 'Receive confirmation when projects are completed',
          categoryId: 'projects',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'medium'
        }
      ]
    },
    {
      id: 'system',
      name: 'System',
      description: 'System maintenance and security notifications',
      icon: '⚙️',
      isCollapsible: true,
      isExpanded: false,
      notifications: [
        {
          id: 'system-maintenance',
          name: 'System Maintenance',
          description: 'Get notified about scheduled system maintenance',
          categoryId: 'system',
          channels: { email: true, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'high'
        },
        {
          id: 'security-alert',
          name: 'Security Alert',
          description: 'Receive critical security notifications',
          categoryId: 'system',
          channels: { email: true, push: true, sms: true, inApp: true },
          isEnabled: true,
          priority: 'critical'
        },
        {
          id: 'system-update',
          name: 'System Update Available',
          description: 'Get notified when system updates are available',
          categoryId: 'system',
          channels: { email: false, push: true, sms: false, inApp: true },
          isEnabled: true,
          priority: 'low'
        }
      ]
    }
  ]
};