import React, { useEffect, useState } from "react";
import AmmunitionList from "./AmmunitionList.jsx";
import LogRange from "./LogRange.jsx";
import { supabase } from "./supabaseClient";
import WeaponList from "./WeaponList.jsx";

// Form Components
const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onResetPassword,
  onSwitchToSignUp,
}) => (
  <form className="card-body" onSubmit={onSubmit}>
    <div className="form-control">
      <label className="label">
        <span className="label-text">Email</span>
      </label>
      <input
        type="email"
        placeholder="me@contact.com"
        className="input input-bordered"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
    </div>
    <div className="form-control">
      <label className="label">
        <span className="label-text">Hasło</span>
      </label>
      <input
        type="password"
        placeholder="verystrongpassword"
        className="input input-bordered"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />
      <label className="label">
        <a
          href="#"
          className="label-text-alt link link-hover"
          onClick={onResetPassword}
        >
          Zapomniałeś hasła?
        </a>
      </label>
    </div>
    <br />
    <button className="btn btn-primary" type="submit">
      Zaloguj
    </button>
    <button type="button" onClick={onSwitchToSignUp} className="mt-4 btn">
      Nie masz konta? Zarejestruj się
    </button>
  </form>
);

const SignUpForm = ({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onSwitchToLogin,
}) => (
  <form className="card-body" onSubmit={onSubmit}>
    <div className="form-control">
      <label className="label">
        <span className="label-text">Email</span>
      </label>
      <input
        type="email"
        placeholder="me@contact.com"
        className="input input-bordered"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
    </div>
    <div className="form-control">
      <label className="label">
        <span className="label-text">Hasło</span>
      </label>
      <input
        type="password"
        placeholder="verystrongpassword"
        className="input input-bordered"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />
    </div>
    <br />
    <button className="btn btn-primary" type="submit">
      Zarejestruj
    </button>
    <button type="button" onClick={onSwitchToLogin} className="mt-4 btn">
      Masz już konto? Zaloguj się
    </button>
  </form>
);

const ResetPasswordForm = ({
  resetEmail,
  setResetEmail,
  onSubmit,
  onSwitchToLogin,
}) => (
  <form className="card-body" onSubmit={onSubmit}>
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          Wpisz swój email do resetowania hasła
        </span>
      </label>
      <input
        type="email"
        placeholder="Wpisz e-mail"
        className="input input-bordered"
        onChange={(e) => setResetEmail(e.target.value)}
        value={resetEmail}
        required
      />
    </div>
    <br />
    <button className="btn btn-primary mt-4" type="submit">
      Wyślij link
    </button>
    <button type="button" onClick={onSwitchToLogin} className="mt-4 btn">
      Wróć do logowania
    </button>
  </form>
);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setUser(data?.session?.user ?? null);
      }
    };
    getSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Rejestracja pomyślna! Możesz się teraz zalogować.");
      setIsRegistering(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) {
      setResetError(error.message);
      setResetMessage("");
    } else {
      setResetMessage(
        "Link do resetowania hasła został wysłany na Twój adres e-mail."
      );
      setResetError("");
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div>
      <div className="navbar bg-base-100 sticky top-0">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">Gunbase 🔫</a>
        </div>
        <div className="navbar-end">
          <label className="swap swap-rotate">
            <input onClick={toggleTheme} type="checkbox" />
            <div className="swap-on">🌕</div>
            <div className="swap-off">☀</div>
          </label>
          {user ? <button onClick={handleLogout}>Wyloguj</button> : <></>}
        </div>
      </div>

      {!user ? (
        <div>
          <div
            className="hero bg-base-200 min-h-screen"
            style={{
              backgroundImage: "url('/images/gun.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="hero-content flex-col lg:flex-row-reverse w-full">
              <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                {isResettingPassword ? (
                  <ResetPasswordForm
                    resetEmail={resetEmail}
                    setResetEmail={setResetEmail}
                    onSubmit={handleResetPassword}
                    onSwitchToLogin={() => setIsResettingPassword(false)}
                  />
                ) : isRegistering ? (
                  <SignUpForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    onSubmit={handleSignUp}
                    onSwitchToLogin={() => setIsRegistering(false)}
                  />
                ) : (
                  <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    onSubmit={handleLogin}
                    onResetPassword={(e) => {
                      e.preventDefault();
                      setIsResettingPassword(true);
                    }}
                    onSwitchToSignUp={() => setIsRegistering(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl">
          <div>
            <WeaponList user={user} />
            <AmmunitionList user={user} />
          </div>
          <LogRange user={user} />
          <div className="overflow-x-auto"></div>
        </div>
      )}
    </div>
  );
}

export default App;
