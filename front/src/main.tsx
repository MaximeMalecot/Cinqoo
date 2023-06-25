import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { AuthContextProvider } from "./contexts/auth.context.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <App />
                <ToastContainer />
            </AuthContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
