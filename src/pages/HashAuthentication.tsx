import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import config from "../lib/config";
export default function HashAuthentication() {
  const { hash } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(
      `${config.apiBaseUrl}/api/v1/auth/hash-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("cmrm25", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
        })
      );
      navigate(`/vote`);
    }
  };

  return (
    <div className="login-container">
      <div
        className="container login-form"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div className="row">
          <div className="col">
            <h1>Login</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
