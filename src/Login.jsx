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
  // Read message passed when redirected from Footer
  const redirectNotice = location.state?.message;

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");
    if (token) {
      navigate("/userDashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });

      // Persist the session across current and legacy keys so all components sync immediately
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("jos_pulse_token", data.token);
      localStorage.setItem("jos_pulse_user", JSON.stringify(data.user));

      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

      let defaultDashboard = "/userDashboard";
      if (data.user?.role === "admin") {
        defaultDashboard = "/SuperAdmin";
      } else if (data.user?.role === "vendor" || data.user?.role === "business") {
        defaultDashboard = "/vendor";
      }

      const destination = location.state?.from || location.state?.redirectTo || defaultDashboard;

      navigate(destination, {
        replace: true,
        state: {
          greeting: `Welcome back, ${data.user?.firstName || "Explorer"}`,
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
      </section>
    </main>
  );
};
