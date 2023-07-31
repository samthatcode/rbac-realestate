import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const { token } = useParams();

  useEffect(() => {
    axios.get(`/api/verify-email?token=${token}`)
      .then(response => {
        setVerificationStatus(response.data.message);
      })
      .catch(error => {
        setVerificationStatus('Verification failed');
      });
  }, [token]);

  return (
    <div className="p-4">
      <p className="text-xl">{verificationStatus}</p>
    </div>
  );
}

export default EmailVerification;
