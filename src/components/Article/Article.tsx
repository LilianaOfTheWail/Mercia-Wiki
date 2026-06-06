import MetadataSummary from '../MetadataSummary/MetadataSummary'
import SectionSelector from '../SectionSelector/SectionSelector'
import './Article.css'

interface ArticleLink {
  name: string
  url: string
}

interface ArticleSection {
  key: string
  content?: string
  links?: ArticleLink[]
  query?: string
}

interface ArticleProps {
  name: string
  metadata: Record<string, string>
  sections: ArticleSection[]
}

function Article({ name, metadata, sections }: ArticleProps) {
  return (
    <article className="article-card">
      <header className="article-card__header">
        <h1 className="article-card__title">{name}</h1>
      </header>

      <div className="article-card__content">
        <div className="article-card__body">
          {sections.map(function (section) {
            return (
              <SectionSelector
                key={section.key}
                section={section}
                locationName={name}
              />
            )
          })}
        </div>

        <MetadataSummary name={name} properties={metadata} />
      </div>
    </article>
  )
}

export default Article
