<script lang="ts">
  import { onMount } from 'svelte';
  import Message from './Message.svelte';
  import { chatStore } from '../stores/chat';

  let messageInput = '';
  let messagesContainer: HTMLElement;
  let isLoading = false;
  let error = '';

  $: messages = $chatStore.messages;
  $: sessionId = $chatStore.sessionId;

  onMount(() => {
    // Load conversation history if sessionId exists in localStorage
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      chatStore.loadHistory(savedSessionId);
    }
  });

  $: if (messagesContainer && messages.length > 0) {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }

  async function sendMessage() {
    if (!messageInput.trim() || isLoading) return;

    const userMessage = messageInput.trim();
    messageInput = '';
    error = '';
    isLoading = true;

    try {
      await chatStore.sendMessage(userMessage);
      
      // Save session ID to localStorage
      if ($chatStore.sessionId) {
        localStorage.setItem('chatSessionId', $chatStore.sessionId);
      }
    } catch (err: any) {
      error = err.message || 'Failed to send message. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    chatStore.clearMessages();
    localStorage.removeItem('chatSessionId');
    error = '';
  }
</script>

<div class="chat-container">
  <div class="messages" bind:this={messagesContainer}>
    {#if messages.length === 0}
      <div class="welcome">
        <h3>👋 Welcome to Spur Support!</h3>
        <p>Ask me anything about our store policies, shipping, returns, or products.</p>
        <div class="suggestions">
          <button on:click={() => messageInput = "What's your return policy?"}>
            What's your return policy?
          </button>
          <button on:click={() => messageInput = "Do you offer free shipping?"}>
            Do you offer free shipping?
          </button>
          <button on:click={() => messageInput = "What are your support hours?"}>
            What are your support hours?
          </button>
        </div>
      </div>
    {/if}

    {#each messages as message (message.id)}
      <Message {message} />
    {/each}

    {#if isLoading}
      <div class="typing-indicator">
        <div class="message ai">
          <div class="avatar">🤖</div>
          <div class="content">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if error}
    <div class="error">
      {error}
      <button on:click={() => error = ''}>×</button>
    </div>
  {/if}

  <div class="input-area">
    <div class="input-container">
      <textarea
        bind:value={messageInput}
        on:keypress={handleKeyPress}
        placeholder="Type your message..."
        disabled={isLoading}
        rows="1"
      ></textarea>
      <button 
        on:click={sendMessage} 
        disabled={!messageInput.trim() || isLoading}
        class="send-button"
      >
        {#if isLoading}
          ⏳
        {:else}
          ➤
        {/if}
      </button>
    </div>
    <div class="actions">
      <button on:click={clearChat} class="clear-button">Clear Chat</button>
    </div>
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 600px;
    background: white;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background: #f8f9fa;
  }

  .welcome {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .welcome h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .suggestions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .suggestions button {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .suggestions button:hover {
    background: #f0f0f0;
    border-color: #667eea;
  }

  .typing-indicator {
    margin-bottom: 1rem;
  }

  .typing-dots {
    display: flex;
    gap: 4px;
    padding: 1rem;
  }

  .typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #999;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }

  .error {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-top: 1px solid #fcc;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .error button {
    background: none;
    border: none;
    color: #c33;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    width: 24px;
    height: 24px;
  }

  .input-area {
    border-top: 1px solid #eee;
    background: white;
  }

  .input-container {
    display: flex;
    padding: 1rem;
    gap: 0.5rem;
  }

  textarea {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 0.75rem;
    resize: none;
    font-family: inherit;
    font-size: 1rem;
    min-height: 44px;
    max-height: 120px;
  }

  textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .send-button {
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-size: 1.2rem;
    min-width: 44px;
    transition: background 0.2s;
  }

  .send-button:hover:not(:disabled) {
    background: #5a67d8;
  }

  .send-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .actions {
    padding: 0 1rem 1rem;
    text-align: center;
  }

  .clear-button {
    background: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: #666;
    font-size: 0.9rem;
  }

  .clear-button:hover {
    background: #f0f0f0;
  }

  @media (max-width: 600px) {
    .chat-container {
      height: 500px;
    }
    
    .suggestions {
      gap: 0.25rem;
    }
    
    .suggestions button {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
</style>
