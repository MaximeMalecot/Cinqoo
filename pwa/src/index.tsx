import { AnalyticsContextProvider } from "ratflow-sdk-react-rollup";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/auth.context";
import "./index.css";
import { sdkConfig } from "./ratflow";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AnalyticsContextProvider {...sdkConfig}>
            <BrowserRouter>
                <AuthContextProvider>
                    <App />
                    <ToastContainer />
                </AuthContextProvider>
            </BrowserRouter>
        </AnalyticsContextProvider>
    </React.StrictMode>
);

serviceWorkerRegistration.register();
