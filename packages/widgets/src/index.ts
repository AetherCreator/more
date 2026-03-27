// @more/widgets — iOS WidgetKit bridge

export const WIDGETS_VERSION = '0.1.0';

export type WidgetType = 'word-of-day' | 'streak' | 'my-words' | 'art';

export function refreshWidget(_type: WidgetType): void {
  // Placeholder — implemented in Clue 10
}

export function getWidgetData(_type: WidgetType): unknown {
  // Placeholder — implemented in Clue 10
  return null;
}
