import { Navigate, useRoutes } from 'react-router-dom';
import React from 'react';

import AppLayout from './Components/AppLayout';
import { useAuth } from './context/AuthContext';
import Dashboard from './Pages/Dashboard';
import Category from './Pages/Category';
import Settings from './Pages/Settings';
import Product from './Pages/Product';
import Report from './Pages/Report';
import Login from './Pages/Login';
import Store from './Pages/Store';
import Unit from './Pages/Unit';
import User from './Pages/User';
export default function Router() {
  const { isAuthenticated } = useAuth();

  const LoginPage = useRoutes([
    { path: '/', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '*', element: <Login /> },
  ]);

  const Content = useRoutes([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'setting', element: <Settings/> },
        { path: '/setting/unit', element: <Unit/>},
        { path: '/store', element: <Store/>},
        { path: 'report', element: <Report/> },
        { path: '/setting/user', element: <User/> },
        { path: '/setting/category', element: <Category/> },
        { path: '/setting/product', element: <Product/>}
      ],
    },
  ]);
  
  return isAuthenticated ? Content : LoginPage;

}
