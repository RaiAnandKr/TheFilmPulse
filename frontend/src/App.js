import React, { useState, useEffect } from 'react'; // Assuming you've fixed import issue

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend.gentleisland-bcedf421.centralindia.azurecontainerapps.io');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  );
}

export default App;
