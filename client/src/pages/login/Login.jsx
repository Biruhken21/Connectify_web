import { useContext, useRef } from "react";
import "./login.css"
import { loginCall } from "../../apiCalls"
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";


export default function Login() {
/* to prevetnt rerenduring use useref than useState */
    const email = useRef();
    const password = useRef();
    const navigate = useNavigate();
/* to use the dispatch from logincall we use this hook*/
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch);
    }; 

    const handleRegister = () => {
        navigate("/register");
    }

    console.log(user)
  return (
      <div className="login">
          <div className="loginWrapper">
              <div className="loginLeft">
                  <h3 className="loginLogo">NewComer</h3>
                  <span className="loginDesc">
                      Launch Your New Idea here and being Visible with Investors, Developers and Hub Companies.
                  </span>
              </div>

              <div className="loginRight">
                  <form className="loginBox" onSubmit={handleClick}>
                      <input placeholder="Your Email" type="email" required className="loginInput" ref={email} />
                      <input placeholder="Your Password" type="password" required minLength="6" className="loginInput" ref={password}  />
                      
                      <button className="loginButton" type="submit" disabled={isFetching}>
                          {isFetching ? <CircularProgress color="white" size="20px" /> : "Log In"}
                      </button>
                      
                      <span className="loginForgot">Forgot Password?</span>
                      <span className="dontAccount">You don't Have an Account?</span>
                      <button className="loginRegisterButton" onClick={handleRegister}>
                             Create a New Account"
                         
                      </button>
                  </form>
              </div>
          </div>
    </div>
  )
}
