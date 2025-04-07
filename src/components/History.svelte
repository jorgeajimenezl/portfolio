<script lang="ts">
  import { history } from '../stores/history';
  import { theme } from '../stores/theme';
  import Ps1 from './Ps1.svelte';
  import { AnsiUp } from 'ansi_up';

  const ansiUp = new AnsiUp();

  function parseAnsi(text: string): string {
    return ansiUp.ansi_to_html(text);
  }
</script>

<style>
  .output {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>

{#each $history as { command, outputs }}
  <div style={`color: ${$theme.foreground}`}>
    <div class="flex flex-col md:flex-row">
      <Ps1 />

      <div class="flex">
        <p class="visible md:hidden">❯</p>

        <p class="px-2">{command}</p>
      </div>
    </div>

    {#each outputs as output}
      <p class="output">
        {@html parseAnsi(output)}
      </p>
    {/each}
  </div>
{/each}
