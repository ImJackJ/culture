import React, { useState } from 'react';
import './App.css';
import CulturePage from './CulturePage';

function App() {
  const [cultureName, setCultureName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cultureName.trim()) {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    setSubmitted(false);
    setCultureName('');
  };

  if (submitted) {
    return <CulturePage cultureName={cultureName} onBack={handleBack} />;
  }

  return (
    <div className="App">
      <main className="hero-section">
        <h1 className="hero-title">Subculture Encyclopedia</h1>
        <p className="hero-subtitle">
          Explore the hidden worlds, traditions, and aesthetics of internet and real-world subcultures.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            value={cultureName}
            onChange={(e) => setCultureName(e.target.value)}
            placeholder="Search for a subculture (e.g. Goth, Cottagecore)..."
            autoFocus
          />
          <button className="search-button" type="submit">Explore</button>
        </form>
      </main>
    </div>
  );
}

export default App;
