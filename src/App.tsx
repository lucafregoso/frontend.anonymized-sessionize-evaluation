import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
import Vote from "./pages/Vote.tsx";
import Home from "./pages/Home.tsx";
import HashAuthentication from "./pages/HashAuthentication.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vote" element={<Vote />} />
        <Route path="/:hash" element={<HashAuthentication />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
