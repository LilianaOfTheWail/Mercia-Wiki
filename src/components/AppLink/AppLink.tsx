import React from 'react'
import { isInternalHref, navigateToPath, resolveHref } from '../../utils/navigation'

type AppLinkProps = {
  href: string
  className?: string
  children: React.ReactNode
}

function AppLink({ href, className, children }: AppLinkProps) {
  const resolvedHref = resolveHref(href)

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isInternalHref(href)) {
      return
    }

    event.preventDefault()
    navigateToPath(href)
  }

  return (
    <a
      href={resolvedHref}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

export default AppLink
