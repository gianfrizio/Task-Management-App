import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
}

/**
 * Custom hook per gestire keyboard shortcuts globali
 *
 * @param shortcuts - Array di shortcuts da registrare
 * @param enabled - Se true, gli shortcuts sono attivi (default: true)
 *
 * @example
 * useKeyboardShortcut([
 *   { key: 'k', ctrl: true, callback: () => focusSearch(), description: 'Focus search' },
 *   { key: 'n', ctrl: true, callback: () => createNew(), description: 'New task' },
 * ]);
 */
export function useKeyboardShortcut(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Guard contro event.key undefined
      if (!event.key) return;

      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
