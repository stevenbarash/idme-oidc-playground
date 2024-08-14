import React, { useState, useEffect } from 'react';
import SignInButton from './SignInButton';
import { jwtDecode } from "jwt-decode";

function App() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const getTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const idToken = urlParams.get('id_token');

    if (accessToken && idToken) {
      setToken(accessToken);
      const decodedToken = jwtDecode(idToken); // Use jwt_decode to decode the JWT
      setUserInfo(decodedToken);
    }
  };

  useEffect(() => {
    getTokenFromUrl();
  }, []);

  const renderObject = (obj) => (
    <div style={{ marginLeft: '20px' }}>
      {Object.keys(obj).map((key) => (
        <div key={key}>
          <strong>{key}:</strong>{' '}
          {typeof obj[key] === 'object' && obj[key] !== null ? renderObject(obj[key]) : obj[key].toString()}
        </div>
      ))}
    </div>
  );

  const constructRedirectUri = (path) => {
    return `${window.location.origin}${path}`;
  };

  const clientId = '0f2ce521178825f83f986daa5ce0b2d3';

  return (
    <div className="App" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Sign In with ID.me</h1>

      <SignInButton
        policy="IAL1/AAL1 Policy"
        redirectUri={constructRedirectUri('/authorization-code/callback')}
        clientId={clientId}
        scope="openid http://idmanagement.gov/ns/assurance/ial/1/aal/1"
      />

      <SignInButton
        policy="IAL1/AAL2 Policy"
        redirectUri={constructRedirectUri('/authorization-code/callback')}
        clientId={clientId}
        scope="openid http://idmanagement.gov/ns/assurance/ial/1/aal/2"
      />

      <SignInButton
        policy="IAL2/AAL2 Policy"
        redirectUri={constructRedirectUri('/authorization-code/callback')}
        clientId={clientId}
        scope="openid http://idmanagement.gov/ns/assurance/ial/2/aal/2"
      />

      <SignInButton
        policy="IAL2/AAL2 Always Verify"
        redirectUri={constructRedirectUri('/authorization-code/callback')}
        clientId={clientId}
        scope="openid http://idmanagement.gov/ns/assurance/ial/2/aal/2-always-verify"
      />


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
                  {typeof userInfo[key] === 'object' && userInfo[key] !== null ? renderObject(userInfo[key]) : userInfo[key].toString()}
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
