
/**
 * Model for counting translation entities grouped by locale.
 */
export class TranslationCount {

  /**
   * Locale, e.g. 'en', 'it', 'de', 'no', etc.
   */
  locale: string;

  /**
   * Number of items in database.
   */
  count: number;
}