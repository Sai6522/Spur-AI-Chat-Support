<script lang="ts">
  import Chat from './lib/Chat.svelte';
</script>

<main>
  <div class="container">
    <header>
      <h1>Spur AI Support</h1>
      <p>Get instant help from our AI assistant</p>
    </header>
    <Chat />
  </div>
</main>

<style>
  main {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
</style>
