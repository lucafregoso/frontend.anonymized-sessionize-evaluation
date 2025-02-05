import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("cmrm25");
  }, [navigate]);

  return <div className="home-container"></div>;
}
