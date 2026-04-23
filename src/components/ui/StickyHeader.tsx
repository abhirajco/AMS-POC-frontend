import amsLogo from "@/assets/images/ams-logo.png";
import { Search, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {Link} from "react-router-dom";

const StickyHeader = () => {
   return (
    <header className="bg-[#1a2c47] text-white">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16 sm:h-20 font-montserrat">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <a href="#/landing" className="flex items-center gap-3">
            <img src={amsLogo} alt="AMS Logo" className="h-12 sm:h-16" />
            <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
              Adro Marketing Sphere
            </h1>
          </a>
        </div>
        <div className="flex items-center gap-6">
             <Search className="h-5 w-5 cursor-pointer" onClick={() => toast.info("Registration is coming soon.")} />
            <Link to="/signup">
              <button
              // onClick={() => toast.info("Registration is coming soon.")}
               className="text-white hover:text-gray-200 font-medium"
               >
                  Register
               </button>
            </Link>
           </div>
      </div>
    </header>
  );
}

export default StickyHeader;
