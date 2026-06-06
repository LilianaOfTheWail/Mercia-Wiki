import React, { useState, useEffect } from 'react'
import LateralBar from './components/LateralBar/LateralBar'
import Article from './components/Article/Article'
import { router } from './utils/router'

function App() {
  const [activeSection, setActiveSection] = useState('overview')
  const [activeArticle, setActiveArticle] = useState(null)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)

  // Initialize router on mount
  useEffect(() => {
    router.initialize()
  }, [])

  // Handle section or article selection
  const handleSelect = async (key) => {
    console.log('[App] handleSelect called with key:', key)
    
    if (!key) {
      console.log('[App] Key is empty, resetting to overview')
      setActiveSection('overview')
      setActiveArticle(null)
      return
    }

    // Check if it's a compound key (e.g., "kingdoms.glowstowe")
    if (key.includes('.')) {
      console.log('[App] Compound key detected, loading article')
      setLoading(true)
      try {
        console.log('[App] Calling router.getArticle with:', key)
        const article = await router.getArticle(key)
        console.log('[App] Article returned from router:', article)
        
        if (article) {
          // Extract category from key
          const category = key.split('.')[0]
          console.log('[App] Setting active section to:', category)
          console.log('[App] Setting active article')
          setActiveSection(category)
          setActiveArticle(article)
        } else {
          console.log('[App] No article returned from router')
          setActiveArticle(null)
        }
      } catch (error) {
        console.error('[App] Error loading article:', error)
        setActiveArticle(null)
      } finally {
        setLoading(false)
      }
    } else {
      // It's a section key
      console.log('[App] Section key detected, setting section:', key)
      setActiveSection(key)
      setActiveArticle(null)
    }
  }

  const sectionLabel = {
    overview: 'Overview',
    kingdoms: 'Kingdoms',
    characters: 'Characters',
    locations: 'Locations',
    lore: 'Lore'
  }[activeSection]

  return (
    <div className={`app-shell ${isNavCollapsed ? 'nav-collapsed' : ''}`}>
      <LateralBar
        activeKey={activeSection}
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
