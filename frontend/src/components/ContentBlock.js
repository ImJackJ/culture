import React from 'react';

function ContentBlock({ block }) {
  if (!block) return null;

  switch (block.type) {
    case 'paragraph':
      return <p className="content-paragraph">{block.data}</p>;
    case 'image':
      return (
        <div className="content-image-container">
          <img src={block.data} alt="Culture illustration" className="content-image" />
        </div>
      );
    case 'video':
      return (
        <div className="content-video-container">
          <iframe 
            src={block.data} 
            title="Culture video" 
            frameBorder="0" 
            allowFullScreen 
          />
        </div>
      );
    default:
      return null;
  }
}

export default ContentBlock;
