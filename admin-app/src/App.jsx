import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Achievers from "./Pages/Achievers";
import Events from "./Pages/Events";
import "./App.css";

function App() {
return (
<BrowserRouter>
<Header />


<main className="page-content">
<Routes>
<Route path="/" element={<Achievers />} />
<Route path="/achievers" element={<Achievers />} />
<Route path="/events" element={<Events />} />
</Routes>
</main>
</BrowserRouter>
);
}


export default App;