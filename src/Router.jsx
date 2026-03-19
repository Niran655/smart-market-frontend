import { Navigate, useRoutes } from 'react-router-dom';
import React, { useState } from 'react';

import WarehouseInShop from './Pages/WarehouseInShop';
import AppLayout from './Components/AppLayout';
import { useAuth } from './context/AuthContext';
import Dashboard from './Pages/Dashboard';
import Warehouse from './Pages/Warehouse';
import Category from './Pages/Category';
import NotFound from './Pages/NotFound';
import Settings from './Pages/Settings';
import Product from './Pages/Product';
import Report from './Pages/Report';
import Login from './Pages/Login';
import Store from './Pages/Store';
import Unit from './Pages/Unit';
import User from './Pages/User';
import Pos from './Pages/Pos';
import Supplier from './Pages/Supplier';
import Profile from './Pages/Profile';
import StoreSetting from './Pages/StoreSetting';
import ReportInshopPage from './Pages/ReportInshop';
 
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
        { path: '/setting/supplier', element: <Supplier/>},
        { path: '/store', element: <Store/>},
        { path: 'report', element: <Report/> },
        { path: '/store/pos/:id/report-in-shop', element: <ReportInshopPage/> },
        { path: 'profile', element:<Profile/>},
        { path: "setting/user/:userId/profile", element: <Profile /> },
        { path: '/setting/user', element: <User/> },
        { path: '/store-setting/:shopId', element: <StoreSetting/>},
        { path: '/setting/category', element: <Category/> },
        { path: '/setting/product', element: <Product/>},
        { path: '/store/pos/:shopId', element: <Pos/>},
        { path: 'warehouse', element: <Warehouse/>},
        { path: '/store/pos/:id/warehouse-in-shop', element: <WarehouseInShop/>},
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);
  
  return isAuthenticated ? Content : LoginPage;

}
