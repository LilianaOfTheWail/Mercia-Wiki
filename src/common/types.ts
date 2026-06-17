import type { DataDomain, NavConfigItem, NavSectionKey } from './user-data';

export type { DataDomain, NavConfigItem, NavSectionKey };

export type ArticleLink = {
  name: string;
  url: string;
};

export type DataViewQueryFilters = {
  shouldInclude: string[];
  shouldExclude: string[];
};

export type DataViewQueryInput = {
  domain: DataDomain;
  filters: DataViewQueryFilters;
  dataFields?: string[];
};

export type ArticleTextSection = {
  key: string;
  content: string;
  links?: ArticleLink[];
  query?: never;
};

export type ArticleQuerySection = {
  key: string;
  query: DataViewQueryInput;
  content?: never;
  links?: never;
};

export type ArticleSection = ArticleTextSection | ArticleQuerySection;

export type SectionContentProps = {
  title: string;
  content: string;
  links?: ArticleLink[];
};

export type ArticleSectionProps = SectionContentProps;

export type MetadataProperties = {
  image?: string;
  [key: string]: string | undefined;
};

export type MetadataSummaryProps = {
  name: string;
  key?: string;
  href?: string;
  metadata?: MetadataProperties;
};

export type ArticleProps = MetadataSummaryProps & {
  sections?: ArticleSection[];
};

export type SectionSelectorProps = {
  section: ArticleSection;
};

export type NavigationDataItem = {
  key?: string;
  name: string;
  list?: NavigationDataItem[];
  metadata?: MetadataProperties;
  sections?: ArticleSection[];
  [key: string]: unknown;
};
