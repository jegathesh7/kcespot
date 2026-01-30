import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import AchieversPage from "./Pages/Achievers/AchieversPage";
import EventsPage from "./Pages/Events/EventsPage";
import Sidebar from "./component/Sidebar";
import UsersPage from "./Pages/User/UsersPage";
import APIPage from "./Pages/API";
import "./App.css";

import LoginPage from "./Pages/Auth/LoginPage";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="page-content-wrapper">
          <Routes>
            <Route path="/" element={<AchieversPage />} />
            <Route path="/achievers" element={<AchieversPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/api-integration" element={<APIPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
