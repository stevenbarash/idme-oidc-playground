import React, { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const handleSignIn = (url) => {
    console.log('Redirecting to:', url);
    window.location.href = url;
  };
  const getTokenFromBackend = async (code) => {
    console.log('Fetching token with code:', code);
    try {
      const response = await fetch('http://localhost:5001/authorization-code/callback?code=' + code, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }

      const data = await response.json();
      console.log('Received token data:', data);
      setToken(data.access_token);
      setUserInfo(data.user_info);
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const getTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      getTokenFromBackend(code);
    }
  };

  useEffect(() => {
    getTokenFromUrl();
  }, []);

  const renderObject = (obj) => {
    return (
      <div style={{ marginLeft: '20px' }}>
        {Object.keys(obj).map((key) => (
          <div key={key}>
            <strong>{key}:</strong>{' '}
            {typeof obj[key] === 'object' && obj[key] !== null ? (
              renderObject(obj[key])
            ) : (
              obj[key].toString()
            )}
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="App" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Sign In with ID.me</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2>IAL1/AAL1 Policy</h2>
        <button
          onClick={() =>
            handleSignIn(
              'https://api.idmelabs.com/oauth/authorize?client_id=0f2ce521178825f83f986daa5ce0b2d3&redirect_uri=http://localhost:3020/authorization-code/callback&response_type=code&scope=openid http://idmanagement.gov/ns/assurance/ial/1/aal/1'
            )
          }
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

      <div style={{ marginBottom: '30px' }}>
        <h2>IAL1/AAL2 Policy</h2>
        <button
          onClick={() =>
            handleSignIn(
              'https://api.idmelabs.com/oauth/authorize?client_id=0f2ce521178825f83f986daa5ce0b2d3&redirect_uri=http://localhost:3020/authorization-code/callback&response_type=code&scope=openid http://idmanagement.gov/ns/assurance/ial/1/aal/2'
            )
          }
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

      <div style={{ marginBottom: '30px' }}>
        <h2>IAL2/AAL2 Policy</h2>
        <button
          onClick={() =>
            handleSignIn(
              'https://api.idmelabs.com/oauth/authorize?client_id=0f2ce521178825f83f986daa5ce0b2d3&redirect_uri=http://localhost:3020/authorization-code/callback&response_type=code&scope=openid http://idmanagement.gov/ns/assurance/ial/2/aal/2'
            )
          }
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

      <div style={{ marginBottom: '30px' }}>
        <h2>IAL2/AAL2 Always Verify</h2>
        <button
          onClick={() =>
            handleSignIn(
              'https://api.idmelabs.com/oauth/authorize?client_id=0f2ce521178825f83f986daa5ce0b2d3&redirect_uri=http://localhost:3020/authorization-code/callback&response_type=code&scope=openid http://idmanagement.gov/ns/assurance/ial/2/aal/2-always-verify'
            )
          }
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

      {token && (
        <div style={{ marginTop: '20px' }}>
          <h2>Token:</h2>
          <p>{token}</p>
          <h2>User Information:</h2>
          {userInfo && (
            <div>
              {Object.keys(userInfo).map((key) => (
                <div key={key}>
                  <strong>{key}:</strong>{' '}
                  {typeof userInfo[key] === 'object' && userInfo[key] !== null ? (
                    renderObject(userInfo[key])
                  ) : (
                    userInfo[key].toString()
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

    )}
    </div>
  );
}

export default App;
