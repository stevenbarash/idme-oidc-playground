import React from 'react';

const SignInButton = ({ policy, redirectUri, clientId, scope }) => {
  const handleSignIn = () => {
    const url = `https://api.idmelabs.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    console.log('Redirecting to:', url);
    window.location.href = url;
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>{policy}</h2>
      <button
        onClick={handleSignIn}
        style={{
          backgroundImage:
            'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-YMPjOgvJ8IbY3KMptZylE9T_wjh1rhWa5Q&s)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '300px',
          height: '58px',
          border: 'none',
          cursor: 'pointer',
          display: 'block',
          margin: '0 auto',
          marginBottom: '20px',
        }}
      ></button>
    </div>
  );
};

export default SignInButton;
