import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Persist the session before navigating so protected pages can read it immediately.
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/discover", {
        state: {
          greeting: `Welcome back, ${data.user.firstName}`,
          message: "What's the vibe right now!",
        },
      });
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server.");
    }
  };

  return (
    <main className={styles.page}>
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