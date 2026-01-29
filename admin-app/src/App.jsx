import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import AchieversPage from "./Pages/Achievers/AchieversPage";
import EventsPage from "./Pages/Events/EventsPage";
import Sidebar from "./component/Sidebar";
import UsersPage from "./Pages/Users/UsersPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="page-content-wrapper">
          <Routes>
            <Route path="/" element={<AchieversPage />} />
            <Route path="/achievers" element={<AchieversPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}


export default App;