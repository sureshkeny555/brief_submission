import HomePage from "./home";
import Login from "../Components/Login/Login";
import CreateBrief from "../Components/CreatorFlow/CreateBrief/CreateBrief";
import BriefStatus from "../Components/CreatorFlow/Briefstatus/BriefStatus";
import TodayDeadline from "../Components/Receiver flow/TodayaDeadline/TodayDeadline";
import ShowallBrief from "../Components/Receiver flow/ShowAllBriefs/ShowallBrief";
import AllocateStudy from "../Components/Receiver flow/AllocateStudy/Allocatestudy";
import BriefStatusReceiver from "../Components/Receiver flow/BriefStatus/BriefStatusReceiver";
import ApprovalPage from "../Components/Receiver flow/TodayaDeadline/Approvalmodal/Approvalmodal";
import Layout from "./Layout";
import ReceiverLayout from "./ReceiverLayout";
import ErrorPage from "../errorPage";



const routes = [
    {
        path:'/',
        element: <HomePage/>,
        errorElement: <ErrorPage />,
        children: [
            {
                path:'login',
                element:<Login/>
            },
            {
                path:'layout',
                element:<Layout/>,
                children:[
                    {
                        path:'createbrief',
                        element:<CreateBrief/>
                    },
                    {
                        path:'briefstatus',
                        element:<BriefStatus/>
                    },
                ]
            },
            {
                path:'receiverlayout',
                element:<ReceiverLayout/>,
                children:[
                    {
                        path:'todaydeadline',
                        element:<TodayDeadline/>
                    },
                    {
                        path:'statusbrief',
                        element:<ShowallBrief/>
                    },
                    {
                        path:'allocatestudy',
                        element:<AllocateStudy/>
                    },
                    {
                        path:'receiverbrief',
                        element:<BriefStatusReceiver/>
                    },
                    {
                        path:'approvalmodal',
                        element:<ApprovalPage/>
                    },
                ]
            }
           
            
           
           
        ]
    }
]

export default routes