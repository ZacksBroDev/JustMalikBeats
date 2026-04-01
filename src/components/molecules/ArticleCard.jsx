import React from 'react';
import Card from '../atoms/Card';
import './ArticleCard.css';

const ArticleCard = ({ article, featured = false }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const readTime = Math.ceil(article.content?.length / 1000) || 5;

  return (
    <Card hoverable>
      <article className={`article-card ${featured ? 'article-card--featured' : ''}`}>
        <div className="article-card__image">
          <img 
            src={article.image || '/api/placeholder/800/450'} 
            alt={article.title}
          />
          <div className="article-card__category">{article.category}</div>
        </div>
        
        <div className="article-card__content">
          <div className="article-card__meta">
            <time>{formatDate(article.date)}</time>
            <span className="article-card__divider">·</span>
            <span>{readTime} min read</span>
          </div>
          
          <h3 className="article-card__title">{article.title}</h3>
          
          <p className="article-card__excerpt">{article.excerpt}</p>
          
          <div className="article-card__footer">
            <button className="article-card__read-more">
              Read Article
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path 
                  d="M7.5 15L12.5 10L7.5 5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </Card>
  );
};

export default ArticleCard;
