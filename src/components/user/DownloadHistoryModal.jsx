import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './DownloadHistoryModal.css';

const DownloadHistoryModal = ({ isOpen, onClose }) => {
  const { currentUser, getDownloadHistory, addDownloadRecord } = useUser();
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'track', 'type'
  
  if (!isOpen) return null;

  const downloadHistory = getDownloadHistory();
  
  // Sort download history based on selected option
  const sortedHistory = [...downloadHistory].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.downloadDate) - new Date(a.downloadDate);
      case 'track':
        return a.trackTitle.localeCompare(b.trackTitle);
      case 'type':
        return a.fileType.localeCompare(b.fileType);
      default:
        return 0;
    }
  });

  const handleDownload = (purchase, fileType) => {
    const downloadUrl = fileType === 'track' ? purchase.downloadUrl : purchase.stemsUrl;
    
    // Record the download attempt
    addDownloadRecord({
      purchaseId: purchase.id,
      trackTitle: purchase.trackTitle,
      artist: purchase.artist,
      fileType: fileType,
      downloadUrl: downloadUrl
    });

    // In a real app, this would trigger the actual download
    // For now, we'll just open the URL
    window.open(downloadUrl, '_blank');
  };

  const getFileTypeIcon = (fileType) => {
    return fileType === 'track' ? '🎵' : '🎛️';
  };

  const getFileTypeName = (fileType) => {
    return fileType === 'track' ? 'Track' : 'Stems';
  };

  return (
    <div className="download-modal-overlay" onClick={onClose}>
      <div className="download-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📁 Download History</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {downloadHistory.length === 0 ? (
            <div className="no-downloads">
              <div className="no-downloads-icon">📥</div>
              <h3>No downloads yet</h3>
              <p>Your download history will appear here when you download purchased tracks.</p>
            </div>
          ) : (
            <>
              <div className="download-controls">
                <div className="download-stats">
                  <span className="stat">
                    <strong>{downloadHistory.length}</strong> total downloads
                  </span>
                  <span className="stat">
                    <strong>{new Set(downloadHistory.map(d => d.trackTitle)).size}</strong> unique tracks
                  </span>
                </div>
                
                <div className="sort-controls">
                  <label htmlFor="sortBy">Sort by:</label>
                  <select 
                    id="sortBy" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="track">Track Name</option>
                    <option value="type">File Type</option>
                  </select>
                </div>
              </div>

              <div className="download-list">
                {sortedHistory.map((download, index) => (
                  <div key={`${download.purchaseId}-${download.downloadDate}-${index}`} className="download-item">
                    <div className="download-info">
                      <div className="download-header">
                        <span className="file-type-icon">
                          {getFileTypeIcon(download.fileType)}
                        </span>
                        <div className="track-info">
                          <h4>{download.trackTitle}</h4>
                          <p className="artist">{download.artist}</p>
                        </div>
                      </div>
                      
                      <div className="download-details">
                        <span className="file-type">{getFileTypeName(download.fileType)}</span>
                        <span className="download-date">
                          {new Date(download.downloadDate).toLocaleDateString()} at{' '}
                          {new Date(download.downloadDate).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      className="redownload-btn"
                      onClick={() => handleDownload(download, download.fileType)}
                      title="Download again"
                    >
                      📥 Re-download
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Quick Access to Purchased Tracks */}
          {currentUser?.purchases && currentUser.purchases.length > 0 && (
            <div className="quick-downloads">
              <h3>📦 Your Purchased Tracks</h3>
              <p>Quick access to all your purchased content</p>
              
              <div className="purchased-tracks">
                {currentUser.purchases.map(purchase => (
                  <div key={purchase.id} className="purchased-track">
                    <div className="track-info">
                      <h4>{purchase.trackTitle}</h4>
                      <p>{purchase.artist}</p>
                    </div>
                    
                    <div className="download-buttons">
                      <button 
                        className="download-btn track"
                        onClick={() => handleDownload(purchase, 'track')}
                      >
                        🎵 Track
                      </button>
                      <button 
                        className="download-btn stems"
                        onClick={() => handleDownload(purchase, 'stems')}
                      >
                        🎛️ Stems
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadHistoryModal;
