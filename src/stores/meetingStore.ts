import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meeting, MeetingInvitation } from '../types/meeting';
import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';

interface MeetingState {
  meetings: Meeting[];
  invitations: MeetingInvitation[];
  loading: boolean;
  error: string | null;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Meeting>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  scheduleMeeting: (meeting: Omit<Meeting, 'id'>) => Promise<void>;
  sendInvitations: (meetingId: string, userIds: string[]) => void;
  respondToInvitation: (invitationId: string, accept: boolean, message?: string) => void;
  startMeeting: (id: string) => Promise<string>;
  endMeeting: (id: string) => void;
  getMeetingsByUser: (userId: string) => Meeting[];
  getPendingInvitations: (userId: string) => MeetingInvitation[];
  getUpcomingMeetings: () => Meeting[];
}

export const useMeetingStore = create<MeetingState>()(
  persist(
    (set, get) => ({
      meetings: [],
      invitations: [],
      loading: false,
      error: null,

      addMeeting: async (meetingData) => {
        const { settings } = useSettingsStore.getState();
        const { user } = useAuthStore.getState();

        if (!settings.meetings?.enabled) {
          throw new Error('El servicio de videoconferencias está desactivado');
        }

        if (!settings.meetings.allowedRoles.includes(user?.role || '')) {
          throw new Error('No tienes permiso para crear reuniones');
        }

        set({ loading: true, error: null });
        try {
          const meeting: Meeting = {
            id: crypto.randomUUID(),
            ...meetingData,
            status: 'scheduled',
            organizer: user?.id || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set(state => ({
            meetings: [...state.meetings, meeting],
            loading: false
          }));

          return meeting;
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          throw error;
        }
      },

      updateMeeting: (id, updates) => {
        set(state => ({
          meetings: state.meetings.map(meeting =>
            meeting.id === id
              ? { ...meeting, ...updates, updatedAt: new Date().toISOString() }
              : meeting
          )
        }));
      },

      deleteMeeting: (id) => {
        set(state => ({
          meetings: state.meetings.filter(m => m.id !== id),
          invitations: state.invitations.filter(i => i.meetingId !== id)
        }));
      },

      scheduleMeeting: async (meetingData) => {
        const meeting = await get().addMeeting(meetingData);
        get().sendInvitations(meeting.id, meetingData.participants);
      },

      sendInvitations: (meetingId, userIds) => {
        const newInvitations = userIds.map(userId => ({
          id: crypto.randomUUID(),
          meetingId,
          userId,
          status: 'pending' as const,
          sentAt: new Date().toISOString(),
        }));

        set(state => ({
          invitations: [...state.invitations, ...newInvitations]
        }));
      },

      respondToInvitation: (invitationId, accept, message) => {
        set(state => ({
          invitations: state.invitations.map(invitation =>
            invitation.id === invitationId
              ? {
                  ...invitation,
                  status: accept ? 'accepted' : 'declined',
                  responseMessage: message,
                  respondedAt: new Date().toISOString()
                }
              : invitation
          )
        }));
      },

      startMeeting: async (id) => {
        const { settings } = useSettingsStore.getState();
        const meetingUrl = `${settings.meetings?.serverUrl}/${id}`;

        set(state => ({
          meetings: state.meetings.map(meeting =>
            meeting.id === id
              ? {
                  ...meeting,
                  status: 'in_progress',
                  meetingUrl,
                  updatedAt: new Date().toISOString()
                }
              : meeting
          )
        }));

        return meetingUrl;
      },

      endMeeting: (id) => {
        set(state => ({
          meetings: state.meetings.map(meeting =>
            meeting.id === id
              ? {
                  ...meeting,
                  status: 'completed',
                  updatedAt: new Date().toISOString()
                }
              : meeting
          )
        }));
      },

      getMeetingsByUser: (userId) => {
        const { meetings, invitations } = get();
        return meetings.filter(meeting =>
          meeting.organizer === userId ||
          meeting.participants.includes(userId) ||
          invitations.some(i => 
            i.meetingId === meeting.id && 
            i.userId === userId && 
            i.status === 'accepted'
          )
        );
      },

      getPendingInvitations: (userId) => {
        return get().invitations.filter(i => 
          i.userId === userId && 
          i.status === 'pending'
        );
      },

      getUpcomingMeetings: () => {
        const now = new Date();
        return get().meetings
          .filter(meeting => 
            meeting.status === 'scheduled' && 
            new Date(meeting.startTime) > now
          )
          .sort((a, b) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
      },
    }),
    {
      name: 'meeting-storage',
    }
  )
);