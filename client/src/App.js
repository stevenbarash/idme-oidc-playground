import React, { useState, useEffect } from "react";
import SignInButton from "./SignInButton";
import {jwtDecode} from "jwt-decode";
import ReactJson from "react-json-view";

function App() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedScopes, setSelectedScopes] = useState([]);
  const [ialPolicy, setIalPolicy] = useState("");

  const redirectUri = "https://idme-demo-app-8ef557295d28.herokuapp.com/authorization-code/callback";

  const getTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const idToken = urlParams.get("id_token");

    if (accessToken && idToken) {
      setToken(accessToken);
      const decodedToken = jwtDecode(idToken);
      setUserInfo(decodedToken);
    }
  };

  useEffect(() => {
    getTokenFromUrl();
  }, []);

  const handleScopeChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      if (value.includes("ial/")) {
        if (ialPolicy) {
          alert("You can only select one IAL policy.");
          return;
        }
        setIalPolicy(value);
      }
      setSelectedScopes([...selectedScopes, value]);
    } else {
      if (value.includes("ial/")) {
        setIalPolicy("");
      }
      setSelectedScopes(selectedScopes.filter((scope) => scope !== value));
    }
  };

  const buildAuthUrl = () => {
    const baseUrl = `https://api.idmelabs.com/oauth/authorize`;
    const scopeString = `openid ${selectedScopes.join(" ")}`;
    const queryParams = new URLSearchParams({
      client_id: "0f2ce521178825f83f986daa5ce0b2d3",
      redirect_uri: redirectUri, // Use hardcoded redirect URI
      response_type: "code",
      scope: scopeString,
    });
    return `${baseUrl}?${queryParams.toString()}`;
  };

  return (
    <div className="App" style={{ padding: "50px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1>Sign In with ID.me</h1>
        <div style={{ marginBottom: "20px" }}>
          <h2>Select Scopes</h2>
          {["http://idmanagement.gov/ns/assurance/ial/1/aal/1", "http://idmanagement.gov/ns/assurance/ial/1/aal/2", "http://idmanagement.gov/ns/assurance/ial/2/aal/2", "http://idmanagement.gov/ns/assurance/ial/2/aal/2-always-verify", "login", "teacher", "student", "nurse", "military", "government", "responder", "employee", "alumni"].map((scope) => (
            <label key={scope}>
              <input
                type="checkbox"
                value={scope}
                onChange={handleScopeChange}
                checked={selectedScopes.includes(scope)}
              />
              {scope.split("/").pop()}
            </label>
          ))}
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2>Generated OIDC URL</h2>
          <p>{buildAuthUrl()}</p>
          <SignInButton policy="Custom" url={buildAuthUrl()} />
        </div>
        {token && (
          <div style={{ marginTop: "20px" }}>
            <h2>Token:</h2>
            <p>{token}</p>
            <h2>User Information:</h2>
            {userInfo && (
              <ReactJson
                src={userInfo}
                name={false}
                collapsed={false}
                enableClipboard={false}
                displayDataTypes={false}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
