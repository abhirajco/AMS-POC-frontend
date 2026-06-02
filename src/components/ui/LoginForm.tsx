import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BASE_URL } from "@/utils/BASE_URL";

const LoginForm = ({
  onLogin,
}: {
  onLogin: (userData: {
    email: string;
    rememberMe: boolean;
    role: string;
    name: string;
  }) => void;
}) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
 

  // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!email.trim()) {
  //     setError("Email is required");
  //     return;
  //   }

  //   if (!password.trim()) {
  //     setError("Password is required");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError("");

  //   try {
  //     const response = await fetch(`${BASE_URL}/accounts/login/`, {
  //       method: "POST",
  // credentials: "include", // IMPORTANT
  // headers: {
  //   "Content-Type": "application/json",
  // },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();

  //     console.log("Login Response:", data);

  //     //  validation errors from backend
  //     if (Array.isArray(data)) {
  //       setError(data[0]);
  //       setIsLoading(false);
  //       return;
  //     }

  //     //  invalid credentials
  //     if (!data.access) {
  //       setError("Invalid email or password");
  //       setIsLoading(false);
  //       return;
  //     }

  //     //  store tokens
  //     localStorage.setItem("accessToken", data.access);
  //     localStorage.setItem("refreshToken", data.refresh);

  //     //  store user data
  //     if (data.user)
  //     {
  //       const userData =
  //      {
  //       full_name: data.user.full_name,
  //       email: data.user.email,
  //       role: data.user.role,
  //      };

  //        localStorage.setItem("user", JSON.stringify(userData));
  //     }

  //     //  pass data to parent
  //     onLogin({
  //       email: data.user?.email || email,
  //       name: data.user?.full_name || "User",
  //       role: data.user?.role || "marketing-head",
  //       rememberMe: rememberMe,
  //     });

  //     //  redirect to home
  //     navigate("/");

  //   } catch (err) {
  //     setError("Server error. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!email.trim()) {
    setError("Email is required");
    return;
  }

  if (!password.trim()) {
    setError("Password is required");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    const response = await fetch(`${BASE_URL}/accounts/login/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log("Login Response:", data);

    // Validation errors from backend
    if (Array.isArray(data)) {
      setError(data[0]);
      return;
    }

    // Login failed
    if (!response.ok) {
      setError(data?.message || "Invalid email or password");
      return;
    }

    // Store only user info if needed
    if (data.user) {
      const userData = {
        full_name: data.user.full_name,
        email: data.user.email,
        role: data.user.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
    }

    onLogin({
      email: data.user?.email || email,
      name: data.user?.full_name || "User",
      role: data.user?.role || "marketing-head",
      rememberMe,
    });

    navigate("/");
  } catch (err) {
    console.error(err);
    setError("Server error. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="w-full max-w-md font-montserrat mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Log In to AMS
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Where Marketing Gets Smarter...
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              EMAIL ADDRESS
            </label>
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
              disabled={isLoading}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PASSWORD
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
                disabled={isLoading}
                 className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) =>
                setRememberMe(checked === true)
              }
            />
            <span className="text-sm text-gray-600">
              Remember Me
            </span>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#1a2c47] hover:bg-[#1a2c47]/90 text-white"
          >
            {isLoading ? "SIGNING IN..." : "PROCEED"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;