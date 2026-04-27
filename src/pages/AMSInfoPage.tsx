import  HeaderSection  from "@/components/common/HeaderSection";
import amslogo from "@/assets/images/Adromarketlogo.png";

const INFOCARD_TITLE_SIZE_CLASS = "text-[26px] sm:text-[30px]";
const INFOCARD_BODY_SIZE_CLASS = "text-[15px] sm:text-[16px]";

function HeroSection() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <p className="font-medium text-[62px] leading-[70px] tracking-[-1.24px] text-black m-0">
              Smart Marketing by
            </p>
            <p className="font-extrabold text-[62px] leading-[70px] tracking-[-1.24px] text-black m-0">
              <span className="text-[#1a2c47]"> AMS</span>
            </p>
            <div className="mt-4 flex justify-center lg:justify-start" style={{marginTop: "3rem"}}>
          <p className="font-montserrat text-[#292a2e] text-[17.523px] leading-[normal]">
            Where marketing gets smarter...
          </p>
        </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={amslogo}
              alt="AMS logo"
              className="w-full max-w-md"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white rounded-[24.836px] border border-[#d9d9d9] shadow-[0px_1px_2px_rgba(10,13,18,0.05)] font-montserrat">
      <div className="p-6 sm:p-8">
        <div className={`font-bold text-[#000000] text-left ${INFOCARD_TITLE_SIZE_CLASS} tracking-[0.3881px]`}>
          <p className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-black"><span className="text-[#1a2c47]">{title}</span></p>
        </div>
        <div className={`mt-6 font-light text-[#000000] text-left ${INFOCARD_BODY_SIZE_CLASS} tracking-[0.1863px]`}>
          {children}
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-neutral-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 py-[43.464px]">
        <div className="flex flex-col gap-8">
          <HeroSection />
          <InfoCard title="What is AMS?">
            <p className="leading-[27.165px] m-0">
              {`Adro Marketing Sphere (AMS) is a comprehensive, AI-powered marketing management platform purpose-built for Adrosonic. It is designed to unify and streamline all facets of marketing operations within a single, centralized ecosystem. From content creation and approval workflows to campaign planning, event coordination, lead and prospect management, and performance analytics—AMS brings structure, efficiency, and intelligence to every stage of the marketing lifecycle.`}
            </p>
            <br/>
            <p className="leading-[27.165px] m-0">
              {`By infusing human-in-the-loop agentic AI at key touchpoints, the platform enables smarter decision-making and contextual automation without losing human oversight. AMS not only replaces the fragmented toolchain and manual processes currently in use but also integrates seamlessly with essential external platforms like Pardot and Google Analytics—bridging the full spectrum of the marketing ecosystem and enabling true end-to-end visibility and control.`}
            </p>
          </InfoCard>
          <InfoCard title="Vision">
            <p className="leading-[27.165px] m-0">
              AMS (Adro Marketing Sphere) envisions a unified, intelligent, and collaborative platform that transforms the way marketing teams plan and analyze their events. By centralizing content creation, task management, approvals workflow, and analytics, AMS empowers users to move faster, stay aligned, and deliver greater impact.
            </p> <br />
            <p className="leading-[27.165px] m-0">
              Rooted in the philosophy of Human-Driven Agentic AI, AMS brings the best of automation and human creativity together — enabling marketers to generate smarter content, make data-backed decisions, and seamlessly manage end-to-end workflows within a single ecosystem.
            </p><br />
            <p className="leading-[27.165px] m-0">
              As the platform evolves, AMS will continue to adapt, learn, and scale alongside the organization — not just as a tool, but as a strategic partner in driving meaningful engagement and measurable growth.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

export function AMSInfoPage() {
  return (
    <div className="flex-1 bg-neutral-50 flex flex-col h-screen">
      <HeaderSection />
      <div className="flex-1  min-h-0">
        <MainContent />
      </div>
    </div>
  );
}

export default AMSInfoPage
