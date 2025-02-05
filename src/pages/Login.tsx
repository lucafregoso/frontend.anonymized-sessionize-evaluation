import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CmInput,
  CmRow,
  CmCol,
  CmButton,
  CmContainer,
} from "@emotioncod/cm-design-system-react";

import config from "../lib/config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${config.apiBaseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("cmrm25", data.token);
      navigate("/sessions");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <CmContainer className="login-container">
          <CmRow>
            <CmCol sm={12} md={6}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </CmCol>
            <CmCol sm={12} md={6}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </CmCol>
          </CmRow>
          <CmRow>
            <CmCol sm={12} md={12}>
              <CmButton type="submit">Login</CmButton>
            </CmCol>
          </CmRow>
        </CmContainer>
      </form>
    </div>
  );
}
