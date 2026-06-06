import React from 'react'
import './SectionBox.css'

interface SectionLink {
  name: string
  url: string
}

interface SectionBoxProps {
  title?: string
  content?: string
  links?: SectionLink[]
}

function renderInlineContent(text: string, links: SectionLink[]) {
  const linkMap: Record<string, string> = {}
  links.forEach(function (link) {
    linkMap[link.name] = link.url
  })

  const nodes: React.ReactNode[] = []
  const regex = /\[\[([^\]]+)\]\]/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const linkName = match[1]
    if (linkMap[linkName]) {
      nodes.push(
        React.createElement(
          'a',
          {
            key: linkName + '-' + match.index,
            href: linkMap[linkName],
            className: 'section-box__inline-link'
          },
          linkName
        )
      )
    } else {
      nodes.push(match[0])
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function renderContent(text: string, links: SectionLink[]) {
  const lines = text.split(/\r?\n/)
  const elements: React.ReactNode[] = []

  lines.forEach(function (line, index) {
    if (index > 0) {
      elements.push(React.createElement('br', { key: 'br-' + index }))
    }
    const children = renderInlineContent(line, links)
    elements.push(
      React.createElement('span', { key: 'line-' + index }, children)
    )
  })

  return elements
}

function SectionBox({ title = '', content = '', links = [] }: SectionBoxProps) {
  return (
    <section className="section-box">
      <div className="section-box__header">
        <h2 className="section-box__title">{title}</h2>
      </div>
      <div className="section-box__content">{renderContent(content, links)}</div>
{/*       {links.length > 0 && (
        <div className="section-box__link-list">
          {links.map(function (link) {
            return (
              <a key={link.name} href={link.url} className="section-box__action-link">
                {link.name}
              </a>
            )
          })}
        </div>
      )} */}
    </section>
  )
}

export default SectionBox
