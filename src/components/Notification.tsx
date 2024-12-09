import React, { useEffect } from 'react';
import { toast, ToastOptions } from 'react-hot-toast';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const options: ToastOptions = {
    duration: 3000,
    position: 'top-right',
    style: {
      background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  };

  useEffect(() => {
    toast(message, options);
  }, [message, type]);

  return null;
};

export default Notification;

