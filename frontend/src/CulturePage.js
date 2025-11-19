import React, { useState, useEffect } from 'react';
import ContentBlock from './components/ContentBlock';

function CulturePage({ cultureName, onBack }) {
  const [culture, setCulture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Use a default URL if env var is missing (for easier local dev without .env)
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    fetch(`${apiUrl}/api/culture/${cultureName}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCulture(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err);
        setLoading(false);
      });
  }, [cultureName]);

  const renderContent = () => {
    if (!culture) return null;

    const contentArray = Array.isArray(culture.content)
      ? culture.content
      : culture.content?.content;

    if (!contentArray || !Array.isArray(contentArray)) {
      return <p>No content available for this culture.</p>;
    }

    return contentArray.map((block, index) => (
      <ContentBlock key={index} block={block} />
    ));
  };

  if (loading) {
    return (
      <div className="culture-page">
        <button className="back-button" onClick={onBack}>← Back to Search</button>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Discovering {cultureName}...</h2>
          <p>Consulting the archives.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="culture-page">
        <button className="back-button" onClick={onBack}>← Back to Search</button>
        <div style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '50px' }}>
          <h2>Something went wrong.</h2>
          <p>{error.message}</p>
          <button className="search-button" onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="culture-page">
      <button className="back-button" onClick={onBack}>← Back to Search</button>

      <header className="culture-header">
        <h1 className="culture-title">{culture.name}</h1>
      </header>

      <div className="culture-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default CulturePage;
