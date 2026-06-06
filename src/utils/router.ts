/**
 * Router - Main routing orchestrator
 * Purpose: Combines index builder and data lookup for complete routing
 */

import type { DataIndex } from './indexBuilder'
import { buildIndex, getDataByCategory } from './indexBuilder'
import { resolveArticle, keyExists, getAllKeysInCategory } from './dataLookup'

export class DataRouter {
  private index: DataIndex | null = null
  private indexPromise: Promise<DataIndex> | null = null

  /**
   * Initialize the router - builds the index once
   */
  async initialize(): Promise<void> {
    if (!this.index && !this.indexPromise) {
      this.indexPromise = buildIndex()
      this.index = await this.indexPromise
    } else if (this.indexPromise && !this.index) {
      this.index = await this.indexPromise
    }
  }

  /**
   * Resolve a compound key to article data
   * Example: "kingdoms.glowstowe" → full article object
   */
  async getArticle(compoundKey: string): Promise<any | null> {
    console.log('[Router] getArticle called with:', compoundKey)
    await this.initialize()
    if (!this.index) {
      console.log('[Router] Index is null after initialization')
      return null
    }

    console.log('[Router] Index initialized, calling resolveArticle')
    const article = await resolveArticle(compoundKey, this.index)
    console.log('[Router] resolveArticle returned:', article)
    return article
  }

  /**
   * Get all items in a category for navigation display
   */
  async getCategoryItems(category: string): Promise<Array<any>> {
    return getDataByCategory(category)
  }

  /**
   * Check if a compound key is valid
   */
  async isValidKey(compoundKey: string): Promise<boolean> {
    await this.initialize()
    if (!this.index) return false

    return keyExists(compoundKey, this.index)
  }

  /**
   * Get all compound keys in a category
   */
  async getCategoryKeys(category: string): Promise<string[]> {
    await this.initialize()
    if (!this.index) return []

    return getAllKeysInCategory(category, this.index)
  }

  /**
   * Get the index (for debugging or advanced use)
   */
  async getIndex(): Promise<DataIndex | null> {
    await this.initialize()
    return this.index
  }
}

// Export singleton instance
export const router = new DataRouter()
