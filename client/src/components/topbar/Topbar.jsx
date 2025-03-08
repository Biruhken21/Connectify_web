import './topbar.css'
import { Search, Person, Chat, Notifications } from "@mui/icons-material"
import { useContext } from 'react'
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {


  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className='topbarContainer'>
      <div className="topbarLeft">
        
        <Link to="/" style={{textDecoration:"none"}}>
        <span className="logo">NewComer</span>
        </Link>
        
      </div>

      <div className="topbarCenter">
        <div className="searchbar">
          <Search className='searchIcon'/>
          <input placeholder='Search for Frsinds, Post, or video' className="searchInput" />
        </div>
      </div>

      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Develpers</span>
          <span className="topbarLink">Investors</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>

          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>

          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>

        </div>
        <Link to={user?.username ? `/profile/${user.username}` : "/profile/guest"} className='profileLink'>
  {user ? (
    user.profilePicture ? (
      <img 
        src={PF + user.profilePicture} 
        alt="Profile" 
        className="topbarImg" 
      />
    ) : (
      <div className="profilePlaceholder topbarImg">
        {user.username.charAt(0).toUpperCase()}
      </div>
    )
  ) : (
    <img 
      src={PF + "person/7.jpeg"} 
      alt="Default Profile" 
      className="topbarImg"
    />
  )}
</Link>


        
      </div>
    </div>
  )
}
