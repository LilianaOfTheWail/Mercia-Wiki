import { ArticleProps } from '../../common/types';
import MetadataSummary from '../MetadataSummary/MetadataSummary';
import SectionSelector from '../SectionSelector/SectionSelector';
import './Article.css';

function Article({ name, metadata, sections }: ArticleProps) {
  return (
    <article className="article-card">
      <header className="article-card__header">
        <h1 className="article-card__title">{name}</h1>
      </header>

      <div className="article-card__content">
        <div className="article-card__body">
          {sections &&
            sections.map(function (section) {
              return <SectionSelector key={section.key} section={section} />;
            })}
        </div>

        <MetadataSummary name={name} metadata={metadata} />
      </div>
    </article>
  );
}

export default Article;
