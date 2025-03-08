import "./sidebar.css"
import {RssFeed, Chat, PlayCircle, Group, Bookmarks, HelpOutline, WorkOutline, Event, GolfCourse} from "@mui/icons-material"
import {Users} from "../../dummyData"
import CloseFriend from "../closeFriend/CloseFriend"
import { AuthContext } from "../../context/AuthContext";
import { Logout } from "../../context/AuthAction";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
export default function Sidebar() {

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(Logout());  // Dispatch logout action
        navigate("/login");  // Redirect to login
    };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
              <ul className="sidebarList">
                  <li className="sidebarListItem">
                      <RssFeed className="sidebarIcon" />
                      <span className="sidebarListItemText">Feeds</span>
                  </li>

                  <li className="sidebarListItem">
                      <Chat className="sidebarIcon" />
                      <span className="sidebarListItemText">Create your Team</span>
                  </li>

                  <li className="sidebarListItem">
                      <PlayCircle className="sidebarIcon" />
                      <span className="sidebarListItemText">Innovation Hubs</span>
                  </li>

                  <li className="sidebarListItem">
                      <Group className="sidebarIcon" />
                      <span className="sidebarListItemText">Groups</span>
                  </li>

                  <li className="sidebarListItem">
                      <Bookmarks className="sidebarIcon" />
                      <span className="sidebarListItemText">Wrong_Journey</span>
                  </li>

            
                  <li className="sidebarListItem">
                      <GolfCourse className="sidebarIcon" />
                      <span className="sidebarListItemText">Courses</span>
                  </li>

                  <li className="sidebarListItem">
                      <WorkOutline className="sidebarIcon" />
                      <span className="sidebarListItemText">Jobs</span>
                  </li>

                  <li className="sidebarListItem">
                      <Event className="sidebarIcon" />
                      <span className="sidebarListItemText">Events</span>
                  </li>

                  <li className="sidebarListItem" onClick={handleLogout}>
                      <HelpOutline className="sidebarIcon" />
                      <span className="sidebarListItemText">Logout</span>
                  </li>

              </ul>

              
              <hr className="sidebarHr" />
              <span className="investorList">Investors</span>
              <ul className="sidebarFriendList">
                  {Users.map((u) => (
                      <CloseFriend key={u.id} user={u} />
                  ))}
              </ul>
      </div>
    </div>
  )
}
