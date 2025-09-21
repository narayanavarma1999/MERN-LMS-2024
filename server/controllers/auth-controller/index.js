const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");
const axios = require('axios');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role: role || 'student',
    password: hashPassword,
    authProvider: 'local'
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    process.env.JWT_SECRET || "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
        avatar: checkUser.avatar,
      },
    },
  });
};


const checkUserExists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ userEmail: email });

    return res.status(200).json({
      success: true,
      data: {
        exists: !!user,
        authProvider: user ? user.authProvider : null,
      },
    });
  } catch (error) {
    console.error('Check user exists error:', error);
    return res.status(500).json({
      success: false,
      message: "Error checking user existence",
    });
  }
};

const googleLogin = async (req, res) => {

  const { access_token } = req.body;

  try {

    const payload = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { sub: googleId, email, name, picture } = payload.data;

    let user = await User.findOne({
      $or: [{ googleId }, { userEmail: email }]
    });

    if (!user) {
      user = new User({
        userName: name,
        userEmail: email,
        role: "student",
        password: googleId,
        authProvider: 'google',
        avatar: picture
      });
      user = await user.save();
    }

    console.log(`user details:${JSON.stringify(user)}`)
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Authentication successful',
      data: {
        success: true,
        accessToken: token,
        user: {
          _id: user._id,
          userName: user.userName,
          userEmail: user.userEmail,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (err) {
    console.error('Error during Google Authentication:', err);
    res.status(400).json({ error: 'Authentication failed' });
  }
}



module.exports = { registerUser, loginUser, googleLogin, checkUserExists };
