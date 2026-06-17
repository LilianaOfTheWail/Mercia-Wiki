export type DataDomain =
  | 'entities'
  | 'kingdoms'
  | 'characters'
  | 'settlements'
  | 'factions'
  | 'religions'
  | 'noble-houses'
  | 'regions'

export type NavSectionKey = string

export interface NavConfigItem {
  key: NavSectionKey
  label: string
  dataSource?: DataDomain
  children?: NavConfigItem[]
}

export const DATA_SOURCE_FILE_NAMES: Record<DataDomain, string> = {
  entities: 'entities.json',
  kingdoms: 'kingdoms.json',
  characters: 'characters.json',
  settlements: 'settlements.json',
  factions: 'factions.json',
  religions: 'religions.json',
  'noble-houses': 'noble-houses.json',
  regions: 'regions.json'
}

export const DATA_SOURCE_ALIASES: Record<string, DataDomain> = {
  nobility: 'noble-houses'
}

export const WIKI_NAV_CONFIG: NavConfigItem[] = [
  {
    key: 'overview',
    label: 'Overview'
  },
  {
    key: 'peoples-of-mercia',
    label: 'Peoples of Mercia',
    children: [
      {
        key: 'characters',
        label: 'Characters',
        dataSource: 'characters'
      },
      {
        key: 'factions',
        label: 'Factions',
        dataSource: 'factions'
      },
      {
        key: 'noble-houses',
        label: 'Noble Houses',
        dataSource: 'noble-houses'
      }
    ]
  },
  {
    "key": "geographic-landmarks",
    "label": "Geographic Landmarks",
    "children": [
      {
        key: 'kingdoms',
        label: 'Kingdoms',
        dataSource: 'kingdoms'
      },
      {
        key: 'settlements',
        label: 'Settlements',
        dataSource: 'settlements'
      }
    ]
  },
  {
    key: 'religions',
    label: 'Religion',
    dataSource: 'religions'
  }
]

export function resolveDataDomain(category: string): DataDomain | null {
  if (category in DATA_SOURCE_ALIASES) {
    return DATA_SOURCE_ALIASES[category]
  }

  if (category in DATA_SOURCE_FILE_NAMES) {
    return category as DataDomain
  }

  return null
}

export function getDataFileName(domain: DataDomain): string {
  return DATA_SOURCE_FILE_NAMES[domain]
}
