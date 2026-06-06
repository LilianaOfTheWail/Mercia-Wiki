/**
 * Index Builder - Creates a master lookup index for all data entities
 * Purpose: Enable O(1) lookups of any entity by compound key (e.g., "kingdoms.glowstowe")
 */

export interface IndexEntry {
  dataSource: string
  arrayIndex: number
}

export interface DataIndex {
  [category: string]: {
    [key: string]: IndexEntry
  }
}

/**
 * Normalizes a key to lowercase with hyphens (matches wiki naming convention)
 */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Builds index from a data source array
 * Assumes each item has either `key` or `name` property
 */
function indexDataSource(
  dataArray: Array<any>,
  dataSource: string
): Record<string, IndexEntry> {
  const index: Record<string, IndexEntry> = {}

  dataArray.forEach((item, arrayIndex) => {
    const itemKey = normalizeKey(item.key || item.name || '')
    if (itemKey) {
      index[itemKey] = {
        dataSource,
        arrayIndex
      }
    }
  })

  return index
}

/**
 * Builds the complete index from all data sources
 * Call this once on app initialization
 */
export async function buildIndex(): Promise<DataIndex> {
  const index: DataIndex = {}

  try {
    console.log('[IndexBuilder] Starting to build index...')
    
    // Fetch all data sources
    console.log('[IndexBuilder] Fetching kingdoms.json')
    const kingdomsRes = await fetch('/data-config/kingdoms.json')
    console.log('[IndexBuilder] Kingdoms response status:', kingdomsRes.status)
    
    console.log('[IndexBuilder] Fetching characters.json')
    const charactersRes = await fetch('/data-config/characters.json')
    console.log('[IndexBuilder] Characters response status:', charactersRes.status)
    
    console.log('[IndexBuilder] Fetching settlements.json')
    const settlementsRes = await fetch('/data-config/settlements.json')
    console.log('[IndexBuilder] Settlements response status:', settlementsRes.status)
    
    console.log('[IndexBuilder] Fetching noble-houses.json')
    const nobleHousesRes = await fetch('/data-config/noble-houses.json')
    console.log('[IndexBuilder] Noble houses response status:', nobleHousesRes.status)

    const kingdomsModule = await kingdomsRes.json()
    console.log('[IndexBuilder] Kingdoms data loaded:', kingdomsModule)
    
    const charactersModule = await charactersRes.json()
    console.log('[IndexBuilder] Characters data loaded:', charactersModule)
    
    const settlementsModule = await settlementsRes.json()
    console.log('[IndexBuilder] Settlements data loaded:', settlementsModule)
    
    const nobleHousesModule = await nobleHousesRes.json()
    console.log('[IndexBuilder] Noble houses data loaded:', nobleHousesModule)

    // Index each data source
    index.kingdoms = indexDataSource(kingdomsModule.kingdoms || [], 'kingdoms')
    console.log('[IndexBuilder] Indexed kingdoms:', Object.keys(index.kingdoms))
    
    index.characters = indexDataSource(charactersModule.characters || [], 'characters')
    console.log('[IndexBuilder] Indexed characters:', Object.keys(index.characters))
    
    index.settlements = indexDataSource(settlementsModule.settlements || [], 'settlements')
    console.log('[IndexBuilder] Indexed settlements:', Object.keys(index.settlements))
    
    index.nobility = indexDataSource(
      nobleHousesModule['noble-houses'] || [],
      'noble-houses'
    )
    console.log('[IndexBuilder] Indexed nobility:', Object.keys(index.nobility))
    console.log('[IndexBuilder] Final index:', index)
  } catch (error) {
    console.error('[IndexBuilder] Error building data index:', error)
  }

  return index
}

/**
 * Gets all items from a specific category
 * Useful for rendering nested nav lists
 */
export async function getDataByCategory(category: string): Promise<Array<any>> {
  try {
    console.log('[IndexBuilder] getDataByCategory called with:', category)
    
    const categoryMap: Record<string, string> = {
      kingdoms: 'kingdoms.json',
      characters: 'characters.json',
      settlements: 'settlements.json',
      nobility: 'noble-houses.json'
    }

    const fileName = categoryMap[category]
    if (!fileName) {
      console.log('[IndexBuilder] No filename mapping found for category:', category)
      return []
    }

    console.log('[IndexBuilder] Fetching file:', fileName)
    const response = await fetch(`/data-config/${fileName}`)
    console.log('[IndexBuilder] Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('[IndexBuilder] Data loaded:', data)
    
    const dataKey = category === 'nobility' ? 'noble-houses' : category
    const result = data[dataKey] || []
    console.log('[IndexBuilder] Returning items for key', dataKey, ':', result.length, 'items')
    
    return result
  } catch (error) {
    console.error(`[IndexBuilder] Error loading category ${category}:`, error)
    return []
  }
}
