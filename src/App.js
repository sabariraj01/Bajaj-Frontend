import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const JsonProcessorApp = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [serverResponse, setServerResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleJsonChange = (event) => {
    setJsonInput(event.target.value);
  };

  const submitJson = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data) {
        setErrorMessage('Invalid JSON input format.');
        return;
      }

      const response = await axios.post('https://bajaj-backend-pnlz.onrender.com/bfhl', parsedJson);
      setServerResponse(response.data);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to process JSON input or server error.');
      console.error(error);
    }
  };

  const displayOptions = [
    { value: 'numbers', label: 'Numbers' },
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' },
  ];

  const renderFilteredResponse = () => {
    if (!serverResponse) return null;
    const filteredData = {};
    selectedFilters.forEach((filter) => {
      filteredData[filter.value] = serverResponse[filter.value];
    });
    return (
      <div>
        {Object.entries(filteredData).map(([key, value]) => (
          <div key={key}>
            <h3>{key}</h3>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>S Sabari Raj | AP21110011027</h1>
      <div>
        <textarea
          rows="4"
          cols="50"
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder='Enter JSON here: { "data": ["A", "C", "z"] }'
        />
      </div>
      <div>
        <button onClick={submitJson}>Submit JSON</button>
      </div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {serverResponse && (
        <div style={{ marginTop: '20px' }}>
          <Select
            isMulti
            options={displayOptions}
            onChange={setSelectedFilters}
            placeholder="Choose data to display"
          />
          <div style={{ marginTop: '20px' }}>
            {renderFilteredResponse()}
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonProcessorApp;
