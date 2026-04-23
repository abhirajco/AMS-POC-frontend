import StickyFooter from "@/components/ui/StickyFooter";
import StickyHeader from "@/components/ui/StickyHeader";
import SignupForm from "@/components/ui/SignUpForm";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-montserrat">
      <StickyHeader />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-12 gap-10">

        {/* Left */}
        <div className="flex-1 max-w-lg text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Create your <br />
            <span className="text-[#1a2c47]">
              Adro Marketing Sphere Account
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Join the AI-powered hub for smarter marketing operations.
            Sign up to get access to your dashboard, projects, and insights.
          </p>

          <p className="text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Right */}
        <div className="flex-1 max-w-md w-full">
          <SignupForm />
        </div>

      </main>

      <StickyFooter />
    </div>
  );
};

export default SignUpPage;