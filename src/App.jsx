import React, { useEffect, useState } from "react";
import { Route, Routes, NavLink } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Settings from "./Pages/Settings.jsx";
import { supabase } from "./services/supabaseClient.js";
import LogRange from "./components/LogRange.jsx";
import { generateUserUUID, setAuthStatus } from "./services/uuidGenerator.js";
import { processData } from "./services/helper.js";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setAuthStatus("true");
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setUser(data?.session?.user ?? null);
        generateUserUUID();
        setAuthStatus("false");
      }
    };
    getSession();
  }, []);

  return (
    <div>
      <div className="navbar bg-base-100 sticky top-0 z-50">
        <div className="flex-none">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => {
              document.getElementById("my-drawer-input").checked =
                !document.getElementById("my-drawer-input").checked;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <NavLink to="/">
            <a className="btn btn-ghost text-xl">Gunbase 🔫</a>
          </NavLink>
        </div>
        <div className="flex-none"></div>
      </div>

      <div className="drawer z-30">
        <input
          id="my-drawer-input"
          type="checkbox"
          className="drawer-toggle hidden"
        />
        <div className="drawer-side z-40">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={() => {
              document.getElementById("my-drawer-input").checked =
                !document.getElementById("my-drawer-input").checked;
            }}
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <div className="flex flex-col mb-5">
                <h1 className="text-2xl font-bold">Hello there!</h1>
                <h2 className="font-bold">Happy Hunting</h2>
              </div>
            </li>
            <li className="pb-3">
              <NavLink
                to="/"
                onClick={() => {
                  document.getElementById("my-drawer-input").checked =
                    !document.getElementById("my-drawer-input").checked;
                }}
              >
                <a>Home</a>
              </NavLink>
            </li>
            <li className="pb-3">
              <NavLink
                to="/settings"
                onClick={() => {
                  document.getElementById("my-drawer-input").checked =
                    !document.getElementById("my-drawer-input").checked;
                }}
              >
                <a>Settings</a>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      {/* <Home /> */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <LogRange />
      </div>
    </div>
  );
}

export default App;
