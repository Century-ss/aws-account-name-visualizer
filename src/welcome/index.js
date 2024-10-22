import { jsx as _jsx } from "react/jsx-runtime";
import '../global.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Welcome from './Welcome';
createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(Welcome, {}) }));
