import React from 'react'
import './MetadataSummary.css'

interface MetadataProperties {
  image?: string
  [key: string]: string | undefined
}

interface MetadataSummaryProps {
  name: string
  properties: MetadataProperties
}

function MetadataSummary({ name, properties }: MetadataSummaryProps) {
  const imageUrl = properties.image

  const entries = Object.keys(properties)
    .filter(function (key) {
      return key !== 'image'
    })
    .map(function (key) {
      return {
        key: key,
        value: properties[key] as string
      }
    })

  return (
    <aside className="metadata-summary">
      <div className="metadata-summary__header">
        <h2 className="metadata-summary__title">{name}</h2>
      </div>

      {imageUrl && (
        <div className="metadata-summary__image-card">
          <img className="metadata-summary__image" src={imageUrl} alt={name} />
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
