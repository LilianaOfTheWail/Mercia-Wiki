import { normalizeKey } from './stringUtils';
import { buildPublicUrl } from './navigation';
import { getDataFileName, resolveDataDomain } from '../common/user-data';
import type { DataDomain, NavigationDataItem } from '../common/types';

const categoryCache = new Map<string, NavigationDataItem[]>();

function getItemKey(item: NavigationDataItem): string {
  return normalizeKey(item?.key || item?.name || '');
}

function getSourceKey(category: string): DataDomain | null {
  return resolveDataDomain(category);
}

async function loadCategory(category: string): Promise<NavigationDataItem[]> {
  const sourceKey = getSourceKey(category);
  if (!sourceKey) {
    return [];
  }

  if (categoryCache.has(sourceKey)) {
    return categoryCache.get(sourceKey) || [];
  }

  try {
    const response = await fetch(
      buildPublicUrl(`data-config/${getDataFileName(sourceKey)}`),
    );
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const items = Array.isArray(data[sourceKey]) ? data[sourceKey] : [];

    categoryCache.set(sourceKey, items);
    return items;
  } catch (error) {
    return [];
  }
}

function findInNestedList(
  list: NavigationDataItem[] | undefined,
  targetKey: string,
): NavigationDataItem | null {
  if (!Array.isArray(list)) {
    return null;
  }

  for (const item of list) {
    if (getItemKey(item) === targetKey) {
      return item;
    }

    const found = findInNestedList(item?.list, targetKey);
    if (found) {
      return found;
    }
  }

  return null;
}

export async function getCategoryItems(
  category: string,
): Promise<NavigationDataItem[]> {
  return loadCategory(category);
}

export async function getArticleByName(
  category: string,
  nameToFind: string,
): Promise<NavigationDataItem | null> {
  const items = await loadCategory(category);
  if (!items.length) {
    return null;
  }

  const normalizedSearchName = normalizeKey(nameToFind);

  for (const item of items) {
    if (getItemKey(item) === normalizedSearchName) {
      return item;
    }

    const found = findInNestedList(item?.list, normalizedSearchName);
    if (found) {
      return found;
    }
  }

  return null;
}
