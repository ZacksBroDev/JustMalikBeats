import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { blogCategories } from './blogData';
import './Blog.css';
import css from '/src/assets/css/style.module.css';
import malikLogo from '/src/assets/icons/MALIKBEATSLOGO.jpg';
import spotifyIcon from '/src/assets/icons/spotify.png';
import youtubeIcon from '/src/assets/icons/youtube.png';
import instaIcon from '/src/assets/icons/insta.png';

function Blog() {
  const { blogPosts } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="blogContainer">
      <div className='blog-hero'>
        <h1>The Beat Chronicles</h1>
        <p>Insights, stories, and knowledge from the studio</p>
        <Link to="/blog/new" className='create-post-btn'>
          <span>+</span>
          Create New Post
        </Link>
      </div>

      <main className={css.main}>
        <div className={css.content}>
          <div className="blog-filters">
            <button 
              className={selectedCategory === 'All' ? 'active' : ''}
              onClick={() => setSelectedCategory('All')}
            >
              All
            </button>
            {blogCategories.map(category => (
              <button 
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="blog-posts">
            {filteredPosts.map(post => (
              <article key={post.id} className="blog-post-preview">
                <div className="post-image">
                  <Link to={`/blog/${post.id}`}>
                    <img src={post.image} alt={post.title} />
                  </Link>
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <h2>
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-tags">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                  <Link to={`/blog/${post.id}`} className="read-more">Read More</Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className={css.sidebar}>
          <div className={css.sidebarWidget}>
            <h3>About Me</h3>
            <div className={css.aboutWidget}>
              <img src={malikLogo} alt="JustMalikBeats" className={css.authorAvatar} />
              <p>Music Producer from Denver, creating beats that capture the essence of the Mile High City's vibrant music scene.</p>
            </div>
          </div>

          <div className={css.sidebarWidget}>
            <h3>Recent Posts</h3>
            <ul className="recent-posts">
              {blogPosts.slice(0, 3).map(post => (
                <li key={post.id}>
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  <span className="recent-post-date">{new Date(post.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={css.sidebarWidget}>
            <h3>Follow Me</h3>
            <div className={css.socialLinks}>
              <a href="https://open.spotify.com/artist/31qEeNT1N54KjOMpPh3OmA" target="_blank" rel="noopener noreferrer"><img src={spotifyIcon} alt="Spotify" /></a>
              <a href="https://www.youtube.com/@JustMalikBeats" target="_blank" rel="noopener noreferrer"><img src={youtubeIcon} alt="YouTube" /></a>
              <a href="https://www.instagram.com/justmalikbeats/" target="_blank" rel="noopener noreferrer"><img src={instaIcon} alt="Instagram" /></a>
            </div>
          </div>
        </aside>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} JustMalikBeats. Developed by ZackFullStack</p>
      </footer>
    </div>
  );
}

export default Blog;
