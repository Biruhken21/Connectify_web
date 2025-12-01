import { useState, useRef } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();

    const [role, setRole] = useState(""); // Stores selected role
    const [additionalData, setAdditionalData] = useState({}); // Stores additional fields

    const navigate = useNavigate();
    const goLogin = useNavigate();

    const handleLogin = () => {
        goLogin("/login");
    }

    const handleChange = (e) => {
        setAdditionalData({
            ...additionalData,
            [e.target.name]: e.target.value,
        });
    };

    const handleClick = async (e) => {
        e.preventDefault();

        if (passwordAgain.current.value !== password.current.value) {
            password.current.setCustomValidity("Passwords don't match!");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                role, // Stores role selection
                password: password.current.value,
                ...additionalData, // Stores extra fields based on role
            };

            try {
                await axios.post("/auth/register", user);
                navigate("/login");
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Connectify</h3>
                    <span className="loginDesc">
                        Launch Your New Idea here and be visible to Investors, Developers, and Hub Companies.
                    </span>
                </div>

                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Username" required ref={username} className="loginInput" />
                        <input placeholder="Your Email" required ref={email} className="loginInput" type="email" />

                        {/* Role Selection Dropdown */}
                        <select
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="loginInput"
                        >
                            <option value="">Select Role</option>
                            <option value="startup">Startup</option>
                            <option value="developer">Developer</option>
                            <option value="investor">Investor</option>
                        </select>

                        {/* Conditionally Render Additional Fields */}
                        {role === "startup" && (
                            <>
                                <input
                                    placeholder="Startup Name"
                                    name="startupName"
                                    required
                                    className="loginInput"
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="Industry"
                                    name="industry"
                                    required
                                    className="loginInput"
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="Funding Needed"
                                    name="fundingNeeded"
                                    required
                                    className="loginInput"
                                    type="number"
                                    onChange={handleChange}
                                />
                            </>
                        )}

                        {role === "developer" && (
                            <>
                                <input
                                    placeholder="Tech Stack (e.g. React, Node.js)"
                                    name="techStack"
                                    required
                                    className="loginInput"
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="Years of Experience"
                                    name="experience"
                                    required
                                    className="loginInput"
                                    type="number"
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="GitHub Profile"
                                    name="github"
                                    required
                                    className="loginInput"
                                    type="url"
                                    onChange={handleChange}
                                />
                            </>
                        )}

                        {role === "investor" && (
                            <>
                                <input
                                    placeholder="Company Name"
                                    name="companyName"
                                    required
                                    className="loginInput"
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="Investment Size ($)"
                                    name="investmentSize"
                                    required
                                    className="loginInput"
                                    type="number"
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="Preferred Industries"
                                    name="preferredIndustries"
                                    required
                                    className="loginInput"
                                    onChange={handleChange}
                                />
                            </>
                        )}

                        <input placeholder="Password" minLength="6" required ref={password} className="loginInput" type="password" />
                        <input placeholder="Password Again" required ref={passwordAgain} className="loginInput" type="password" />

                        <button className="loginButton" type="submit">Login</button>
                        <button className="loginRegisterButton" onClick={handleLogin}>
                            Log into Your Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
