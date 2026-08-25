import { useState } from "react";
import "./SignUpForm.css";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputError, setInputError] = useState({ field: "", message: "" });
  const [signUpError, setSignUpError] = useState("");

  const navigate = useNavigate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Reset previous sign-up error
    setSignUpError("");

    // Input validation: Prevent form submission if there's any invalid input
    // Name is empty
    if (name.length === 0) {
      setInputError({
        field: "name",
        message: "Enter your name",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);

    // Email is empty
    if (email.length === 0) {
      setInputError({
        field: "email",
        message: "Enter your email",
      });
      return;
    }
    // Invalid email
    if (!isEmailValid) {
      setInputError({
        field: "email",
        message: "Invalid email address",
      });
      return;
    }
    // Password is empty
    if (password.length === 0) {
      setInputError({
        field: "password",
        message: "Enter your password",
      });
      return;
    }

    if (password.length < 15 || password.length > 64) {
      setInputError({
        field: "password",
        message: "Password must be between 15 and 64 characters",
      });
      return;
    }

    // ConfirmPassword is empty
    if (confirmPassword.length === 0) {
      setInputError({
        field: "confirmPassword",
        message: "Re-enter your password",
      });
      return;
    }
    // Password === confirmPassword
    if (password !== confirmPassword) {
      setInputError({
        field: "confirmPassword",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      // Form submission: Request sign-up API endpoint
      // POST /api/auth/sign-up
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/sign-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: name,
            Email: email,
            Password: password,
            ConfirmPassword: confirmPassword,
          }),
        },
      );

      // 409 error response (duplicate email)
      if (res.status === 409) {
        setInputError({
          field: "email",
          message: "This email is already in use",
        });
        return;
      }

      // Other error responses
      if (!res.ok) {
        setSignUpError("Something went wrong. Please try again.");
        return;
      }

      // Success response: Redirect to the dashboard page
      navigate("/dashboard");
    } catch {
      setSignUpError("Something went wrong. Please try again.");
    }
  };

  return (
    <form className='sign-up-form' onSubmit={handleSubmit} noValidate>
      <div className='form-field'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          name='name'
          value={name}
          autoComplete='name'
          onChange={(e) => {
            setName(e.target.value);

            // Make sure to remove previous sign-up error
            if (signUpError) {
              setSignUpError("");
            }

            // Make sure to remove previous input error
            if (inputError.field === "name") {
              setInputError({
                field: "",
                message: "",
              });
            }
          }}
        />
        {inputError.field === "name" && (
          <span className='error-message'>
            <CircleAlert size={20} />
            {inputError.message}
          </span>
        )}
      </div>
      <div className='form-field'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          name='email'
          value={email}
          autoComplete='email'
          onChange={(e) => {
            setEmail(e.target.value);
            // Make sure to remove previous sign-up error
            if (signUpError) {
              setSignUpError("");
            }

            // Make sure to remove previous input error
            if (inputError.field === "email") {
              setInputError({
                field: "",
                message: "",
              });
            }
          }}
        />
        {inputError.field === "email" && (
          <span className='error-message'>
            <CircleAlert size={20} />
            {inputError.message}
          </span>
        )}
      </div>
      <div className='form-field'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          name='password'
          value={password}
          autoComplete='new-password'
          onChange={(e) => {
            setPassword(e.target.value);

            // Make sure to remove previous sign-up error
            if (signUpError) {
              setSignUpError("");
            }

            // Make sure to remove previous input error
            if (inputError.field === "password") {
              setInputError({
                field: "",
                message: "",
              });
            }
          }}
        />
        {inputError.field === "password" && (
          <span className='error-message'>
            <CircleAlert size={20} />
            {inputError.message}
          </span>
        )}
      </div>
      <div className='form-field'>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          type='password'
          id='confirmPassword'
          name='confirmPassword'
          value={confirmPassword}
          autoComplete='new-password'
          onChange={(e) => {
            setConfirmPassword(e.target.value);

            // Make sure to remove previous sign-up error
            if (signUpError) {
              setSignUpError("");
            }

            // Make sure to remove previous input error
            if (inputError.field === "confirmPassword") {
              setInputError({
                field: "",
                message: "",
              });
            }
          }}
        />

        {inputError.field === "confirmPassword" && (
          <span className='error-message'>
            <CircleAlert size={20} />
            {inputError.message}
          </span>
        )}
      </div>

      <button type='submit' className='sign-up-btn'>
        Sign up
      </button>
      {signUpError && (
        <span className='error-message'>
          <CircleAlert size={20} />
          {signUpError}
        </span>
      )}
    </form>
  );
}
