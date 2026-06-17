import React from 'react'
import SectionBox from './SectionBox/SectionBox'
import QuerySectionBox from './QuerySectionBox/QuerySectionBox'
import { SectionSelectorProps } from '../../common/types'

function SectionSelector({ section }: SectionSelectorProps) {
  if (section.query) {
    return (
      <QuerySectionBox
        title={section.key}
        query={section.query}
      />
    )
  }

  return (
    <SectionBox
      title={section.key}
      content={section.content}
      links={section.links}
    />
  )
}

export default SectionSelector
