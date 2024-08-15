import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import ReactJson from "react-json-view";
import SignInButton from "./SignInButton"; // Assuming SignInButton is a custom component

function App() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedScopes, setSelectedScopes] = useState([]);
  const [ialPolicy, setIalPolicy] = useState("");

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

  const constructRedirectUri = (path) => {
    return `${window.location.origin}${path}`;
  };

  const buildUrl = () => {
    const baseUrl = constructRedirectUri("/authorization-code/callback");
    const scopeString = `openid ${selectedScopes.join(" ")}`;
    return `${baseUrl}?client_id=0f2ce521178825f83f986daa5ce0b2d3&scope=${encodeURIComponent(
      scopeString
    )}&response_type=code`;
  };

  return (
    <div
      className="App"
      style={{
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Sign In with ID.me</h1>
      <div style={{ marginBottom: "20px" }}>
        <h2>Select Scopes</h2>
        <label>
          <input
            type="checkbox"
            value="http://idmanagement.gov/ns/assurance/ial/1/aal/1"
            onChange={handleScopeChange}
            checked={selectedScopes.includes(
              "http://idmanagement.gov/ns/assurance/ial/1/aal/1"
            )}
          />
          NIST IAL1/AAL1
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="http://idmanagement.gov/ns/assurance/ial/1/aal/2"
            onChange={handleScopeChange}
            checked={selectedScopes.includes(
              "http://idmanagement.gov/ns/assurance/ial/1/aal/2"
            )}
          />
          NIST IAL1/AAL2
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="http://idmanagement.gov/ns/assurance/ial/2/aal/2"
            onChange={handleScopeChange}
            checked={selectedScopes.includes(
              "http://idmanagement.gov/ns/assurance/ial/2/aal/2"
            )}
          />
          NIST IAL2/AAL2
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="http://idmanagement.gov/ns/assurance/ial/2/aal/2-always-verify"
            onChange={handleScopeChange}
            checked={selectedScopes.includes(
              "http://idmanagement.gov/ns/assurance/ial/2/aal/2-always-verify"
            )}
          />
          NIST IAL2/AAL2 Always Verify
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="login"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("login")}
          />
          Login
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="teacher"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("teacher")}
          />
          Teacher
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="student"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("student")}
          />
          Student
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="nurse"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("nurse")}
          />
          Nurse
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="military"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("military")}
          />
          Military
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="government"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("government")}
          />
          Government
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="responder"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("responder")}
          />
          First Responder
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="employee"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("employee")}
          />
          Employee
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="alumni"
            onChange={handleScopeChange}
            checked={selectedScopes.includes("alumni")}
          />
          Alumni
        </label>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Generated OIDC URL</h2>
        <p>{buildUrl()}</p>
        <SignInButton
          policy="Custom"
          redirectUri={buildUrl()}
          clientId="0f2ce521178825f83f986daa5ce0b2d3"
          scope={selectedScopes.join(" ")} // Pass selected scopes to SignInButton
        />
      </div>
      <div className="tokenDisplay">
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
