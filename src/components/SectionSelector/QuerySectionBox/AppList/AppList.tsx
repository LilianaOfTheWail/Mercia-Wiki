import React from 'react'
import './AppList.css'
import { MetadataSummaryProps } from '../../../../common/types'
import AppLink from '../../../AppLink/AppLink'

interface AppListProps {
  items: MetadataSummaryProps[]
}

function AppList({ items }: AppListProps) {
  return (
    <ul className="app-list">
      {items.map((item) => (
        <li key={item.name} className="app-list__item">
          <AppLink href={item.href || '#'} className="app-list__link">
            {item.name}
          </AppLink>
        </li>
      ))}
    </ul>
  )
}

export default AppList
