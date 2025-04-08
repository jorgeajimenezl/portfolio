<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { history } from '../stores/history';
  import { theme } from '../stores/theme';
  import { commands } from '../utils/commands';
  import { track } from '../utils/tracking';

  let command = '';
  let historyIndex = -1;
  let autoCompleteOptions: string[] = [];
  let autoCompleteIndex = -1;
  let commandPrefix = '';

  let input: HTMLInputElement;

  onMount(() => {
    input.focus();

    if ($history.length === 0) {
      const command = commands['banner'] as () => string;

      if (command) {
        const output = command();

        $history = [...$history, { command: 'banner', outputs: [output] }];
      }
    }
  });

  afterUpdate(() => {
    input.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  function findMatchingCommands(prefix: string): string[] {
    if (!prefix) return [];
    return Object.keys(commands).filter((cmd) => cmd.startsWith(prefix));
  }

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key !== 'Tab' && autoCompleteIndex !== -1) {
      autoCompleteOptions = [];
      autoCompleteIndex = -1;
      commandPrefix = '';
    }
    
    if (event.key === 'Enter') {
      const [commandName, ...args] = command.split(' ');

      if (import.meta.env.VITE_TRACKING_ENABLED === 'true') {
        track(commandName, ...args);
      }

      const commandFunction = commands[commandName];

      if (commandFunction) {
        const output = await commandFunction(args);

        if (commandName !== 'clear') {
          $history = [...$history, { command, outputs: [output] }];
        }
      } else {
        const output = `${commandName}: command not found`;

        $history = [...$history, { command, outputs: [output] }];
      }

      command = '';
      autoCompleteOptions = [];
      autoCompleteIndex = -1;
    } else if (event.key === 'ArrowUp') {
      if (historyIndex < $history.length - 1) {
        historyIndex++;

        command = $history[$history.length - 1 - historyIndex].command;
      }

      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      if (historyIndex > -1) {
        historyIndex--;
        command =
          historyIndex >= 0
            ? $history[$history.length - 1 - historyIndex].command
            : '';
      }
      event.preventDefault();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      
      if (autoCompleteIndex === -1) {
        commandPrefix = command;
        autoCompleteOptions = findMatchingCommands(commandPrefix);
        
        if (autoCompleteOptions.length > 0) {
          autoCompleteIndex = 0;
          command = autoCompleteOptions[autoCompleteIndex];
        }
      } 
      else {
        if (autoCompleteOptions.length > 0) {
          autoCompleteIndex = (autoCompleteIndex + 1) % autoCompleteOptions.length;
          command = autoCompleteOptions[autoCompleteIndex];
        }
      }
    } else if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();

      $history = [];
    }
  };
</script>

<svelte:window
  on:click={() => {
    input.focus();
  }}
/>

<div class="flex w-full">
  <p class="visible md:hidden">❯</p>

  <input
    id="command-input"
    name="command-input"
    aria-label="Command input"
    class="w-full px-2 bg-transparent outline-none"
    type="text"
    style={`color: ${$theme.foreground}`}
    bind:value={command}
    on:keydown={handleKeyDown}
    bind:this={input}
  />
</div>
