import React from 'react';
import { normalizeKey } from '../../utils/stringUtils';
import type { NavigationDataItem } from '../../common/types';

export type ListItem = NavigationDataItem;

interface NestedNavItemProps {
  item: ListItem;
  depth: number;
  expandedKeys: Set<string>;
  selectedKey?: string | null;
  onToggle: (
    compoundKey: string,
    dataSource?: string,
    hasNestedList?: boolean,
  ) => void;
  dataSource?: string;
}

const NestedNavItem: React.FC<NestedNavItemProps> = ({
  item,
  depth,
  expandedKeys,
  selectedKey,
  onToggle,
  dataSource,
}) => {
  const itemLabel = item.name || item.key || '';
  const itemKey = item.key || item.name || '';
  const normalizedItemKey = normalizeKey(itemKey);
  const itemDataSource =
    typeof item.dataSource === 'string' ? item.dataSource : undefined;
  const effectiveDataSource = itemDataSource || dataSource;
  const isRouteTarget =
    typeof effectiveDataSource === 'string' &&
    effectiveDataSource.startsWith('/');
  const routeSegments = isRouteTarget
    ? effectiveDataSource.split('/').filter(Boolean)
    : [];
  const compoundKey =
    isRouteTarget && routeSegments.length >= 2
      ? `${routeSegments[0]}.${normalizeKey(routeSegments[1])}`
      : effectiveDataSource
        ? `${effectiveDataSource}.${normalizedItemKey}`
        : itemKey;
  const hasNestedList = Array.isArray(item.list) && item.list.length > 0;
  const isExpanded = expandedKeys.has(compoundKey);
  const isSelected = selectedKey === compoundKey;

  return (
    <div key={itemKey} className="lateral-bar__nested-item">
      <button
        type="button"
        className={`lateral-bar__nested-link ${isSelected ? 'active' : ''}`}
        onClick={() =>
          onToggle(compoundKey, effectiveDataSource, hasNestedList)
        }
        style={{ paddingLeft: `${1 + depth * 0.75}rem` }}
      >
        <span className="lateral-bar__label">{itemLabel}</span>
      </button>

      {hasNestedList && isExpanded && (
        <div className="lateral-bar__nested-list">
          {item.list?.map((child) => (
            <NestedNavItem
              key={child.key || child.name}
              item={child}
              depth={depth + 1}
              expandedKeys={expandedKeys}
              selectedKey={selectedKey}
              onToggle={onToggle}
              dataSource={effectiveDataSource}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NestedNavItem;
