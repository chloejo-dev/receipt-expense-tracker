import { useState } from "react";
import "./SignInForm.css";
import { useNavigate } from "react-router-dom";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState({ field: "", message: "" });
  const [signInError, setSignInError] = useState("");

  const navigate = useNavigate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Reset previous sign-in error
    setSignInError("");

    // Input validation
    // Email/password empty?
    if (email.length === 0) {
      setInputError({
        field: "email",
        message: "Please enter your email",
      });
      return;
    }

    if (password.length === 0) {
      setInputError({
        field: "password",
        message: "Please enter your password",
      });
      return;
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setInputError({
        field: "email",
        message: "Invalid email format",
      });
      return;
    }

    // Password length (15-64)
    if (password.length < 15 || password.length > 64) {
      setInputError({
        field: "password",
        message: "Please check your password",
      });
      return;
    }

    // POST request /api/auth/sign-in
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/sign-in`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            Email: email,
            Password: password,
          }),
        },
      );

      // 400 Bad request, 401 Unauthorized
      if (res.status === 400 || res.status === 401) {
        setSignInError("Invalid email or password");
        return;
      }

      // Other failure responses
      if (!res.ok) {
        setSignInError("Something went wrong. Please try again.");
        return;
      }

      // Sign-in success
      navigate("/dashboard");
    } catch {
      setSignInError("Something went wrong. Please try again.");
    }
  };

  return (
    <form className='sign-in-form' onSubmit={handleSubmit} noValidate>
      <div className='form-field'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          name='email'
          autoComplete='email'
          onChange={(e) => {
            setEmail(e.target.value);
            if (inputError.field === "email") {
              setInputError({ field: "", message: "" });
            }
          }}
        />
        {inputError.field === "email" && <span>{inputError.message}</span>}
      </div>
      <div className='form-field'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          name='password'
          autoComplete='current-password'
          onChange={(e) => {
            setPassword(e.target.value);
            if (inputError.field === "password") {
              setInputError({ field: "", message: "" });
            }
          }}
        />
        {inputError.field === "password" && <span>{inputError.message}</span>}
      </div>
      <button type='submit' className='sign-in-btn'>
        Sign in
      </button>
      {signInError && <span>{signInError}</span>}
    </form>
  );
}
