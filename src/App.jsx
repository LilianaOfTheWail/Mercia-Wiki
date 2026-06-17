import React, { useEffect, useRef, useState } from 'react'
import LateralBar from './components/LateralBar/LateralBar'
import Article from './components/Article/Article'
import { getArticleByName } from './utils/dataService'
import { navigateToPath, parseAppRoute } from './utils/navigation'

function formatSectionLabel(section) {
  if (!section) {
    return 'Overview'
  }

  return section
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(() =>
    parseAppRoute(window.location.pathname)
  )
  const [activeArticle, setActiveArticle] = useState(null)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const routeRequestId = useRef(0)

  useEffect(() => {
    const syncFromLocation = async () => {
      const requestId = ++routeRequestId.current
      const nextRoute = parseAppRoute(window.location.pathname)

      setCurrentRoute(nextRoute)

      if (nextRoute.category && nextRoute.articleSlug) {
        setLoading(true)

        try {
          const article = await getArticleByName(
            nextRoute.category,
            nextRoute.articleSlug
          )

          if (routeRequestId.current !== requestId) {
            return
          }

          setActiveArticle(article)
        } catch (error) {
          if (routeRequestId.current === requestId) {
            setActiveArticle(null)
          }
        } finally {
          if (routeRequestId.current === requestId) {
            setLoading(false)
          }
        }

        return
      }

      setActiveArticle(null)
      setLoading(false)
    }

    const handlePopState = () => {
      syncFromLocation()
    }

    syncFromLocation()
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      routeRequestId.current += 1
    }
  }, [])

  // Handle section or article selection from navigation
  const handleSelect = (key) => {
    if (!key) {
      navigateToPath('/')
      return
    }

    if (key.startsWith('/')) {
      navigateToPath(key)
      return
    }

    if (key.includes('.')) {
      navigateToPath(`/${key.replace('.', '/')}`)
      return
    }

    navigateToPath(key === 'overview' ? '/' : `/${key}`)
  }

  const selectedItemKey = currentRoute.category && currentRoute.articleSlug
    ? `${currentRoute.category}.${currentRoute.articleSlug}`
    : null

  const sectionLabel = formatSectionLabel(currentRoute.section)

  return (
    <div className={`app-shell ${isNavCollapsed ? 'nav-collapsed' : ''}`}>
      <LateralBar
        activeKey={currentRoute.section}
        selectedKey={selectedItemKey}
        onSelect={handleSelect}
        collapsed={isNavCollapsed}
        onToggle={() => setIsNavCollapsed((value) => !value)}
      />

      <main className="app-main">
        <div className="page-header">
          <span className="page-topic">{sectionLabel}</span>
          <h1>Mercia Wiki</h1>
        </div>

        <div className="page-layout">
          {loading ? (
            <div>Loading article...</div>
          ) : activeArticle ? (
            <Article
              name={activeArticle.name}
              metadata={activeArticle.metadata || {}}
              sections={activeArticle.sections || []}
            />
          ) : (
            <div>Select an item from the navigation</div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
