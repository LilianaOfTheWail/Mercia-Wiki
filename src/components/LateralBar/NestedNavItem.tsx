import React from 'react'

export interface ListItem {
  key?: string
  name: string
  list?: ListItem[]
  [key: string]: any
}

interface NestedNavItemProps {
  item: ListItem
  depth: number
  expandedKeys: Set<string>
  onToggle: (itemKey: string, dataSource?: string) => void
  dataSource?: string
}

const NestedNavItem: React.FC<NestedNavItemProps> = ({ item, depth, expandedKeys, onToggle, dataSource }) => {
  const itemKey = item.key || item.name
  const isExpanded = expandedKeys.has(itemKey)
  const hasNestedList = Array.isArray(item.list) && item.list.length > 0

  return (
    <div key={itemKey} className="lateral-bar__nested-item">
      <button
        type="button"
        className={`lateral-bar__nested-link ${isExpanded ? 'active' : ''}`}
        onClick={() => onToggle(itemKey, dataSource)}
        style={{ paddingLeft: `${1 + depth * 0.75}rem` }}
      >
        <span className="lateral-bar__label">{item.name}</span>
      </button>

      {hasNestedList && isExpanded && (
        <div className="lateral-bar__nested-list">
          {item.list?.map((child) => (
            <NestedNavItem
              key={child.key || child.name}
              item={child}
              depth={depth + 1}
              expandedKeys={expandedKeys}
              onToggle={onToggle}
              dataSource={dataSource}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NestedNavItem
