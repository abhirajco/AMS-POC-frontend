// import amslogo from "@/assets/images/Adromarketlogo.png";
// import amsLogo from "@/assets/images/ams-logo.png";
// // import illustration from "@/assets/images/team-illustration.png"; // replace with your actual image
// import { Button } from "../components/ui/button";
// import { Search, CheckCircle2, ArrowRight } from "lucide-react";
// import { toast } from "sonner";
// import { StickyFooter } from "../components/common/StickyFooter";

// export function LandingPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
//   // Adjustable horizontal gap between left content and right logo card
//   // Tweak this Tailwind class string to increase/decrease spacing
  // const HERO_GAP_CLASS = "gap-24 xl:gap-40"; // 6rem on lg, 10rem on xl
  // return (
  //   <div className="min-h-screen flex flex-col bg-white font-montserrat">
  //     {/* Header */}
  //     <header className="bg-[#1a2c47] text-white animate-slide-down">
  //       <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16 sm:h-20">
  //         {/* Logo + Brand */}
  //         <div className="flex items-center gap-3">
  //           <img src={amsLogo} alt="AMS Logo" className="h-12 sm:h-16 animate-pop-in" />
  //           <h1 className="text-lg sm:text-xl font-semibold tracking-wide animate-fade-in">
  //             Adro Marketing Sphere
  //           </h1>
  //         </div>

  //         {/* Right side */}
  //         <div className="flex items-center gap-6">
  //           <Search className="h-5 w-5 cursor-pointer" onClick={() => toast.info("Registration is coming soon.")} />
  //           <button
  //             onClick={() => toast.info("Registration is coming soon.")}
  //             className="text-white hover:text-gray-200 font-medium"
  //           >
  //             Register
  //           </button>
  //         </div>
  //       </div>
  //     </header>

  //     {/* Main Section */}
  //     <main className={`flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-16 ${HERO_GAP_CLASS}`}>
  //       {/* Left Side Content */}
  //       <div className="flex-1 max-w-xl animate-slide-up">
  //         <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-[#1a2c47] px-3 py-1 text-xs font-medium ring-1 ring-blue-100 mb-4 animate-fade-in">
  //           <span className="h-1.5 w-1.5 rounded-full bg-[#1a2c47]" />
  //           AI-powered Platform
  //         </div>
  //         <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 animate-pop-in">
  //           Welcome to <span className="text-[#1a2c47]">AMS</span>
  //         </h1>
  //         <p className="text-lg text-gray-600 mb-8 animate-fade-in">
  //           Where Marketing Gets Smarter!!!
  //         </p>

  //         <ul className="space-y-3 text-gray-800 mb-10 animate-fade-in">
  //           {[
  //             "All-in-One Platform",
  //             "Intelligent Assistance",
  //             "Workflow Automation",
  //             "Integrated Insights",
  //             "Improved Collaboration",
  //           ].map((item, i) => (
  //             <li key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition">
  //               <CheckCircle2 className="h-5 w-5 text-[#1a2c47] flex-shrink-0" />
  //               <span>{item}</span>
  //             </li>
  //           ))}
  //         </ul>

  //         <Button
  //           className="bg-[#1a2c47] hover:bg-[#16243a] text-white px-25 py-6 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a2c47] animate-glow"
  //           onClick={onSwitchToLogin}
  //         >
  //           Login
  //           <ArrowRight className="ml-2 h-6 w-7" />
  //         </Button>
  //       </div>

  //       {/* Right Side Illustration */}
  //       <div className="flex-1 flex justify-center">
  //         <div className="relative animate-fade-in">
  //           <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-[#1a2c47]/10 to-blue-300/10 blur-2xl animate-float-slow" aria-hidden="true" />
  //           <div className="relative rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-xl animate-pop-in">
  //             <img
  //               src={amslogo}
  //               alt="AMS logo"
  //               className="w-full max-w-lg"
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //     <StickyFooter />
  //   </div>
  // );
// }
import StickyHeader from "@/components/ui/StickyHeader";
import StickyFooter from "@/components/ui/StickyFooter";
import amslogo from "@/assets/images/Adromarketlogo.png";
//import amsLogo from "@/assets/images/ams-logo.png";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
//import { toast } from "sonner";
import {Link} from "react-router-dom";

const LandingPage = () => 
{
    const HERO_GAP_CLASS = "gap-24 xl:gap-40"; // 6rem on lg, 10rem on xl
  return (
    <div className="min-h-screen flex flex-col bg-white font-montserrat">  
      <StickyHeader/>
      {/* Main Section */}
      <main className={`flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-16 ${HERO_GAP_CLASS}`}>
        {/* Left Side Content */}
        <div className="flex-1 max-w-xl animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-[#1a2c47] px-3 py-1 text-xs font-medium ring-1 ring-blue-100 mb-4 animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a2c47]" />
            AI-powered Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 animate-pop-in">
            Welcome to <span className="text-[#1a2c47]">AMS</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 animate-fade-in">
            Where Marketing Gets Smarter!!!
          </p>

          <ul className="space-y-3 text-gray-800 mb-10 animate-fade-in">
            {[
              "All-in-One Platform",
              "Intelligent Assistance",
              "Workflow Automation",
              "Integrated Insights",
              "Improved Collaboration",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition">
                <CheckCircle2 className="h-5 w-5 text-[#1a2c47] flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link to="/login">
          <Button
            className="bg-[#1a2c47] hover:bg-[#16243a] text-white px-25 py-6 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a2c47] animate-glow"
            //onClick={onSwitchToLogin}
          >
            Login
            <ArrowRight className="ml-2 h-6 w-7" />
          </Button>
          </Link>
          
        </div>

        {/* Right Side Illustration */}
        <div className="flex-1 flex justify-center">
          <div className="relative animate-fade-in">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-[#1a2c47]/10 to-blue-300/10 blur-2xl animate-float-slow" aria-hidden="true" />
            <div className="relative rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-xl animate-pop-in">
              <img
                src={amslogo}
                alt="AMS logo"
                className="w-full max-w-lg"
              />
            </div>
          </div>
        </div>
      </main>
      <StickyFooter />
    </div>
  );
}

export default LandingPage

