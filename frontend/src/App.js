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

  if (submitted) {
    return <CulturePage cultureName={cultureName} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Subculture Encyclopedia</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={cultureName}
            onChange={(e) => setCultureName(e.target.value)}
            placeholder="Enter a subculture..."
          />
          <button type="submit">Search</button>
        </form>
      </header>
    </div>
  );
}

export default App;
