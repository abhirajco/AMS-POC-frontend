
// function LoginForm({
//   onLogin,
// }: {
//   onLogin: (userData: {
//     email: string;
//     rememberMe: boolean;
//     role: string;
//     name: string;
//   }) => void;
// }) {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError("");

  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   const user = validCredentials.find(
  //     (cred) => cred.email === email && cred.password === password
  //   );

  //   if (user) {
  //     onLogin({
  //       email: user.email,
  //       rememberMe,
  //       role: user.role,
  //       name: user.name,
  //     });
  //   } else {
  //     setError(
  //       "Invalid email or password. Please check your credentials and try again."
  //     );
  //   }

  //   setIsLoading(false);
  // };

  // return (
  //   <div className="w-full max-w-md font-montserrat">
  //     <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
  //       <div className="text-center mb-8">
  //         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
  //           Log In to AMS
  //         </h1>
  //         <p className="text-gray-600 text-sm sm:text-base">
  //           Where Marketing Gets Smarter...
  //         </p>
  //       </div>

  //       {error && (
  //         <div className="mb-6">
  //           <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
  //             <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
  //             <p className="text-sm text-red-700">{error}</p>
  //           </div>
  //         </div>
  //       )}

  //       <form onSubmit={handleLogin} className="space-y-6">
  //         {/* Email */}
  //         <div>
  //           <label
  //             htmlFor="email"
  //             className="block text-sm font-medium text-gray-700 mb-2"
  //           >
  //             EMAIL ADDRESS
  //           </label>
  //           <Input
  //             id="email"
  //             type="email"
  //             placeholder="Enter Email"
  //             value={email}
  //             onChange={(e) => {
  //               setEmail(e.target.value);
  //               if (error) setError("");
  //             }}
  //             required
  //             disabled={isLoading}
  //             className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //           />
  //         </div>

  //         {/* Password */}
  //         <div>
  //           <label
  //             htmlFor="password"
  //             className="block text-sm font-medium text-gray-700 mb-2"
  //           >
  //             PASSWORD
  //           </label>
  //           <div className="relative">
  //             <Input
  //               id="password"
  //               type={showPassword ? "text" : "password"}
  //               placeholder="Enter Password"
  //               value={password}
  //               onChange={(e) => {
  //                 setPassword(e.target.value);
  //                 if (error) setError("");
  //               }}
  //               required
  //               disabled={isLoading}
  //               className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //             />
  //             <button
  //               type="button"
  //               onClick={() => setShowPassword(!showPassword)}
  //               disabled={isLoading}
  //               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
  //             >
  //               {showPassword ? (
  //                 <EyeOff className="w-5 h-5" />
  //               ) : (
  //                 <Eye className="w-5 h-5" />
  //               )}
  //             </button>
  //           </div>
  //         </div>

  //         {/* Remember Me */}
  //         <div className="flex items-center">
  //           <Checkbox
  //             id="remember-me"
  //             checked={rememberMe}
  //             onCheckedChange={(checked) => setRememberMe(checked === true)}
  //             className="rounded"
  //           />
  //           <label
  //             htmlFor="remember-me"
  //             className="ml-2 text-sm text-gray-600 cursor-pointer"
  //           >
  //             Remember Me
  //           </label>
  //         </div>

  //         {/* Submit */}
  //         <Button
  //           type="submit"
  //           disabled={isLoading}
  //           className="w-full h-12 bg-[#1a2c47] hover:bg-[#1a2c47]/90 text-white rounded-lg font-medium transition disabled:opacity-50"
  //         >
  //           {isLoading ? "SIGNING IN..." : "PROCEED"}
  //         </Button>
  //       </form>
  //     </div>
  //   </div>
  // );
// }

// export function LoginPage({ onLogin }: LoginPageProps) {
  // return (
  //   <div className="min-h-screen bg-white flex flex-col font-montserrat">
  //     <StickyHeader />

  //     {/* Main two-column layout */}
  //     <main className={`flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-12 ${MAIN_CONTENT_GAP_CLASS}`}>
  //       {/* Left Side - Branding */}
  //       <div className="flex-1 max-w-lg text-left">
  //         {/* <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
  //           Welcome to <br /> Adro Marketing Sphere
  //         </h1> */}
  //         <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
  //           Welcome to <br /> <span className="text-[#1a2c47]">Adro Marketing Sphere</span>
  //         </h1>
  //         <p className="text-lg text-gray-600 mb-6">
  //           Your AI-powered hub for smarter marketing operations.
  //           Log in to access your personalized dashboard, projects, and insights.
  //         </p>
  //         <p className="text-gray-700">
  //           Need help?{" "}
  //           <a
  //             href="mailto:adromarketingsphere@adrosonic.com"
  //             className="text-blue-600 font-medium hover:underline"
  //           >
  //             adromarketingsphere@adrosonic.com
  //           </a>
  //         </p>
  //       </div>

  //       {/* Right Side - Login Form */}
  //       <div className="flex-1 max-w-md w-full">
  //         <LoginForm onLogin={onLogin} />
  //       </div>
  //     </main>

  //     <StickyFooter />
  //   </div>
  // );
// }
import StickyFooter from "@/components/ui/StickyFooter";
import StickyHeader from "@/components/ui/StickyHeader";
import LoginForm from "@/components/ui/LoginForm";

const LoginPage = () => {

  const handleLogin = (userData: {
    email: string;
    rememberMe: boolean;
    role: string;
    name: string;
  }) => {
    console.log("User logged in:", userData);

    // you can also store global state here later
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-montserrat">
      <StickyHeader />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-12 gap-10">
        
        {/* Left */}
        <div className="flex-1 max-w-lg text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Welcome to <br />
            <span className="text-[#1a2c47]">
              Adro Marketing Sphere
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Your AI-powered hub for smarter marketing operations.
            Log in to access your personalized dashboard, projects, and insights.
          </p>
           <p className="text-gray-700">
            Need help?{" "}
            <a
              href="mailto:adromarketingsphere@adrosonic.com"
              className="text-blue-600 font-medium hover:underline"
            >
              adromarketingsphere@adrosonic.com
            </a>
          </p>
        </div>

        {/* Right */}
        <div className="flex-1 max-w-md w-full">
           {/* PASS PROP HERE */}
          <LoginForm onLogin={handleLogin} />
        </div>

      </main>

      <StickyFooter />
    </div>
  );
};

export default LoginPage;
