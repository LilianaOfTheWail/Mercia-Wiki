import React from 'react'
import './MetadataSummary.css'
import { MetadataSummaryProps } from '../../common/types'
import { buildPublicUrl } from '../../utils/navigation'

function MetadataSummary({ name, metadata }: MetadataSummaryProps) {
  // If there is no metadata, we don't render the summary at all
  if (!metadata) {
    return null
  }

  const imageUrl = metadata.image

  const entries = Object.keys(metadata)
    .filter(function (key) {
      return key !== 'image' && key !== 'tags'
    })
    .map(function (key) {
      return {
        key: key,
        value: metadata[key] || ''
      }
    })

  return (
    <aside className="metadata-summary">
      <div className="metadata-summary__header">
        <h2 className="metadata-summary__title">{name}</h2>
      </div>

      {imageUrl && (
        <div className="metadata-summary__image-card">
          <img className="metadata-summary__image" src={buildPublicUrl(imageUrl)} alt={name} />
        </div>
      )}

      <div className="metadata-summary__properties">
        {entries.map(function (item) {
          return (
            <div key={item.key} className="metadata-summary__property">
              <span className="metadata-summary__property-key">{item.key}</span>
              <span className="metadata-summary__property-value">{item.value}</span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default MetadataSummary
