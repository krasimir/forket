'use client';

console.log('Client-side code loaded');

import React from 'react';
import { hydrateRoot, createRoot } from "react-dom/client";
import ProductsList from "./components/ProductsList";

window.React = React;
window.hydrateRoot = hydrateRoot;
window.createRoot = createRoot;
window.ProductsList = ProductsList;