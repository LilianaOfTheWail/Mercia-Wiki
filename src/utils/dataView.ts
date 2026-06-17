import { DataViewQueryInput, MetadataSummaryProps } from '../common/types';
import { buildPublicUrl } from './navigation';
import { normalizeKey } from './stringUtils';
import { getDataFileName } from '../common/user-data';

export async function buildTableOfContents({
  domain,
  filters,
  dataFields,
}: DataViewQueryInput): Promise<Array<MetadataSummaryProps>> {
  const dataSource = await fetch(
    buildPublicUrl(`data-config/${getDataFileName(domain)}`),
  );

  if (!dataSource.ok) {
    return [];
  }

  const payload = await dataSource.json();
  const data: MetadataSummaryProps[] = Array.isArray(payload[domain])
    ? payload[domain]
    : [];

  const includeTags = filters?.shouldInclude || [];
  const excludeTags = filters?.shouldExclude || [];
  const fields = dataFields || [];

  const filteredData = data.filter((item) => {
    const itemMetadata = item.metadata || {};
    const tags = itemMetadata.tags
      ? itemMetadata.tags.split(',').map((tag: string) => tag.trim())
      : [];

    const hasIncludedTag =
      includeTags.length === 0 || includeTags.some((tag) => tags.includes(tag));
    const hasExcludedTag = excludeTags.some((tag) => tags.includes(tag));

    return hasIncludedTag && !hasExcludedTag;
  });

  return filteredData.map((item) => {
    const slug = normalizeKey(item.key || item.name);
    const href = `/${domain}/${slug}`;

    if (!fields.length) {
      return {
        name: item.name,
        href,
      };
    }

    const filteredMetadata: Record<string, string> = {};

    fields.forEach((field) => {
      const value = item.metadata?.[field];
      if (value) {
        filteredMetadata[field] = value;
      }
    });

    return { name: item.name, href, metadata: filteredMetadata };
  });
}
