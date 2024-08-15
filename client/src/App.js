import React, { useState, useEffect } from "react";
import SignInButton from "./SignInButton";
import { jwtDecode } from "jwt-decode";
import ReactJson from "react-json-view";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

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
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopeString,
    });
    return `${baseUrl}?${queryParams.toString()}`;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Sign In with ID.me</h1>
          <Card className="p-4 mb-4">
            <h2>Select Scopes</h2>
            <Form>
              {[
                "http://idmanagement.gov/ns/assurance/ial/1/aal/1",
                "http://idmanagement.gov/ns/assurance/ial/1/aal/2",
                "http://idmanagement.gov/ns/assurance/ial/2/aal/2",
                "http://idmanagement.gov/ns/assurance/ial/2/aal/2-always-verify",
                "login",
                "teacher",
                "student",
                "nurse",
                "military",
                "government",
                "responder",
                "employee",
                "alumni"
              ].map((scope) => {
                let displayText = scope;
                if (scope === "http://idmanagement.gov/ns/assurance/ial/1/aal/1") displayText = "IAL1/AAL1";
                else if (scope === "http://idmanagement.gov/ns/assurance/ial/1/aal/2") displayText = "IAL1/AAL2";
                else if (scope === "http://idmanagement.gov/ns/assurance/ial/2/aal/2") displayText = "IAL2/AAL2";
                else if (scope === "http://idmanagement.gov/ns/assurance/ial/2/aal/2-always-verify") displayText = "IAL2/AAL2 Always verify";
            
                return (
                  <Form.Check
                    key={scope}
                    type="checkbox"
                    label={displayText}
                    value={scope}
                    checked={selectedScopes.includes(scope)}
                    onChange={handleScopeChange}
                  />
                );
              })}
            </Form>
          </Card>
          <Card className="p-4 mb-4">
            <h2>Generated OIDC URL</h2>
            <Alert variant="info">{buildAuthUrl()}</Alert>
            <SignInButton policy="Custom" url={buildAuthUrl()} />
          </Card>
          {token && (
            <Card className="p-4">
              <h2>Token:</h2>
              <Alert variant="secondary">{token}</Alert>
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
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
