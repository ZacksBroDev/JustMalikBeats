import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../../components/molecules/ArticleCard';
import Button from '../../components/atoms/Button';
import './BlogRedesign.css';

const BlogRedesign = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample blog data - replace with actual context/API data
  const articles = [
    {
      id: 1,
      title: "5 Essential Mixing Techniques Every Producer Should Know",
      excerpt: "Master the fundamentals of professional mixing with these time-tested techniques used in top studios worldwide.",
      category: "Production",
      date: "2024-01-15",
      image: "/api/placeholder/800/450",
      content: "Lorem ipsum dolor sit amet..."
    },
    {
      id: 2,
      title: "How to Build Your Sound: Developing a Signature Style",
      excerpt: "Creating a unique sound identity is crucial for standing out in today's music landscape. Here's how to find yours.",
      category: "Career",
      date: "2024-01-10",
      image: "/api/placeholder/800/450",
      content: "Lorem ipsum dolor sit amet..."
    },
    {
      id: 3,
      title: "The Psychology of Beat Making: Creating Emotional Impact",
      excerpt: "Explore how melody, rhythm, and sound design work together to create beats that resonate emotionally.",
      category: "Theory",
      date: "2024-01-05",
      image: "/api/placeholder/800/450",
      content: "Lorem ipsum dolor sit amet..."
    },
    {
      id: 4,
      title: "Monetizing Your Music: Revenue Streams for Producers",
      excerpt: "Turn your passion into profit with these proven strategies for generating income from your productions.",
      category: "Business",
      date: "2024-01-01",
      image: "/api/placeholder/800/450",
      content: "Lorem ipsum dolor sit amet..."
    },
    {
      id: 5,
      title: "Studio Setup on a Budget: Essential Gear for Beginners",
      excerpt: "You don't need to spend thousands to start producing professional-quality music. Here's what you actually need.",
      category: "Gear",
      date: "2023-12-28",
      image: "/api/placeholder/800/450",
      content: "Lorem ipsum dolor sit amet..."
    },
    {
      id: 6,
      title: "Collaborating Remotely: Modern Workflow Best Practices",
      excerpt: "Master the art of long-distance collaboration with these tools and techniques used by top industry professionals.",
      category: "Workflow",
      date: "2023-12-20",
      image: "/api/placeholder/800/450",
      content: "Lorem ipsum dolor sit amet..."
    }
  ];

  const categories = ['all', 'Production', 'Career', 'Theory', 'Business', 'Gear', 'Workflow'];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticle = articles[0];

  return (
    <div className="blog">
      {/* Hero - Featured Article */}
      <section className="blog__hero">
        <div className="blog__hero-image">
          <img src={featuredArticle.image} alt={featuredArticle.title} />
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
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
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
