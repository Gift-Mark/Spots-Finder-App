import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./api/client";
import styles from "./Register.module.css";

export const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Registration and login use the same API contract, including the returned session token.
    try{
      const data = await registerUser({ firstName, lastName, middleName, email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    navigate("/userDashboard", {
      state: {
        greeting: `${timeGreeting}, ${firstName}`,
      },
    });
  }catch(err){
    console.error("Registration Error Details:", err);
  
  if (err.response) {
    // Server responded with a status code (e.g., 400, 500)
    setError(err.response.data?.message || "Server error occurred.");
  } else if (err.request) {
    // Request was made but no response was received (Network / Server Down)
    setError("Backend server is offline or unreachable. Check your API server.");
  } else {
    setError("An unexpected error occurred.");
  }
};

  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.logo}>bolt</p>

          <h1>Join the Pulse.</h1>

          <p className={styles.subtitle}>
            Discover the best vibes in Jos and beyond.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.inputGroup}>
            <label htmlFor="firstName">First Name</label>

            <input
              id="firstName"
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Last Name</label>

            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="middleName">Middle Name</label>

            <input
              id="middleName"
              type="text"
              placeholder="Middle"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>

            <div className={styles.passwordWrapper}>
              <span className={styles.lockIcon}>🔒</span>

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
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>

            <div className={styles.passwordWrapper}>
              <span className={styles.lockIcon}>🔒</span>

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className={styles.visibilityButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "hide" : "show"}
              </button>
            </div>
          </div>



          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.createButton}>
            Create Account
          </button>
        </form>

        <p className={styles.terms}>
          By signing up, you agree to our{" "}
          <a href="#terms">Terms of Service</a> &{" "}
          <a href="#privacy">Privacy Policy</a>
        </p>

        <div className={styles.divider} />

        <p className={styles.signInText}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </main>
  );
};
