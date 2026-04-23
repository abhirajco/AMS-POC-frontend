// import {toast} from "sonner"
// import { useState } from "react";
// import { BASE_URL } from "@/utils/BASE_URL";

// const SignupForm=({
//   onBack,
//   onSignupSuccess,
// }: SignupPageProps) =>{
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [otp, setOtp] = useState("");
//   const [showOtp, setShowOtp] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🔹 Handle input
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🔹 Signup API
//   const handleSignup = async (e: FormEvent) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${BASE_URL}/accounts/signup/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           full_name: formData.name,
//           password: formData.password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(
//           data.error ||
//             data.email ||
//             data.password ||
//             data.detail ||
//             "Signup Failed"
//         );
//       }

//       // ✅ show OTP screen
//       setShowOtp(true);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleVerifyOtp = async () => {
//   if (loading) return;

//   setLoading(true);
//   setError("");

//   try {
//     const res = await fetch(`${BASE_URL}/verify-otp/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: formData.email,
//         otp,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.detail || "Invalid OTP");
//     }

//     toast.success("OTP verified successfully");

//     onBack();

//   } catch (err: any) {
//     setError(err.message || "OTP verification failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className=" flex items-center justify-center">
//       <div className="bg-white w-full shadow-lg rounded-xl p-8 wifull max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">
//           {!showOtp ? "Create Account" : "Verify OTP"}
//         </h2>

//         {!showOtp ? (
//           <form onSubmit={handleSignup} className="space-y-4">
//               <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//               required
//             />
            
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Email Id
//             </label>

//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//               required
//             />

//            <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Email Id
//             </label>
               
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//               required
//             />

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[#1a2c47] text-white py-2 rounded-md"
//             >
//               {loading ? "Creating..." : "Sign Up"}
//             </button>
//           </form>
//         ) : (
//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border px-3 py-2 rounded-md"
//             />

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <button
//               onClick={handleVerifyOtp}
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-2 rounded-md"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </div>
//         )}

//         {!showOtp && (
//           <p
//             onClick={onBack}
//             className="mt-4 text-sm text-center text-blue-600 cursor-pointer"
//           >
//             Already have an account? Login
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

import { toast } from "sonner";
import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/utils/BASE_URL";

type FormDataType = {
  name: string;
  email: string;
  password: string;
};

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Handle input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // 🔹 Signup API
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/accounts/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.name,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          data.email ||
          data.password ||
          data.detail ||
          "Signup Failed"
        );
      }

      toast.success("OTP sent to your email");
      setShowOtp(true);

    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async () => {
    if (loading) return;

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/accounts/verify-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid OTP");
      }

      toast.success("Account created successfully 🎉");

      // 🔥 Navigate to login after success
      navigate("/login");

    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {!showOtp ? "Create Account" : "Verify OTP"}
        </h2>

        {!showOtp ? (
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Id
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2c47] text-white py-2 rounded-md"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                if (error) setError("");
              }}
              className="w-full border px-3 py-2 rounded-md"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {!showOtp && (
          <p
            onClick={() => navigate("/login")}
            className="mt-4 text-sm text-center text-blue-600 cursor-pointer"
          >
            Already have an account? Login
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupForm;