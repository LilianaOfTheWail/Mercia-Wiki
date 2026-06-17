type AppRoute = {
  section: string
  category: string | null
  articleSlug: string | null
}

function getBaseUrl(): string {
  const baseUrl = (globalThis as any).__APP_BASE_URL__ || '/'
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

export function buildPublicUrl(path: string): string {
  const baseUrl = getBaseUrl()
  const normalizedPath = path.replace(/^\/+/, '')
  return `${baseUrl}${normalizedPath}`
}

export function buildRoutePath(path: string): string {
  const normalizedPath = path === '/' ? '' : path.replace(/^\/+/, '')
  return buildPublicUrl(normalizedPath)
}

export function navigateToPath(path: string): void {
  const nextPath = buildRoutePath(path)
  if (window.location.pathname !== nextPath) {
    window.history.pushState({}, '', nextPath)
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function stripBasePath(pathname: string): string {
  const baseUrl = getBaseUrl()
  if (pathname.startsWith(baseUrl)) {
    return pathname.slice(baseUrl.length)
  }

  if (baseUrl !== '/' && pathname.startsWith(baseUrl.slice(0, -1))) {
    return pathname.slice(baseUrl.length - 1)
  }

  return pathname.replace(/^\/+/, '')
}

export function parseAppRoute(pathname: string): AppRoute {
  const relativePath = stripBasePath(pathname)
  const segments = relativePath.split('/').filter(Boolean)

  if (segments.length >= 2) {
    return {
      section: segments[0],
      category: segments[0],
      articleSlug: segments[1]
    }
  }

  if (segments.length === 1) {
    return {
      section: segments[0],
      category: null,
      articleSlug: null
    }
  }

  return {
    section: 'overview',
    category: null,
    articleSlug: null
  }
}

export function isInternalHref(href: string): boolean {
  if (!href) {
    return false
  }

  return href.startsWith('/') && !href.startsWith('//')
}

export function resolveHref(href: string): string {
  return isInternalHref(href) ? buildRoutePath(href) : href
}
