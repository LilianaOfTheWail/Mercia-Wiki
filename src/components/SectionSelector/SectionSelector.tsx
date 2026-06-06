import React from 'react'
import SectionBox from './SectionBox/SectionBox'
import QuerySectionBox from './QuerySectionBox/QuerySectionBox'

interface SectionLink {
  name: string
  url: string
}

interface SectionWithQuery {
  key: string
  query: string
}

interface SectionWithContent {
  key: string
  content: string
  links: SectionLink[]
}

type Section = SectionWithQuery | SectionWithContent

interface SectionSelectorProps {
  section: Section
  locationName: string
}

function isQuerySection(section: Section): section is SectionWithQuery {
  return 'query' in section && section.query !== undefined
}

function SectionSelector({ section, locationName }: SectionSelectorProps) {
  if (isQuerySection(section)) {
    return (
      <QuerySectionBox
        title={section.key}
        query={section.query}
        locationName={locationName}
      />
    )
  }

  const contentSection = section as SectionWithContent
  return (
    <SectionBox
      title={contentSection.key}
      content={contentSection.content}
      links={contentSection.links}
    />
  )
}

export default SectionSelector
