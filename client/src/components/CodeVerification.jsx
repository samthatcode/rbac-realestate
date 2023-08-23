import React, { useState } from 'react';
import axios from 'axios';

function CodeVerification() {
  const [code, setCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();

    axios.post('https://surefinders-backend.onrender.com/api/verify-code', { code }, { withCredentials: true })
      .then(response => {
        setVerificationStatus(response.data.message);
      })
      .catch(error => {
        setVerificationStatus('Verification failed');
      });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          className="border p-2"
          placeholder="Enter your verification code"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">Submit</button>
      </form>
      {verificationStatus && <p className="text-xl">{verificationStatus}</p>}
    </div>
  );
}

export default CodeVerification;
