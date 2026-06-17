import React from 'react';
import AppLink from '../AppLink/AppLink';
import type { ArticleLink } from '../../common/types';

type RichTextProps = {
  text: string;
  links?: ArticleLink[];
  className?: string;
};

function buildLinkMap(links: ArticleLink[]): Record<string, string> {
  const linkMap: Record<string, string> = {};

  links.forEach(function (link) {
    linkMap[link.name] = link.url;
  });

  return linkMap;
}

function renderInlineNodes(
  text: string,
  links: ArticleLink[],
): React.ReactNode[] {
  const linkMap = buildLinkMap(links);
  const nodes: React.ReactNode[] = [];
  const regex = /\[\[([^\]]+)\]\]|<i>([^<]+)<\/i>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    // Check if this is a link match (group 1) or italic match (group 2)
    if (match[1]) {
      // Link match
      const linkName = match[1];
      const linkUrl = linkMap[linkName];

      if (linkUrl) {
        nodes.push(
          <AppLink
            key={linkName + '-' + match.index}
            href={linkUrl}
            className="section-box__inline-link"
          >
            {linkName}
          </AppLink>,
        );
      } else {
        nodes.push(
          <span
            key={linkName + '-' + match.index}
            className="section-box__inline-link section-box__inline-link--plain"
          >
            {linkName}
          </span>,
        );
      }
    } else if (match[2]) {
      // Italic match
      nodes.push(<i key={'italic-' + match.index}>{match[2]}</i>);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function RichText({
  text,
  links = [],
  className = 'section-box__content',
}: RichTextProps) {
  const lines = text.split(/\r?\n/);

  return (
    <div className={className}>
      {lines.map(function (line, index) {
        return (
          <React.Fragment key={`line-${index}`}>
            {index > 0 && <br />}
            <span>{renderInlineNodes(line, links)}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default RichText;
