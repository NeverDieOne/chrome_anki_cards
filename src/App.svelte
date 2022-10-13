<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  const ankiApi = 'https://anki.neverdieone.ru'
  let extensionKey = localStorage.getItem('extensionKey')
  $: userDecks = []
  let selected = localStorage.getItem('currentDeckId')

  async function updateDecks() {
    let response = await axios.get(`${ankiApi}/anki/decks?extension_key=${extensionKey}`)
    userDecks = response.data
  }

  onMount(async () => {
    await updateDecks()
  })

  function saveExtensionKey(event) {
    let inputElement = document.getElementById('extensionKey')
    extensionKey = inputElement.value
    localStorage.setItem('extensionKey', extensionKey)
    updateDecks()
  }

  function changeDeckId(event) {
    localStorage.setItem('currentDeckId', event.target.value)
    chrome.storage.sync.set({'currentDeckId': event.target.value})
  }
</script>

<main>
  <div class="container">
    <div class="text-center mt-2">
      <h3>AnkiCardsBot Extension</h3>
    </div>
    <div class="input-group mb-3 mt-3">
      <label class="input-group-text" for="inputGroupSelect01">Колода</label>
      <select on:change={changeDeckId} class="form-select">
        {#each userDecks as deck}
          {#if selected == deck.id}
            <option selected value="{deck.id}">{deck.name}</option>
          {:else}
            <option value="{deck.id}">{deck.name}</option>
          {/if}
        {/each}
      </select>
    </div>
    <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="AnkiBot Extension Key" id="extensionKey" value="{extensionKey}">
      <button class="btn btn-outline-secondary" type="button" id="button" on:click={saveExtensionKey}>Сохранить</button>
    </div>
  </div>
</main>
