import React, { useEffect, useState } from 'react'
import { router } from '../../utils/router'
import NestedNavItem, { ListItem } from './NestedNavItem'
import './LateralBar.css'

interface LateralBarProps {
  activeKey: string
  onSelect: (key: string | null) => void
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  key: string
  label: string
  dataSource?: string
}

function LateralBar({ activeKey, onSelect, collapsed, onToggle }: LateralBarProps) {
  const [expandedKeys, setExpandedKeys] = useState(new Set<string>())
  const [categoryData, setCategoryData] = useState({})
  const [loading, setLoading] = useState(false)
  const [navConfig, setNavConfig] = useState<NavItem[]>([])

  // Load navigation config on component mount
  useEffect(() => {
    const loadNavConfig = async () => {
      try {
        console.log('[LateralBar] Loading nav config...')
        const response = await fetch('/app-config.json')
        if (!response.ok) throw new Error('Failed to load app-config.json')
        const config = await response.json()
        console.log('[LateralBar] Nav config loaded:', config)
        setNavConfig(config)
      } catch (error) {
        console.error('[LateralBar] Error loading nav config:', error)
        setNavConfig([])
      }
    }
    loadNavConfig()
  }, [])

  // Load category data when activeKey changes
  useEffect(() => {
    const loadCategory = async () => {
      console.log('[LateralBar] Loading category for activeKey:', activeKey)
      console.log('[LateralBar] NavConfig:', navConfig)
      
      const navItem = (navConfig as NavItem[]).find((item) => item.key === activeKey)
      console.log('[LateralBar] Found navItem:', navItem)
      
      if (!navItem?.dataSource) {
        console.log('[LateralBar] No dataSource found, clearing category data')
        setCategoryData({})
        return
      }

      setLoading(true)
      try {
        console.log('[LateralBar] Fetching items for dataSource:', navItem.dataSource)
        const items = await router.getCategoryItems(navItem.dataSource)
        console.log('[LateralBar] Items loaded:', items)
        setCategoryData({
          [navItem.dataSource]: items
        })
      } catch (error) {
        console.error('[LateralBar] Error loading category:', error)
        setCategoryData({})
      } finally {
        setLoading(false)
      }
    }

    setExpandedKeys(new Set())
    loadCategory()
  }, [activeKey, navConfig])

  const handleSectionSelect = (key: string) => {
    setExpandedKeys(new Set())
    onSelect(key)
  }

  const handleNestedItemClick = (itemKey: string, dataSource?: string) => {
    console.log('[LateralBar] handleNestedItemClick called with itemKey:', itemKey, 'dataSource:', dataSource)
    
    setExpandedKeys((prev: Set<string>) => {
      const next = new Set(prev)
      if (next.has(itemKey)) {
        next.delete(itemKey)
      } else {
        next.add(itemKey)
      }
      return next
    })

    if (dataSource) {
      // Create compound key: "kingdoms.glowstowe"
      const compoundKey = `${dataSource}.${itemKey}`
      console.log('[LateralBar] Calling onSelect with compoundKey:', compoundKey)
      onSelect(compoundKey)
    } else {
      console.log('[LateralBar] No dataSource provided')
    }
  }

  return (
    <aside className={`lateral-bar ${collapsed ? 'collapsed' : ''}`}>
      <div className="lateral-bar__header">
        <span className="lateral-bar__title">Navigation</span>
        <button className="lateral-bar__toggle" onClick={onToggle}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      <div className="lateral-bar__links">
        {(navConfig as NavItem[]).map((item) => {
          const listItems = item.dataSource ? categoryData[item.dataSource] : null

          return (
            <div key={item.key} className="lateral-bar__section">
              <button
                type="button"
                className={`lateral-bar__link ${item.key === activeKey ? 'active' : ''}`}
                onClick={() => handleSectionSelect(item.key)}
              >
                <span className="lateral-bar__label">{item.label}</span>
              </button>

              {item.key === activeKey && item.dataSource && (
                <div className="lateral-bar__nested-list">
                  {loading ? (
                    <div className="lateral-bar__loading">Loading...</div>
                  ) : listItems && listItems.length > 0 ? (
                    listItems.map((listItem: ListItem) => (
                      <NestedNavItem
                        key={listItem.key || listItem.name}
                        item={listItem}
                        depth={0}
                        expandedKeys={expandedKeys}
                        dataSource={item.dataSource}
                        onToggle={handleNestedItemClick}
                      />
                    ))
                  ) : (
                    <div className="lateral-bar__empty">No items</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default LateralBar
