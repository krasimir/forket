import React from "react";
import { hydrateRoot } from "react-dom/client";

const { hydrateRoot } = require('react-dom/client');

import App from "./components/App";

hydrateRoot(document, <App />);
