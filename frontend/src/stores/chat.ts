import { writable } from 'svelte/store';

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  sessionId: string | null;
}

const initialState: ChatState = {
  messages: [],
  sessionId: null
};

function createChatStore() {
  const { subscribe, set, update } = writable<ChatState>(initialState);

  return {
    subscribe,
    
    async sendMessage(text: string) {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now(),
        sender: 'user',
        text,
        timestamp: new Date().toISOString()
      };

      update(state => ({
        ...state,
        messages: [...state.messages, userMessage]
      }));

      try {
        const response = await fetch('/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text,
            sessionId: chatStore.getSessionId()
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }

        const data = await response.json();
        
        const aiMessage: ChatMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toISOString()
        };

        update(state => ({
          ...state,
          messages: [...state.messages, aiMessage],
          sessionId: data.sessionId
        }));

      } catch (error) {
        // Remove the user message on error
        update(state => ({
          ...state,
          messages: state.messages.slice(0, -1)
        }));
        throw error;
      }
    },

    async loadHistory(sessionId: string) {
      try {
        const response = await fetch(`/api/chat/history/${sessionId}`);
        
        if (response.ok) {
          const data = await response.json();
          set({
            messages: data.messages,
            sessionId
          });
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    },

    clearMessages() {
      set(initialState);
    },

    getSessionId(): string | null {
      let sessionId: string | null = null;
      subscribe(state => {
        sessionId = state.sessionId;
      })();
      return sessionId;
    }
  };
}

export const chatStore = createChatStore();
