import React, { useState } from 'react';
import { NotificationPreferences, NotificationCategory, NotificationSetting } from '../types';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  Monitor,
  ChevronDown,
  ChevronUp,
  Settings,
  Clock,
  Volume2,
  VolumeX,
  Save,
  RotateCcw,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onUpdatePreferences: (preferences: NotificationPreferences) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  onUpdatePreferences
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [hasChanges, setHasChanges] = useState(false);

  const handleGlobalSettingChange = (setting: string, value: any) => {
    const updatedPreferences = {
      ...preferences,
      globalSettings: {
        ...preferences.globalSettings,
        [setting]: value
      }
    };
    onUpdatePreferences(updatedPreferences);
    setHasChanges(true);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const updatedCategories = preferences.categories.map(category =>
      category.id === categoryId
        ? { ...category, isExpanded: !category.isExpanded }
        : category
    );
    
    onUpdatePreferences({
      ...preferences,
      categories: updatedCategories
    });
  };

  const handleNotificationToggle = (categoryId: string, notificationId: string) => {
    const updatedCategories = preferences.categories.map(category => {
      if (category.id === categoryId) {
        const updatedNotifications = category.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isEnabled: !notification.isEnabled }
            : notification
        );
        return { ...category, notifications: updatedNotifications };
      }
      return category;
    });

    onUpdatePreferences({
      ...preferences,
      categories: updatedCategories
    });
    setHasChanges(true);
  };

  const handleChannelToggle = (categoryId: string, notificationId: string, channel: string) => {
    const updatedCategories = preferences.categories.map(category => {
      if (category.id === categoryId) {
        const updatedNotifications = category.notifications.map(notification => {
          if (notification.id === notificationId) {
            return {
              ...notification,
              channels: {
                ...notification.channels,
                [channel]: !notification.channels[channel as keyof typeof notification.channels]
              }
            };
          }
          return notification;
        });
        return { ...category, notifications: updatedNotifications };
      }
      return category;
    });

    onUpdatePreferences({
      ...preferences,
      categories: updatedCategories
    });
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Simulate API call
    console.log('Saving notification preferences:', preferences);
    setHasChanges(false);
    // Show success message
  };

  const handleResetToDefaults = () => {
    // Reset to default preferences
    setHasChanges(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertTriangle;
      case 'high': return Zap;
      case 'medium': return Info;
      case 'low': return CheckCircle;
      default: return Info;
    }
  };

  const filteredCategories = preferences.categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.notifications.some(notification => 
        notification.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesPriority = filterPriority === 'all' || 
      category.notifications.some(notification => notification.priority === filterPriority);
    
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure how and when you receive alerts and updates from the platform. 
          Customize your notification preferences to stay informed without being overwhelmed.
        </p>
      </div>

      {/* Global Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Global Settings</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Channels */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive updates in your email inbox</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.globalSettings.emailEnabled}
                    onChange={(e) => handleGlobalSettingChange('emailEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Push Notifications</div>
                    <div className="text-sm text-gray-600">Get instant alerts on your device</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.globalSettings.pushEnabled}
                    onChange={(e) => handleGlobalSettingChange('pushEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">SMS Notifications</div>
                    <div className="text-sm text-gray-600">Receive critical alerts via SMS</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.globalSettings.smsEnabled}
                    onChange={(e) => handleGlobalSettingChange('smsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="font-medium text-gray-900">In-App Notifications</div>
                    <div className="text-sm text-gray-600">Show notifications within the app</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.globalSettings.inAppEnabled}
                    onChange={(e) => handleGlobalSettingChange('inAppEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              {/* Quiet Hours */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Quiet Hours</div>
                      <div className="text-sm text-gray-600">Pause notifications during specific hours</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.globalSettings.quietHours.enabled}
                      onChange={(e) => handleGlobalSettingChange('quietHours', {
                        ...preferences.globalSettings.quietHours,
                        enabled: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {preferences.globalSettings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                      <input
                        type="time"
                        value={preferences.globalSettings.quietHours.startTime}
                        onChange={(e) => handleGlobalSettingChange('quietHours', {
                          ...preferences.globalSettings.quietHours,
                          startTime: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                      <input
                        type="time"
                        value={preferences.globalSettings.quietHours.endTime}
                        onChange={(e) => handleGlobalSettingChange('quietHours', {
                          ...preferences.globalSettings.quietHours,
                          endTime: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Frequency */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Notification Frequency</div>
                    <div className="text-sm text-gray-600">How often to receive notifications</div>
                  </div>
                </div>
                <select
                  value={preferences.globalSettings.frequency}
                  onChange={(e) => handleGlobalSettingChange('frequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly Digest</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notification categories or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Category Header */}
            <div 
              className="p-6 border-b border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              onClick={() => handleCategoryToggle(category.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {category.notifications.filter(n => n.isEnabled).length} of {category.notifications.length} enabled
                  </span>
                  {category.isCollapsible && (
                    category.isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Category Content */}
            {category.isExpanded && (
              <div className="p-6">
                <div className="space-y-4">
                  {category.notifications
                    .filter(notification => 
                      notification.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      (filterPriority === 'all' || notification.priority === filterPriority)
                    )
                    .map((notification) => {
                      const PriorityIcon = getPriorityIcon(notification.priority);
                      
                      return (
                        <div key={notification.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-gray-900">{notification.name}</h4>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                                  <PriorityIcon className="h-3 w-3 mr-1" />
                                  {notification.priority.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input
                                type="checkbox"
                                checked={notification.isEnabled}
                                onChange={() => handleNotificationToggle(category.id, notification.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          {/* Channel Settings */}
                          {notification.isEnabled && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm text-gray-700">Email</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={notification.channels.email}
                                    onChange={() => handleChannelToggle(category.id, notification.id, 'email')}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Smartphone className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-gray-700">Push</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={notification.channels.push}
                                    onChange={() => handleChannelToggle(category.id, notification.id, 'push')}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <MessageSquare className="h-4 w-4 text-purple-600" />
                                  <span className="text-sm text-gray-700">SMS</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={notification.channels.sms}
                                    onChange={() => handleChannelToggle(category.id, notification.id, 'sms')}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Monitor className="h-4 w-4 text-indigo-600" />
                                  <span className="text-sm text-gray-700">In-App</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={notification.channels.inApp}
                                    onChange={() => handleChannelToggle(category.id, notification.id, 'inApp')}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">You have unsaved changes</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleResetToDefaults}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Defaults</span>
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;