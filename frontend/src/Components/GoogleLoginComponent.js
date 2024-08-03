import React from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import * as dotenv from 'dotenv';

const CLIENT_ID =process.env.CLIENT_ID;

const GoogleLoginComponent = () => {
  const handleLoginSuccess = async (response) => {
    const { tokenId } = response;

    try {
      // Send the token to the backend
      const res = await axios.post('http://localhost:3000/auth/google', { tokenId });
      if (res.data.success) {
        alert('Authentication successful!');
      } else {
        alert('Authentication failed!');
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  const handleLoginFailure = (response) => {
    console.error('Login failed:', response);
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default GoogleLoginComponent;
