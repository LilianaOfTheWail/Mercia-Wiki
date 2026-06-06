import React, { useState, useEffect } from 'react'
import './QuerySectionBox.css'

interface QueryResult {
  name: string
  metadata: Record<string, string>
}

interface QuerySectionBoxProps {
  title: string
  query: string
  locationName: string
}

function QuerySectionBox({ title, query, locationName }: QuerySectionBoxProps) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAndFilterData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch the JSON file
        const response = await fetch(`/pages/Kingdom/${query}.json`)
        if (!response.ok) throw new Error(`Failed to load ${query}`)
        const data = await response.json()

        // Determine if data is an array or has a key containing array
        const items = Array.isArray(data) ? data : Object.values(data).flat()

        // Filter items where metadata.tags contains the locationName
        const filtered = items.filter((item: any) => {
          if (!item.metadata || !item.metadata.tags) {
            return false
          }
          const tags = item.metadata.tags.split(',').map((tag: string) => tag.trim())
          return tags.includes(locationName)
        })

        setResults(filtered)
      } catch (err) {
        setError(`Failed to load data from ${query}: ${err instanceof Error ? err.message : String(err)}`)
        console.error('QuerySectionBox error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAndFilterData()
  }, [query, locationName])

  if (loading) {
    return (
      <section className="query-section-box">
        <div className="query-section-box__header">
          <h2 className="query-section-box__title">{title}</h2>
        </div>
        <div className="query-section-box__content">Loading...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="query-section-box query-section-box--error">
        <div className="query-section-box__header">
          <h2 className="query-section-box__title">{title}</h2>
        </div>
        <div className="query-section-box__content query-section-box__content--error">{error}</div>
      </section>
    )
  }

  return (
    <section className="query-section-box">
      <div className="query-section-box__header">
        <h2 className="query-section-box__title">{title}</h2>
      </div>
      {results.length > 0 ? (
        <div className="query-section-box__list">
          {results.map((result: any) => (
            <div key={result.name} className="query-section-box__item">
              <h3 className="query-section-box__item-name">{result.name}</h3>
              {Object.entries(result.metadata).map(([key, value]: [string, any]) => (
                <div key={key} className="query-section-box__item-meta">
                  <span className="query-section-box__item-meta-key">{key}:</span>
                  <span className="query-section-box__item-meta-value">{String(value)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="query-section-box__content">No results found for this location.</div>
      )}
    </section>
  )
}

export default QuerySectionBox
