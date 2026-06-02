import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BASE_URL } from "@/utils/BASE_URL";
import { setCsrfToken } from "@/utils/csrf";

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

//   setError("");

//   if (!email.trim()) {
//     setError("Email is required");
//     return;
//   }

//   if (!password.trim()) {
//     setError("Password is required");
//     return;
//   }

//   setIsLoading(true);

//   try {
//     const response = await fetch(`${BASE_URL}/accounts/login/`, {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",
//       },

//        credentials: "include",

//       body: JSON.stringify({
//         email: email.trim(),
//         password,
//       }),
//     });

//     let data;

//     try {
//       data = await response.json();
//     } catch {
//       throw new Error("Invalid server response");
//     }

//     console.log("Login Response:", data);

//     if (Array.isArray(data)) {
//       setError(data[0]);
//       return;
//     }

//     if (!response.ok) {
//       setError(data?.message || "Login failed");
//       return;
//     }

//     if (!data?.user) {
//       setError("User data not found");
//       return;
//     }

//     const userData: User = {
//       id: data.user.id,
//       email: data.user.email,
//       full_name: data.user.full_name,
//       group: data.user.group,
//       role: data.user.role,
//     };

//     localStorage.setItem("user", JSON.stringify(userData));

//     onLogin({
//       email: data.user.email,
//       name: data.user.full_name,
//       role: data.user.role,
//       rememberMe,
//     });

//     navigate("/");

//   } catch (error) {
//     console.error("Login Error:", error);

//     if (error instanceof TypeError) {
//       setError("Network error. Please check your internet connection.");
//     } else {
//       setError("Something went wrong. Please try again.");
//     }
//   } finally {
//     setIsLoading(false);
//   }
// };

type User = {
  id: string;
  email: string;
  full_name: string;
  group: string;
  role: string;
};

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setError("");

  if (!email.trim()) {
    setError("Email is required");
    return;
  }

  if (!password.trim()) {
    setError("Password is required");
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/accounts/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    let data;
    console.log("Response Headers");
console.log([...response.headers.entries()]);

    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid server response");
    }

    console.log("Login Response:", data);

    // Backend validation errors
    if (Array.isArray(data)) {
      setError(data[0]);
      return;
    }

    if (!response.ok) {
      setError(
        data?.error ||
        data?.message ||
        data?.detail ||
        "Login failed"
      );
      return;
    }

    if (!data?.user) {
      setError("User data not found");
      return;
    }

    // Optional role validation
    // if (
    //   data.user.role !== "admin" &&
    //   data.user.role !== "exec_approver"
    // ) {
    //   setError("Unauthorized user");
    //   return;
    // }

    const userData: User = {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.full_name,
      group: data.user.group,
      role: data.user.role,
    };

    // Store only non-sensitive user info
    localStorage.setItem("user", JSON.stringify(userData));
    setCsrfToken(data.csrfToken);

    onLogin({
      email: userData.email,
      name: userData.full_name,
      role: userData.role,
      rememberMe,
    });

    navigate("/");

  } catch (error) {
    console.error("Login Error:", error);

    if (error instanceof TypeError) {
      setError("Network error. Please check your internet connection.");
    } else {
      setError("Something went wrong. Please try again.");
    }
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