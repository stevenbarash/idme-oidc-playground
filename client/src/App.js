import React, { useState, useEffect } from "react";
import SignInButton from "./SignInButton";
import { jwtDecode } from "jwt-decode";
import ReactJson from "react-json-view";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const buildRedirectUri = () => {
    return `${window.location.origin}/authorization-code/callback`;
  };

  const buildAuthUrl = () => {
    const baseUrl = `https://api.idmelabs.com/oauth/authorize`;
    const scopeString = `openid ${selectedScopes.join(" ")}`;
    const queryParams = new URLSearchParams({
      client_id: "0f2ce521178825f83f986daa5ce0b2d3",
      redirect_uri: buildRedirectUri(),
      response_type: "code",
      scope: scopeString,
    });
    return `${baseUrl}?${queryParams.toString().replace(/\+/g, '%20')}`;
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">Sign In with ID.me</h1>
          <div className="mb-4">
            <h2>Select Scopes</h2>
            <div className="form-check">
              {[
                { value: "http://idmanagement.gov/ns/assurance/ial/1/aal/1", label: "IAL1/AAL1" },
                { value: "http://idmanagement.gov/ns/assurance/ial/1/aal/2", label: "IAL1/AAL2" },
                { value: "http://idmanagement.gov/ns/assurance/ial/2/aal/2", label: "IAL2/AAL2" },
                { value: "http://idmanagement.gov/ns/assurance/ial/2/aal/2-always-verify", label: "IAL2/AAL2 Always verify" },
                { value: "login", label: "login" },
                { value: "teacher", label: "teacher" },
                { value: "student", label: "student" },
                { value: "nurse", label: "nurse" },
                { value: "military", label: "military" },
                { value: "government", label: "government" },
                { value: "responder", label: "responder" },
                { value: "employee", label: "employee" },
                { value: "alumni", label: "alumni" }
              ].map((scope) => (
                <div key={scope.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={scope.value}
                    onChange={handleScopeChange}
                    checked={selectedScopes.includes(scope.value)}
                  />
                  <label className="form-check-label">
                    {scope.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h2>Generated OIDC URL</h2>
            <p className="alert alert-info">{buildAuthUrl()}</p>
            <SignInButton url={buildAuthUrl()} />
          </div>
          {token && (
            <div className="mt-4">
              <h2>Token:</h2>
              <p className="alert alert-secondary">{token}</p>
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
    </div>
  );
}

export default App;
