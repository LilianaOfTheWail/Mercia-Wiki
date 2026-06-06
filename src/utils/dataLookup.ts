/**
 * Data Lookup - Resolves compound keys to actual data items
 * Purpose: Given a key like "kingdoms.glowstowe", returns the full article data
 */

import type { DataIndex } from './indexBuilder'

/**
 * Normalizes a key to lowercase with hyphens (matches wiki naming convention)
 */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Parses a compound key into category and item key
 * Example: "kingdoms.glowstowe" → { category: "kingdoms", itemKey: "glowstowe" }
 */
function parseCompoundKey(
  compoundKey: string
): { category: string; itemKey: string } | null {
  const parts = compoundKey.split('.')
  if (parts.length !== 2) return null

  return {
    category: parts[0],
    itemKey: normalizeKey(parts[1])
  }
}

/**
 * Resolves a compound key to article data using the index
 * Returns null if not found
 */
export async function resolveArticle(
  compoundKey: string,
  index: DataIndex
): Promise<any | null> {
  console.log('[DataLookup] resolveArticle called with:', compoundKey)
  
  const parsed = parseCompoundKey(compoundKey)
  console.log('[DataLookup] Parsed key:', parsed)
  if (!parsed) {
    console.log('[DataLookup] Failed to parse compound key')
    return null
  }

  const { category, itemKey } = parsed
  console.log('[DataLookup] Looking for category:', category, 'itemKey:', itemKey)
  
  const categoryIndex = index[category]
  console.log('[DataLookup] Category index:', categoryIndex)

  if (!categoryIndex) {
    console.log('[DataLookup] No category index found for:', category)
    return null
  }

  const entry = categoryIndex[itemKey]
  console.log('[DataLookup] Entry found:', entry)
  // Load the data source
  console.log('[DataLookup] Loading data source for category lookup')
  const data = await loadDataSource(parsed.category)
  console.log('[DataLookup] Data source loaded:', data)
  if (!data) {
    console.log('[DataLookup] Failed to load data source')
    return null
  }

  // Extract the array from the fetched data
  const dataKey = parsed.category === 'nobility' ? 'noble-houses' : parsed.category
  console.log('[DataLookup] Using data key:', dataKey)
  const dataArray = data[dataKey] as Array<any>
  console.log('[DataLookup] Data array length:', Array.isArray(dataArray) ? dataArray.length : 'not-array')

  if (!Array.isArray(dataArray)) {
    console.log('[DataLookup] Data array is not an array')
    return null
  }

  // If we had an index entry, return that top-level item
  if (entry) {
    const result = dataArray?.[entry.arrayIndex] || null
    console.log('[DataLookup] Returning top-level article from index:', result)
    return result
  }

  // Fallback: search nested `list` items inside each top-level item
  console.log('[DataLookup] No index entry, searching nested lists for itemKey:', itemKey)

  function findInList(list: any[] | undefined, targetKey: string): any | null {
    if (!Array.isArray(list)) return null
    for (const child of list) {
      const childKey = normalizeKey(child.key || child.name || '')
      if (childKey === targetKey) return child
      const foundInChild = findInList(child.list, targetKey)
      if (foundInChild) return foundInChild
    }
    return null
  }

  for (const topItem of dataArray) {
    // Check top-level item itself (already covered by index but safe)
    const topKey = normalizeKey(topItem.key || topItem.name || '')
    if (topKey === itemKey) return topItem

    // Check nested list
    const found = findInList(topItem.list, itemKey)
    if (found) {
      console.log('[DataLookup] Found nested item in list:', found)
      return found
    }
  }

  console.log('[DataLookup] No nested item found for key:', itemKey)
  return null
}

/**
 * Loads a complete data source by filename
 */
async function loadDataSource(fileName: string): Promise<any> {
  try {
    console.log('[DataLookup] loadDataSource called with:', fileName)
    
    const fileNameMap: Record<string, string> = {
      kingdoms: 'kingdoms.json',
      characters: 'characters.json',
      settlements: 'settlements.json',
      'noble-houses': 'noble-houses.json'
    }

    const actualFileName = fileNameMap[fileName] || fileName
    console.log('[DataLookup] Actual file name:', actualFileName)
    
    const response = await fetch(`/data-config/${actualFileName}`)
    console.log('[DataLookup] Fetch response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${actualFileName}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('[DataLookup] Data loaded:', data)
    return data
  } catch (error) {
    console.error(`[DataLookup] Error loading data source ${fileName}:`, error)
    return null
  }
}

/**
 * Validates if a compound key exists in the index
 */
export function keyExists(compoundKey: string, index: DataIndex): boolean {
  const parsed = parseCompoundKey(compoundKey)
  if (!parsed) return false

  const categoryIndex = index[parsed.category]
  return categoryIndex && parsed.itemKey in categoryIndex
}

/**
 * Gets all compound keys for a category
 * Useful for generating routes or debugging
 */
export function getAllKeysInCategory(category: string, index: DataIndex): string[] {
  const categoryIndex = index[category]
  if (!categoryIndex) return []

  return Object.keys(categoryIndex).map((itemKey) => `${category}.${itemKey}`)
}
