import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashBoard() {
  const [signOutError, setSignOutError] = useState("");

  const navigate = useNavigate();

  const handleSignOut = async () => {
    setSignOutError("");
    // POST /api/auth/sign-out
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/sign-out`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) {
        // Error message
        setSignOutError("Sign out failed. Please try again.");
        return;
      }

      // Sign-out success
      navigate("/");
    } catch {
      // Error message
      setSignOutError("Sign out failed. Please try again.");
    }
  };
  return (
    <>
      <h1>Dashboard</h1>
      <button
        type='button'
        onClick={() => {
          handleSignOut();
        }}
      >
        Sign out
      </button>
      {signOutError && <span>{signOutError}</span>}
    </>
  );
}
