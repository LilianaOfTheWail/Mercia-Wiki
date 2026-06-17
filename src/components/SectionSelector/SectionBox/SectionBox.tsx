import React from 'react';
import './SectionBox.css';
import { ArticleSectionProps } from '../../../common/types';
import RichText from '../../RichText/RichText';

function SectionBox({ title, content, links }: ArticleSectionProps) {
  return (
    <section className="section-box">
      <div className="section-box__header">
        <h2 className="section-box__title">{title}</h2>
      </div>
      <RichText text={content || ''} links={links} />
    </section>
  );
}

export default SectionBox;
