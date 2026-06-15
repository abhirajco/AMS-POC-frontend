import SignUpPage from "./pages/SignUpPage";
import  GenerateContentPage  from "@/pages/GenerateContentPage";
import ContentEditorPage  from "@/pages/ContentEditorPage";
import  ProofPointsPage from "@/pages/ProofPointsPage";
import  NewProofPointPage  from "@/pages/NewProofPointPage";
import  PlannerPage  from "@/pages/PlannerPage";
import LeadsProspectsPage  from "@/pages/LeadsProspectsPage";
import EventHubPage from "./pages/EventHubPage";
import  AssetsManagementPage  from "@/pages/AssetsManagementPage";
import AnalyticsPage  from "@/pages/AnalyticsPage";
import  LoginPage  from "@/pages/LoginPage";
import LandingPage  from "@/pages/LandingPage";
import  AMSInfoPage  from "@/pages/AMSInfoPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ContentHubPage from "./pages/ContentHubPage";
import AppLayout from "./components/common/AppLayout";
import ExecutiveForm from "./pages/ExecutiveForm";
//import AdminDashboard from "./pages/ContentToBeApproved";
import ContentToBeApproved from "./pages/ContentToBeApproved";
//import AdminContentStatusDashboard from "./pages/AdminContentStatusDashboard";
import AllCreatedBrief from "./pages/AllCreatedBrief";
import ContentApprovalPage from "./pages/ContentApprovalPage";
import AdminContentPublishList from "./pages/AdminContentPublishList";
import PublishPage from "./pages/PublishPage";
import CampaignHubPage from "@/pages/CampaignHubPage";
import InviteUserPage from "@/pages/InviteUser";
import GlobalSearchPage from "@/pages/GlobalSearchPage";
const App = ()=>{


  return(
    <BrowserRouter>
    <Routes>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path = "/login" element={<LoginPage/>}/>
        <Route path ="/landing" element={<LandingPage/>}/>
        <Route element={<AppLayout/>}>
        <Route path ="/campaign-hub" element = {<CampaignHubPage/>}/>
          <Route path="/campaign/:id" element={<CampaignHubPage/>}/>
          <Route path="/event/:id" element={<EventHubPage/>}/>
          <Route path="/planner/:id" element={<PlannerPage/>}/>
          <Route path = "/approved-content" element ={<AdminContentPublishList/>}/>
          <Route path = "/publish/:id" element ={<PublishPage/>}/>
          <Route path="/review/:id" element={<ContentApprovalPage/>}/> 
          <Route path = "to-be-publish-List" element={<AdminContentPublishList/>}/>
          <Route path="/content-to-approve" element={<ContentToBeApproved/>}/>
          <Route path="/editor-form" element={<ExecutiveForm/>}></Route>
          <Route path="/editor-form" element={<ExecutiveForm/>}></Route>
          <Route path ="/" element ={<AMSInfoPage/>}/>
          <Route path ="/content-hub" element={<ContentHubPage/>}/>
          <Route path ="/generate-new-content" element={<GenerateContentPage/>}/>
          <Route path = "/editor/:id" element={<ContentEditorPage/>}/>
          <Route path ="/planner" element={<PlannerPage/>}/>
          <Route path ="/analytics" element={<AnalyticsPage/>}/>
          <Route path="/proof-points" element ={<ProofPointsPage/>}/>
          <Route path="/event-hub" element={<EventHubPage/>}/>
          <Route path="/leads-prospects" element={<LeadsProspectsPage/>}/>
          <Route path="/new-proof-point" element={<NewProofPointPage/>}/>
          <Route path="/asset-managment" element={<AssetsManagementPage/>}/>
          <Route path="/Content-brief-list" element={<AllCreatedBrief/>}/>
          <Route path="/invite-user" element={<InviteUserPage/>}/>
          <Route path="/global-search" element={<GlobalSearchPage/>}/>
        </Route>
        
    </Routes>
    </BrowserRouter>
  )
}

export default App