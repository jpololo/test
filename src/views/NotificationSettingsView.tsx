import React, { useState } from 'react';
import NotificationSettings from '../components/NotificationSettings';
import { mockNotificationPreferences } from '../data/mockNotificationData';
import { NotificationPreferences } from '../types';

const NotificationSettingsView: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(mockNotificationPreferences);

  const handleUpdatePreferences = (updatedPreferences: NotificationPreferences) => {
    setPreferences(updatedPreferences);
    // In a real app, this would make an API call to save the preferences
    console.log('Updated notification preferences:', updatedPreferences);
  };

  return (
    <NotificationSettings
      preferences={preferences}
      onUpdatePreferences={handleUpdatePreferences}
    />
  );
};

export default NotificationSettingsView;