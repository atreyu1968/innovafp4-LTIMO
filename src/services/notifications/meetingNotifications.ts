import { Meeting } from '../../types/meeting';
import { User } from '../../types/user';
import { sendEmail } from '../email';
import { useMessageStore } from '../../stores/messageStore';

export const notifyMeetingInvitation = async (meeting: Meeting, user: User) => {
  try {
    await sendEmail({
      to: user.email,
      subject: `Invitación a reunión: ${meeting.title}`,
      html: `
        <h1>Has sido invitado a una reunión</h1>
        <p><strong>Título:</strong> ${meeting.title}</p>
        <p><strong>Fecha:</strong> ${new Date(meeting.startTime).toLocaleString()}</p>
        <p><strong>Duración:</strong> ${
          Math.round((new Date(meeting.endTime).getTime() - new Date(meeting.startTime).getTime()) / 1000 / 60)
        } minutos</p>
      `
    });

    // También enviar notificación interna
    const { addMessage } = useMessageStore.getState();
    addMessage({
      senderId: meeting.organizer,
      recipientId: user.id,
      content: `Has sido invitado a la reunión "${meeting.title}" el ${new Date(meeting.startTime).toLocaleString()}`
    });
  } catch (error) {
    console.error('Error sending meeting notification:', error);
  }
};