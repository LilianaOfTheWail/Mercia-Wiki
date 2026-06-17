import React, { useEffect, useState } from 'react'
import './QuerySectionBox.css'
import { buildTableOfContents } from '../../../utils/dataView'
import { DataViewQueryInput, MetadataSummaryProps } from '../../../common/types'
import AppList from './AppList/AppList'
import AppTable from './AppTable/AppTable'

interface QuerySectionBoxProps {
  title: string
  query: DataViewQueryInput
}

function QuerySectionBox({ title, query }: QuerySectionBoxProps) {
  const [results, setResults] = useState([] as MetadataSummaryProps[])
  const fields = query.dataFields || []
  const useTable = fields.length > 0

  useEffect(() => {
    let active = true

    buildTableOfContents(query)
      .then((data) => {
        if (active) {
          setResults(data)
        }
      })
      .catch(() => {
        if (active) {
          setResults([])
        }
      })

    return () => {
      active = false
    }
  }, [query])

  return (
    <section className="query-section-box">
      <div className="query-section-box__header">
        <div>
          <h2 className="query-section-box__title">{title}</h2>
          <p className="query-section-box__subtitle">
            {useTable ? 'Structured view' : 'Quick list view'}
          </p>
        </div>
        <span className="query-section-box__count">{results.length} entries</span>
      </div>

      {results.length === 0 ? (
        <div className="query-section-box__empty">No entries matched this query.</div>
      ) : useTable ? (
        <AppTable items={results} fields={fields} />
      ) : (
        <AppList items={results} />
      )}
    </section>
  )
}

export default QuerySectionBox
