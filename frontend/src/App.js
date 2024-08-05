import React, {useEffect, useContext } from 'react';
import { BrowserRouter, Route, Routes, redirect } from 'react-router-dom';
import axios from 'axios';
import Login from './components/auth/Login';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import AdminHeader from './components/layout/Header_Admin';

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/admin" element={<Layout header={<AdminHeader/>}><Admin /></Layout>} />
          <Route path="*" element={<redirect to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
