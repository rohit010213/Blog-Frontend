import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register.jsx'; 
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
