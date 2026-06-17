import React, { useEffect, useMemo, useState } from 'react'
import NestedNavItem, { ListItem } from './NestedNavItem'
import './LateralBar.css'
import { getCategoryItems } from '../../utils/dataService'
import { normalizeKey } from '../../utils/stringUtils'
import { WIKI_NAV_CONFIG } from '../../common/user-data'
import type { NavConfigItem } from '../../common/types'

interface LateralBarProps {
  activeKey: string
  selectedKey?: string | null
  onSelect: (key: string | null) => void
  collapsed: boolean
  onToggle: () => void
}

function findNavPath(
  items: NavConfigItem[],
  targetKey: string
): NavConfigItem[] | null {
  const normalizedTarget = normalizeKey(targetKey)

  for (const item of items) {
    const itemKey = normalizeKey(item.key)
    const dataSourceKey = item.dataSource ? normalizeKey(item.dataSource) : ''

    if (itemKey === normalizedTarget || dataSourceKey === normalizedTarget) {
      return [item]
    }

    if (item.children && item.children.length > 0) {
      const childPath = findNavPath(item.children, targetKey)
      if (childPath) {
        return [item, ...childPath]
      }
    }
  }

  return null
}

function LateralBar({
  activeKey,
  selectedKey,
  onSelect,
  collapsed,
  onToggle
}: LateralBarProps) {
  const [expandedKeys, setExpandedKeys] = useState(new Set() as Set<string>)
  const [categoryData, setCategoryData] = useState({} as Record<string, ListItem[]>)
  const [loading, setLoading] = useState(false)

  const activeNavPath = useMemo(() => findNavPath(WIKI_NAV_CONFIG, activeKey), [activeKey])
  const activeNavKeys = new Set(
    activeNavPath?.map((item: NavConfigItem) => item.key) || []
  )
  const activeNavItem = activeNavPath ? activeNavPath[activeNavPath.length - 1] : null
  const activeDataSource = activeNavItem?.dataSource

  useEffect(() => {
    if (!activeNavPath) {
      setExpandedKeys(new Set())
      return
    }

    const nextExpandedKeys = new Set<string>()

    activeNavPath.forEach((item: NavConfigItem, index: number) => {
      const isLeaf = index === activeNavPath.length - 1
      if (!isLeaf || item.children?.length) {
        nextExpandedKeys.add(item.key)
      }
    })

    setExpandedKeys(nextExpandedKeys)
  }, [activeNavPath])

  useEffect(() => {
    const loadCategory = async () => {
      if (!activeDataSource) {
        setCategoryData({})
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const items = await getCategoryItems(activeDataSource)
        setCategoryData({
          [activeDataSource]: items
        })
      } catch (error) {
        setCategoryData({})
      } finally {
        setLoading(false)
      }
    }

    loadCategory()
  }, [activeDataSource])

  const handleSectionSelect = (key: string) => {
    setExpandedKeys(new Set())
    onSelect(key)
  }

  const handleGroupToggle = (key: string) => {
    setExpandedKeys((prev: Set<string>) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const handleNestedItemClick = (
    compoundKey: string,
    dataSource?: string,
    hasNestedList?: boolean
  ) => {
    if (hasNestedList) {
      setExpandedKeys((prev: Set<string>) => {
        const next = new Set(prev)
        if (next.has(compoundKey)) {
          next.delete(compoundKey)
        } else {
          next.add(compoundKey)
        }
        return next
      })
    }

    if (dataSource) {
      onSelect(compoundKey)
    }
  }

  const renderNavItem = (item: NavConfigItem, depth = 0): React.ReactNode => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0
    const isExpanded = expandedKeys.has(item.key)
    const isActive = activeNavKeys.has(item.key)
    const buttonClassName = depth === 0
      ? `lateral-bar__link${hasChildren ? ' lateral-bar__link--group' : ''}${isActive ? ' active' : ''}`
      : `lateral-bar__nested-link${hasChildren ? ' lateral-bar__nested-link--group' : ''}${isActive ? ' active' : ''}`

    return (
      <div key={item.key} className="lateral-bar__nav-item">
        <button
          type="button"
          className={buttonClassName}
          onClick={() => {
            if (hasChildren) {
              handleGroupToggle(item.key)
              return
            }

            if (item.dataSource) {
              handleSectionSelect(item.dataSource)
              return
            }

            handleSectionSelect(item.key)
          }}
          style={{ paddingLeft: `${1 + depth * 0.75}rem` }}
        >
          <span className="lateral-bar__label">{item.label}</span>
          {hasChildren && (
            <span className="lateral-bar__group-indicator" aria-hidden="true">
              {isExpanded ? 'v' : '>'}
            </span>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="lateral-bar__nested-list">
            {item.children?.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}

        {item.dataSource && isActive && (
          <div className="lateral-bar__nested-list">
            {loading ? (
              <div className="lateral-bar__loading">Loading...</div>
            ) : categoryData[item.dataSource] && categoryData[item.dataSource].length > 0 ? (
              categoryData[item.dataSource].map((listItem: ListItem) => (
                <NestedNavItem
                  key={listItem.key || listItem.name}
                  item={listItem}
                  depth={0}
                  expandedKeys={expandedKeys}
                  selectedKey={selectedKey}
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
  }

  return (
    <aside className={`lateral-bar ${collapsed ? 'collapsed' : ''}`}>
      <div className="lateral-bar__header">
        <span className="lateral-bar__title">Navigation</span>
        <button className="lateral-bar__toggle" onClick={onToggle}>
          {collapsed ? '>' : '<'}
        </button>
      </div>

      <div className="lateral-bar__links">
        {WIKI_NAV_CONFIG.map((item: NavConfigItem) => renderNavItem(item))}
      </div>
    </aside>
  )
}

export default LateralBar
