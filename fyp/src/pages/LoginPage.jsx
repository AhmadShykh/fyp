import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      console.log("Login Success", result);
      navigate("/");
    } else {
      setMessage("Invalid email or password");
    }
  };

  const handleSignUp = () => {
    setMessage("Redirecting to Sign Up...");
    navigate("/SignupPage");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 w-100">
      <form
        onSubmit={handleLogin}
        className="p-4 border rounded shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="mb-4 text-center">Login</h3>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        <button
          type="button"
          onClick={handleSignUp}
          className="btn btn-secondary w-100 mt-2"
        >
          Sign Up
        </button>
        {message && <p className="mt-3 text-center text-danger">{message}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
