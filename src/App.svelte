<script>
  import { onMount } from 'svelte';
  // @ts-ignore
  import axios from 'axios';

  const ankiApi = 'http://127.0.0.1:9999'
  let userName = localStorage.getItem('tgNickname')
  $: userDecks = []
  let selected = localStorage.getItem('currentDeckId')

  async function updateDecks() {
    let response = await axios.get(`${ankiApi}/anki/${userName}/decks`)
    userDecks = response.data
  }

  onMount(async () => {
    await updateDecks()
  })

  function saveTelegramNickname(event) {
    let inputElement = document.getElementById('tgNickname')
    // @ts-ignore
    userName = inputElement.value
    localStorage.setItem('tgNickname', userName)
    updateDecks()
  }

  function changeDeckId(event) {
    localStorage.setItem('currentDeckId', event.target.value)
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
      <input type="text" class="form-control" placeholder="Введи ник в ТГ" id="tgNickname" value="{userName}">
      <button class="btn btn-outline-secondary" type="button" id="button" on:click={saveTelegramNickname}>Сохранить</button>
    </div>
  </div>
</main>
