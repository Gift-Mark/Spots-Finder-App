import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "./api/client";
import styles from "./Login.module.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const redirectNotice = location.state?.message;

  // Role-aware session check on mount
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");
    const savedUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("jos_pulse_user") || "{}");
    
    if (token) {
      if (savedUser?.role === "admin") {
        navigate("/SuperAdmin", { replace: true });
      } else if (savedUser?.role === "vendor" || savedUser?.role === "business") {
        navigate("/vendor", { replace: true });
      } else {
        navigate("/userDashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });

      // Persist session tokens and user data securely
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("jos_pulse_token", data.token);
      localStorage.setItem("jos_pulse_user", JSON.stringify(data.user));

      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

      // Determine correct dashboard based strictly on user role
      let destination = "/userDashboard";
      if (data.user?.role === "admin") {
        destination = "/SuperAdmin";
      } else if (data.user?.role === "vendor" || data.user?.role === "business") {
        destination = "/vendor";
      }

      navigate(destination, {
        replace: true,
        state: {
          greeting: `${timeGreeting}, ${data.user?.firstName || "Explorer"}`,
          message: "What's the vibe right now!",
        },
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not connect to the server.");
    }
  };

  return (
    <main className={styles.page}>
      {redirectNotice && <p className={styles.error}>{redirectNotice}</p>}
      <section className={styles.loginContainer}>
        <header className={styles.header}>
          <h1 className={styles.loginTitle}>Jos Pulse</h1>
          <p className={styles.loginSubtitle}>Welcome back, Vibe Seeker.</p>
        </header>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>✉</span>
              <input
                id="email"
                type="email"
                placeholder="maria@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.passwordLabelRow}>
              <label htmlFor="password">Password</label>
              <button type="button" className={styles.forgotPassword}>
                Forgot Password?
              </button>
            </div>

            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.visibilityButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.signInButton}>
            Sign In
          </button>

          <Link to="/register">Create an account</Link>
        </form>

        <div className={styles.divider}>
          <span />
          <p>OR</p>
          <span />
        </div>

        <div className={styles.socialButtons}>
          <button type="button" className={styles.socialButton}>
            Continue with Google
          </button>
          <button type="button" className={styles.socialButton}>
            Continue with Apple
          </button>
        </div>

        <button
          type="button"
          className={styles.guestButton}
          onClick={() => navigate("/explore", { replace: true })}
        >
          Continue as Guest
        </button>
        <p className={styles.guestHint}>
          Browse places, events, dining and stays — no account needed.
        </p>
      </section>
    </main>
  );
};

export default Login;