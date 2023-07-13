import React, { useState } from 'react';

const Search = () => {
  const [result, setResult] = useState('');

  const handleButtonClick = async (apiEndpoint) => {
    try {
      const response = await fetch(apiEndpoint);
      if (response.ok) {
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } else {
        setResult('Error occurred during API call');
      }
    } catch (error) {
      setResult('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Buscas</h2>
      <div>
        <label>Usuários</label>
        <button onClick={() => handleButtonClick('http://localhost:3001/users')}>Buscar </button>
      </div>
      <div>
        <label>professores:</label>
        <button onClick={() => handleButtonClick('http://localhost:3001/profs')}>Buscar</button>
      </div>
      <div>
        <label>Departmentos</label>
        <button onClick={() => handleButtonClick('http://localhost:3001/deptos')}>Buscar</button>
      </div>
      <div>
        <label>Disciplinas</label>
        <button onClick={() => handleButtonClick('http://localhost:3001/courses')}>Buscar</button>
      </div>
      <div>
        <label>Classes</label>
        <button onClick={() => handleButtonClick('http://localhost:3001/classes')}>Buscar</button>
      </div>
      <div>
        <label>Avaliações</label>
        <button onClick={() => handleButtonClick('http://localhost:3001/reviews')}>Buscar</button>
      </div>
      <div>
        <label>Denúncias</label>
        <button onClick={() => handleButtonClick('http://localhost:3001/reports')}>Buscar</button>
      </div>
      {result && (
        <div>
          <h3>API Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default Search;
