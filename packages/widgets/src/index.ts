// @more/widgets — iOS WidgetKit bridge (TypeScript side)

export const WIDGETS_VERSION = '0.1.0';

export type WidgetType = 'word-of-day' | 'streak' | 'my-words' | 'art';

export interface WidgetData {
  wordOfDay: {id: number; word: string; definition: string} | null;
  streak: number;
  deckWord: {id: number; word: string; definition: string} | null;
  deckCount: number;
  profileTheme: string;
}

/**
 * Triggers WidgetCenter.shared.reloadAllTimelines() via native bridge.
 * Call on app foreground, after saving a word, or after game completion.
 */
export function refreshWidgets(): void {
  // In production, this calls the native module:
  // NativeModules.WidgetBridge.reloadAllTimelines();
  console.log('[Widgets] reloadAllTimelines() triggered');
}

/**
 * Prepare widget data from the current app state.
 * The widget extension reads SQLite directly, but this helper
 * can be used to verify data availability before triggering refresh.
 */
export async function getWidgetData(): Promise<WidgetData> {
  // Placeholder — in production, reads from the same DB the widgets use
  return {
    wordOfDay: null,
    streak: 0,
    deckWord: null,
    deckCount: 0,
    profileTheme: 'midnight',
  };
}
