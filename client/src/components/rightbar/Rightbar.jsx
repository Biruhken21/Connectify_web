import "./rightbar.css"
import {Users} from "../../dummyData"
import Online from "../online/Online"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { FaUsers, FaUserFriends, FaHandshake, FaBuilding } from "react-icons/fa";


export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser} = useContext(AuthContext);  
  

  

  // we can not say async in useEffect instead use function and call it
  // fetching users follower
  useEffect(() => {
    if (!user || !user._id) return; // Prevent running the effect if user is not available
  
    const getFriends = async () => {
      try {
        const friendList = await axios.get(`/users/friends/${user._id}`);
        setFriends(friendList.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
  
    getFriends();
  }, [user]); // Use `user` instead of `user._id` to avoid errors

  
  

  const HomeRightbar = () => {
    return (
      <>
       
       <div className="rightbar">
      {/* Trending Tech & Startup News */}
      <div className="widget trending-news">
        <h4 className="widget-title">Tech & Startup News</h4>
        <ul>
          <li>🚀 OpenAI releases new GPT model!</li>
          <li>💰 VC funding trends in 2025</li>
          <li>📈 AI startups to watch this year</li>
        </ul>
      </div>

      {/* Top Developers & Investors */}
      <div className="widget community">
        <h4 className="widget-title">Top Developers & Investors</h4>
        <ul>
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </div>

      {/* Motivational Quote Section */}
      <div className="widget quote">
        <h4 className="widget-title">Quote of the Day</h4>
        <p>“The best way to predict the future is to create it.” – Peter Drucker</p>
      </div>
    </div>
  

      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        
      

<div className="rightbar">
      <h4 className="rightbarTitle">User Information</h4>
      <div className="rightbarInfo">
        
        <button className="rightbarButton" >
          <FaUsers className="rightbarIcon" />
          <span className="rightbarInfoKey">Partners:</span>
          <span className="rightbarInfoValue">40</span>
        </button>

        <button className="rightbarButton" >
          <FaUserFriends className="rightbarIcon" />
          <span className="rightbarInfoKey">Followers:</span>
          <span className="rightbarInfoValue">321</span>
        </button>

        <button className="rightbarButton" >
          <FaHandshake className="rightbarIcon" />
          <span className="rightbarInfoKey">Promises:</span>
          <span className="rightbarInfoValue">5</span>
        </button>

        <button className="rightbarButton" >
          <FaBuilding className="rightbarIcon" />
          <span className="rightbarInfoKey">Co-Founder:</span>
          <span className="rightbarInfoValue">3</span>
        </button>

      </div>
        </div>
        
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          
          {friends.map(friend => (
          <Link to={"/profile/" + friend.username} style={{textDecoration:"none"}}>
            <div className="rightbarFollowing">
              <img
                className="rightbarFollowingImg"
                src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/7.jpeg" }
                alt=""
              />
            <span className="rightbarFollowingName">{friend.username}</span>
           </div>
          </Link>
          
          ))}
          

        </div>
      
      </>
    )
  };


  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
