import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Meeting, MeetingType, MeetingRecurrence } from '../../types/meeting';
import { useUserStore } from '../../stores/userStore';
import { useMeetingStore } from '../../stores/meetingStore';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

const MeetingForm: React.FC<{
  initialData?: Meeting | null;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({ initialData, onSubmit, onCancel }) => {
  const { user } = useAuthStore();
  const { users } = useUserStore();
  const { scheduleMeeting } = useMeetingStore();
  const { settings } = useSettingsStore();
  const { showNotification } = useNotifications();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'subred' as MeetingType,
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    participants: initialData?.participants || [],
    agenda: initialData?.agenda || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      // Validar duración
      const duration = (new Date(formData.endTime).getTime() - new Date(formData.startTime).getTime()) / 1000 / 60;
      if (duration > settings.meetings?.maxDuration!) {
        throw new Error(`La duración máxima permitida es de ${settings.meetings?.maxDuration} minutos`);
      }

      // Validar participantes
      if (formData.participants.length > settings.meetings?.maxParticipants!) {
        throw new Error(`El máximo de participantes permitido es ${settings.meetings?.maxParticipants}`);
      }

      await scheduleMeeting({
        ...formData,
        organizer: user.id,
      });

      showNotification('success', 'Reunión programada correctamente');
      onSubmit();
    } catch (error) {
      showNotification('error', (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... rest of the component remains the same ... */}
    </form>
  );
};

export default MeetingForm;