import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import ArticleCard from '../../components/molecules/ArticleCard';
import Button from '../../components/atoms/Button';
import './BlogRedesign.css';

const BlogRedesign = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { blogPosts } = useBlog();
  const sortedArticles = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const categories = ['all', ...new Set(sortedArticles.map((article) => article.category))];

  const filteredArticles = selectedCategory === 'all' 
    ? sortedArticles
    : sortedArticles.filter(article => article.category === selectedCategory);

  const featuredArticle = sortedArticles[0];
  const gridArticles = filteredArticles;

  if (!featuredArticle) {
    return (
      <div className="blog">
        <section className="blog__grid">
          <div className="container">
            <div className="blog__empty">
              <h2>No articles published yet</h2>
              <p>Check back soon for new posts.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="blog">
      {/* Hero - Featured Article */}
      <section className="blog__hero">
        <div className="blog__hero-image">
          <img
            src={featuredArticle.featuredImage || featuredArticle.image}
            alt={featuredArticle.featuredImageAlt || featuredArticle.imageAlt || featuredArticle.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{ objectPosition: featuredArticle.featuredImagePosition || featuredArticle.imagePosition || 'center center' }}
          />
          <div className="blog__hero-overlay"></div>
        </div>
        
        <div className="blog__hero-content">
          <div className="container">
            <span className="blog__hero-category">{featuredArticle.category}</span>
            <h1>{featuredArticle.title}</h1>
            <p>{featuredArticle.excerpt}</p>
            <Link to={`/blog/${featuredArticle.id}`}>
              <Button variant="primary" size="lg">Read Article</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="blog__filters">
        <div className="container">
          <div className="blog__filters-content">
            {categories.map((category) => (
              <button
                key={category}
                className={`blog__filter-pill ${selectedCategory === category ? 'blog__filter-pill--active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="blog__grid">
        <div className="container">
          <div className="blog__articles">
            {gridArticles.length > 0 ? (
              gridArticles.map((article) => (
                <Link key={article.id} to={`/blog/${article.id}`}>
                  <ArticleCard article={article} />
                </Link>
              ))
            ) : (
              <div className="blog__empty">
                <h2>No articles found</h2>
                <p>Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogRedesign;
