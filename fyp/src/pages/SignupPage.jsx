import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/auth/signup", {
        name,
        email,
        contact,
        password,
      });
      setMessage("Signup successful");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const goToLogin = () => {
    navigate("/LoginPage");
  };

  return (
    <div className="d-flex vh-100 w-100">
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <form
          onSubmit={handleSignup}
          className="p-4 border rounded shadow"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h3 className="mb-4 text-center">Sign Up</h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              type="text"
              className="form-control"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
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
            Sign Up
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={goToLogin}
          >
            Back to Login
          </button>
          {message && (
            <p className="mt-3 text-center text-success">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
