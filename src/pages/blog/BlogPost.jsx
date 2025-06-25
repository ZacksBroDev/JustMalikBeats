import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import './BlogPost.css';

function BlogPost() {
  const { id } = useParams();
  const { getBlogPost, blogPosts } = useBlog();
  const post = getBlogPost(id);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag))))
    .slice(0, 3);

  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <div className="logo">
          <Link to="/">
            <img src="/src/assets/icons/MALIKBEATSLOGO.jpg" alt="JustMalikBeats-Logo" />
            <h1>JustMalikBeats</h1>
          </Link>
        </div>
        
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/blog/admin">Admin</Link></li>
          </ul>
        </nav>
      </header>

      <div className="blog-post-hero">
        <div className="hero-image">
          <img src={post.image} alt={post.title} />
        </div>
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="post-meta">
              <span className="post-category">{post.category}</span>
              <span className="post-date">{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <h1>{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>
          </div>
        </div>
      </div>

      <main className="blog-post-main">
        <article className="blog-post-content">
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <div className="post-footer">
            <div className="post-tags">
              <h4>Tags:</h4>
              {post.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
            
            <div className="post-share">
              <h4>Share this post:</h4>
              <div className="share-buttons">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="share-twitter"
                >
                  Twitter
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="share-facebook"
                >
                  Facebook
                </a>
                <a 
                  href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(post.excerpt + ' ' + window.location.href)}`}
                  className="share-email"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </article>

        <aside className="blog-post-sidebar">
          <div className="author-card">
            <img src="/src/assets/icons/MALIKBEATSLOGO.jpg" alt="JustMalikBeats" className="author-image" />
            <div className="author-info">
              <h3>JustMalikBeats</h3>
              <p>Music Producer from Denver, creating beats that capture the essence of the Mile High City's vibrant music scene.</p>
              <div className="author-social">
                <a href="https://open.spotify.com/artist/31qEeNT1N54KjOMpPh3OmA" target="_blank" rel="noopener noreferrer">
                  <img src="/src/assets/icons/spotify.png" alt="Spotify" />
                </a>
                <a href="https://www.youtube.com/@JustMalikBeats" target="_blank" rel="noopener noreferrer">
                  <img src="/src/assets/icons/youtube.png" alt="YouTube" />
                </a>
                <a href="https://www.instagram.com/justmalikbeats/" target="_blank" rel="noopener noreferrer">
                  <img src="/src/assets/icons/insta.png" alt="Instagram" />
                </a>
              </div>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="related-posts">
              <h3>Related Posts</h3>
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.id} className="related-post">
                  <Link to={`/blog/${relatedPost.id}`}>
                    <img src={relatedPost.image} alt={relatedPost.title} />
                    <div className="related-post-content">
                      <h4>{relatedPost.title}</h4>
                      <span className="related-post-date">
                        {new Date(relatedPost.date).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </aside>
      </main>

      <div className="blog-post-navigation">
        <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
      </div>

      <footer>
        <p>&copy; {new Date().getFullYear()} JustMalikBeats. Developed by ZackFullStack</p>
      </footer>
    </div>
  );
}

export default BlogPost;
