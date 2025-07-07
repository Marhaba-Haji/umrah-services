import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const logo =
  "https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//Marhaba%20Haji%20Logo%20ICon%20PNG.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // No session persistence logic needed; Supabase v2+ always persists in localStorage
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message || "Invalid credentials");
    } else {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/control-panel"), 1200);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setResetMessage("");
    setResetLoading(true);
    if (!email) {
      setResetMessage("Please enter your email above first.");
      setResetLoading(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setResetLoading(false);
    if (error) {
      setResetMessage(error.message || "Failed to send reset email.");
    } else {
      setResetMessage("Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader>
          <div className="flex flex-col items-center mb-2">
            <img
              src={logo}
              alt="Marhaba Haji Logo"
              className="h-24 mb-2 rounded"
            />
            <CardTitle className="text-center">Sign In</CardTitle>
            <div className="text-gray-500 text-sm mt-1 text-center">
              Welcome to Marhaba Haji Admin. Please sign in to continue.
              <br />
              <span className="text-xs text-gray-400">
                Your login will be remembered until you log out.
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.885 7.24 19.5 12 19.5c1.772 0 3.45-.37 4.958-1.03m3.062-2.27A10.45 10.45 0 0022.066 12c-1.292-3.884-5.306-7.499-10.066-7.499-1.272 0-2.496.19-3.646.54m8.646 8.459a3 3 0 11-4.242-4.242"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12c0-1.25.38-2.417 1.03-3.397C5.226 6.115 8.24 2.5 12 2.5c3.76 0 6.774 3.615 8.72 6.103.65.98 1.03 2.147 1.03 3.397s-.38 2.417-1.03 3.397C18.774 17.885 15.76 21.5 12 21.5c-3.76 0-6.774-3.615-8.72-6.103A6.978 6.978 0 012.25 12z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-blue-600 text-sm hover:underline focus:outline-none"
                onClick={handleForgotPassword}
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Forgot Password?"}
              </button>
            </div>
            {resetMessage && (
              <div className="text-blue-600 text-xs text-center">
                {resetMessage}
              </div>
            )}
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center">
                {success}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
