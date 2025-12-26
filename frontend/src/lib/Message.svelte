<script lang="ts">
  export let message: {
    id: number;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
  };

  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
</script>

<div class="message {message.sender}">
  <div class="avatar">
    {message.sender === 'user' ? '👤' : '🤖'}
  </div>
  <div class="content">
    <div class="text">{message.text}</div>
    <div class="time">{formatTime(message.timestamp)}</div>
  </div>
</div>

<style>
  .message {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    max-width: 80%;
  }

  .message.user {
    margin-left: auto;
    flex-direction: row-reverse;
  }

  .message.user .content {
    text-align: right;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .message.user .avatar {
    background: #667eea;
  }

  .message.ai .avatar {
    background: #e2e8f0;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .text {
    background: white;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .message.user .text {
    background: #667eea;
    color: white;
  }

  .time {
    font-size: 0.75rem;
    color: #999;
    margin-top: 0.25rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 600px) {
    .message {
      max-width: 90%;
    }
    
    .avatar {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }
    
    .text {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
    }
  }
</style>
