import React, { useState, useEffect } from 'react';
import { diff_match_patch } from 'diff-match-patch';
import DOMPurify from 'dompurify';

// A new component to render individual content blocks and their diffs
function ContentBlock({ oldBlock, newBlock, showDiff }) {
  const dmp = new diff_match_patch();

  const renderBlock = (block, style = {}) => {
    if (!block) return null;
    switch (block.type) {
      case 'paragraph':
        return <p style={style}>{block.data}</p>;
      case 'image':
        return <img style={style} src={block.data} alt="Culture illustration" />;
      case 'video':
        return <iframe style={style} width="560" height="315" src={block.data} title="Culture video" frameBorder="0" allowFullScreen></iframe>;
      default:
        return null;
    }
  };

  if (!showDiff) {
    return renderBlock(newBlock);
  }

  // Handling additions and deletions
  if (!oldBlock) {
    return renderBlock(newBlock, { backgroundColor: '#e6ffed' }); // Light green for additions
  }
  if (!newBlock) {
    return renderBlock(oldBlock, { backgroundColor: '#ffebe9', textDecoration: 'line-through' }); // Light red for deletions
  }

  // Handling content changes
  if (oldBlock.type !== newBlock.type) {
    return (
      <div>
        {renderBlock(oldBlock, { backgroundColor: '#ffebe9', textDecoration: 'line-through' })}
        {renderBlock(newBlock, { backgroundColor: '#e6ffed' })}
      </div>
    );
  }

  if (oldBlock.type === 'paragraph') {
    if (oldBlock.data === newBlock.data) {
      return renderBlock(newBlock);
    }
    const diff = dmp.diff_main(oldBlock.data, newBlock.data);
    dmp.diff_cleanupSemantic(diff);
    const sanitizedHtml = DOMPurify.sanitize(dmp.diff_prettyHtml(diff));
    return <p dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  }

  if (oldBlock.data !== newBlock.data) {
    return (
      <div>
        {renderBlock(oldBlock, { border: '2px solid red' })}
        <p style={{textAlign: 'center'}}>⬇️ Media Updated ⬇️</p>
        {renderBlock(newBlock, { border: '2px solid green' })}
      </div>
    );
  }

  return renderBlock(newBlock);
}


function CulturePage({ cultureName }) {
  const [culture, setCulture] = useState(null);
  const [originalContent, setOriginalContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [factChecking, setFactChecking] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/culture/${cultureName}`)
      .then(res => res.json())
      .then(data => {
        setCulture(data);
        setOriginalContent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [cultureName]);

  const handleFactCheck = () => {
    setFactChecking(true);
    setShowDiff(false);

    fetch(`${process.env.REACT_APP_API_URL}/api/culture/fact-check/${cultureName}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setCulture(data); // The new data becomes the current culture
        // originalContent remains the same until the next fresh load
        setShowDiff(true);
        setFactChecking(false);
      })
      .catch(err => {
        setError(err);
        setFactChecking(false);
      });
  };

  const renderContentWithDiff = () => {
    const oldBlocks = originalContent?.content?.content || [];
    const newBlocks = culture?.content?.content || [];
    const maxLength = Math.max(oldBlocks.length, newBlocks.length);
    let content = [];
    for (let i = 0; i < maxLength; i++) {
      content.push(<ContentBlock key={i} oldBlock={oldBlocks[i]} newBlock={newBlocks[i]} showDiff={true} />);
    }
    return content;
  };

  const renderContent = () => {
    return culture?.content?.content?.map((block, index) => (
      <ContentBlock key={index} newBlock={block} showDiff={false} />
    ));
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const factCheckButtonText = factChecking ? 'Fact-Checking...' : showDiff ? 'View Latest Version' : 'Fact-Check This Entry';


  return (
    <div>
      <h1>{culture.name}</h1>

      {showDiff ? renderContentWithDiff() : renderContent()}

      <button onClick={showDiff ? () => setShowDiff(false) : handleFactCheck} disabled={factChecking}>
        {factCheckButtonText}
      </button>
      {showDiff && (
         <button onClick={handleFactCheck} disabled={factChecking}>Re-run Fact-Check</button>
      )}
    </div>
  );
}

export default CulturePage;
