import { Navigate, useRoutes } from 'react-router-dom';
import React, { useState } from 'react';

import WarehouseInShop from './Pages/WarehouseInShop';
import AppLayout from './Components/AppLayout';
import { useAuth } from './Context/AuthContext';
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
import Customer from './Pages/Customer';
import TablePage from './Pages/Table';
import ReportInShop from './Pages/ReportInShop';
import DashboardInShop from './Pages/DashboardInShop';
import ChatBot from './Pages/ChatBot';
import Permission from './Pages/Permission';
import Expense from './Pages/Expense';
import Income from './Pages/Income';
import Invoice from './Pages/Invoice';
import SaleReturn from './Pages/SaleReturn';
import Employee from './Pages/Employee';
import Department from './Pages/Department';
import EmployeeSalary from './Pages/EmployeeSalary';
import EmployeeAttendance from './Pages/EmployeeAttendance';
import AdminAttendance from './Pages/AdminAttendance';
import AttendanceQr from './Pages/AttendanceQr';
import AttendanceQrScan from './Pages/AttendanceQrScan';
 
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
        { path: 'chat', element: <ChatBot /> },
        { path: 'setting', element: <Settings/> },
        { path: '/setting/unit', element: <Unit/>},
        { path: '/setting/supplier', element: <Supplier/>},
        { path: '/setting/customer', element: <Customer/>},
        { path: '/setting/table', element: <TablePage/>},
        { path: '/setting/permission', element: <Permission/>},
        { path: '/setting/employee', element: <Employee/>},
        { path: '/setting/department', element: <Department/>},
        { path: '/setting/employee-salary', element: <EmployeeSalary/>},
        { path: '/setting/employee-attendance', element: <EmployeeAttendance/>},
        { path: '/setting/admin-attendance', element: <AdminAttendance/>},
        { path: '/setting/attendance-qr', element: <AttendanceQr/>},
        { path: '/setting/attendance-qr-scan', element: <AttendanceQrScan/>},
        { path: '/store', element: <Store/>},
        { path: 'report', element: <Report/> },
        { path: 'expense', element: <Expense/> },
        { path: 'income', element: <Income/> },
        { path: 'invoice', element: <Invoice/> },
        { path: 'sale-return', element: <SaleReturn/> },
        { path: '/store/pos/:id/report-in-shop', element: <ReportInShop/> },
        { path: '/store/pos/:id/dashboard-in-shop', element: <DashboardInShop/> },
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
        // push ban
        // test push
      ],
    },
  ]);
  
  return isAuthenticated ? Content : LoginPage;

}
