import { BrowserRouter, createBrowserRouter,  Route,  RouterProvider, Routes } from "react-router-dom";
import "./App.css";
 import routes from "./routes";
import Login from "./Components/Login/Login";
import Layout from "./routes/Layout";
import ReceiverLayout from "./routes/ReceiverLayout";
import CreateBrief from "./Components/CreatorFlow/CreateBrief/CreateBrief";
import BriefStatus from "./Components/CreatorFlow/Briefstatus/BriefStatus";
import TodayDeadline from "./Components/Receiver flow/TodayaDeadline/TodayDeadline";
import ShowallBrief from "./Components/Receiver flow/ShowAllBriefs/ShowallBrief";
import AllocateStudy from "./Components/Receiver flow/AllocateStudy/Allocatestudy";
import BriefStatusReceiver from "./Components/Receiver flow/BriefStatus/BriefStatusReceiver";
import ApprovalPage from "./Components/Receiver flow/TodayaDeadline/Approvalmodal/Approvalmodal";
import ApprovalPageShowAll from "./Components/Receiver flow/ShowAllBriefs/Approvalmodal/ApprovalmodalShowAll";
import Signup from "./Components/SignUp/SignUp";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import NewPassword from "./Components/NewPassword/NewPassword";
import NewBrief from "./Components/CreatorFlow/CreateBrief/NewBrief";
import MirrorViewFile from "./Components/common/MirrorViewFile/MirrorViewFile";
// import { ToastContainer } from "react-toastify";
import StudyTracker from "./Components/Receiver flow/StudyTracker/StudyTracker";
import Dashboard from "./Components/Receiver flow/Dashboard/Dashboard";
import Masters from "./Components/Receiver flow/Masters/Masters";
import Cities from "./Components/Receiver flow/Masters/Cities/Cities";
import Products from "./Components/Receiver flow/Masters/Products/Products";
import Studytype from "./Components/Receiver flow/Masters/StudyType/Studytype";
import Department from "./Components/Receiver flow/Masters/Department/Department";
import Researchtype from "./Components/Receiver flow/Masters/ResearchType/Researchtype";

//const router = createBrowserRouter(routes, { future: { v7_startTransition: true } });

function App() {
  return (
  // <RouterProvider router={router}/>
  <>
   <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<NewPassword/>}/>
        
       
        <Route path="/layout" element={<Layout />}>
          <Route path="createbrief" element={<CreateBrief/>} />
          <Route path="newbrief" element={<NewBrief/>}/>
          <Route path="briefstatus" element={<BriefStatus />} />
          <Route path="mirrorview" element={<MirrorViewFile/>}/>
        </Route>
       
        <Route path="/receiverlayout" element={<ReceiverLayout />}>
          <Route path="todaydeadline" element={<TodayDeadline/>}/>
          <Route path="statusbrief" element={<ShowallBrief/>}/>
          <Route path="allocatestudy" element={<AllocateStudy/>}/>
          <Route path="receiverbrief" element={<BriefStatusReceiver/>}/>
          <Route path="approvalmodal" element={<ApprovalPage/>}/>
          <Route path="approvalmodalshowall" element={<ApprovalPageShowAll/>}/>
          <Route path="mirrorview" element={<MirrorViewFile/>}/>
          <Route path="studytracker" element={<StudyTracker/>}/>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="masters" element={<Masters/>}/>
          <Route path="cities" element={<Cities/>}/>
          <Route path="products" element={<Products/>}/>
          <Route path="studytype" element={<Studytype/>}/>
          <Route path="department" element={<Department/>}/>
          <Route path="researchtype" element={<Researchtype/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
   
    {/* <ToastContainer/> */}
    </>
    
  );
}

export default App;
