const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");


//register
router.post("/register", async (req, res) => {
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Destructure request body
        const { username, email, role } = req.body;

        // Create user object based on role
        let userData = {
            username,
            email,
            password: hashedPassword,
            role,
        };

        // Add extra fields based on role
        if (role === "startup") {
            userData.startupName = req.body.startupName;
            userData.industry = req.body.industry;
            userData.fundingNeeded = req.body.fundingNeeded;
        } else if (role === "developer") {
            userData.techStack = req.body.techStack;
            userData.experience = req.body.experience;
            userData.github = req.body.github;
        } else if (role === "investor") {
            userData.companyName = req.body.companyName;
            userData.investmentSize = req.body.investmentSize;
            userData.preferredIndustries = req.body.preferredIndustries;
        }

        // Save user to database
        const newUser = new User(userData);
        const savedUser = await newUser.save();

        res.status(200).json({ message: "User registered successfully", user: savedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});




// login

/*Added return before res.status().json() to stop further execution.
Wrapped errors in an object ({ message: "..." }) for better readability.
Added console.error(err) in the catch block for debugging.*/

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(404).json({ message: "User not found" }); // ✅ Stops execution

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (!validPassword) return res.status(400).json({ message: "Wrong password" }); // ✅ Stops execution

        res.status(200).json(user); // ✅ Only one response is sent
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});


module.exports = router;