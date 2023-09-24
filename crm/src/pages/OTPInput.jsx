import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextHover from '../utils/TextHover';
import styled, { keyframes } from 'styled-components';
import bgImg from '../assets/nikuubg.jpg';
import googleIcon from '../assets/google.png';
import fbIcon from '../assets/facebook.png';
import twitterIcon from '../assets/twitter.png';
import avatars from "../assets/Avatar.png";
import { primaryColor, secondaryColor }from '../utils/Color';

const LoginContainer = styled.div`
  display: flex; 
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const changeColors = keyframes`
  0%, 100% {
    filter: hue-rotate(0deg); /* Start and end with pink (320 degrees) */
  }
  50% {
    filter: hue-rotate(60deg); /* Transition to purple (240 degrees) */
  }
`;
const BackgroundImage = styled.img`
  /* Add styles for the background image */
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover; 
  object-position: right;
  z-index: -1; /* Put the image behind other content */
  animation: ${changeColors} 5s infinite linear; /* Apply the animation */
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 5rem;
  width: 50%;

  div.app-title {
    font-size: 80px;  
    font-weight: bold;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.02em;
    position: absolute;
    top: 5rem;
    left: 9rem;
  }
`;

const Avatars = styled.img`
  width: 100%;
  height: 80%;
  position: relative;
  right: 0rem;
  top: 12rem;
`

const LoginForm = styled.div`
  width: 60vh;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  color: #333;
  border-radius: 40px;
  margin-right: 3rem;

  h2.login-header {
    font-size: 26px;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 40px;
    font-weight: Normal;
    letter-spacing: 0.02em;
  }

  // INPUT BOX
  input {
    width: 70%;
    padding: 10px;
    margin: 10px 0;
    border: 2px solid #ddd;
    border-radius: 20px;
    font-size: 13px;
    outline: none;
  }

  // RESET AND FORGET LOGIN BUTTONS
  button.reset-button {
    width: 50%;
    padding: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: ${primaryColor};
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: ${secondaryColor};
    }
  }
  button.forget-button {
    color: #0a1172;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    background-color: white;
    border: none;
    cursor: pointer;
    transition: color 0.3s;
    padding: 10px;

    &:hover {
      color: #151e3d;
    }
  }

  // SEPARATOR BETWEEN LOGIN AND ALT LOGINS
  .separator-container {
    display: flex;
    margin-top: 20px;
    margin-bottom: 5px;
    width: 67%;
    padding: 10px;
    justify-content: center;
  }
  .separator-line {
    flex-grow: 1;
    height: 0px;
    background-color: black;
  }
  .separator-text {
    margin: 0 10px;
    font-size: 13px;
    white-space: nowrap;
  }

`;

const ForgetMessageContainer = styled.div`
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  padding-left: 70px;
  padding-right: 70px;
  padding-bottom: 10px;
  color: #888;

  button.forget-button {
    cursor: pointer;
    color: #0a1172;
    background-color: white;
    border: none;
    font-size: 14px;
    transition: color 0.3s;
    padding-bottom: 20px;

    &:hover {
      color: #151e3d;
    }
  }
`;


const RegisterContainer = styled.div`
  font-size: 16px;
  color: #888;

  button.forget-button {
    cursor: pointer;
    color: #0a1172;
    background-color: white;
    border: none;
    font-size: 16px;
    transition: color 0.3s;
    padding-bottom: 20px;

    &:hover {
      color: #151e3d;
    }
  }
`;

// ALTERNATIVE LOGIN BUTON STYLING
const IconOnlyButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;
const Icon = styled.img`
  width: 32px; /* Adjust the width and height as needed */
  height: 32px;
`;
const OtherLoginOptions = styled.div`
  display: flex;
  align-items: center;
  ${IconOnlyButton} {
    margin:10px;
  }
`;

/**
 * React component for the login page.
 * Allows users to verify their email with a code.
 */
function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const titleMessage = " elevate.";

  /**
   * Handles the login process.
   * If the provided username and password are valid, it navigates to the profile page.
   * Otherwise, it displays an alert indicating a failed login attempt.
 */
  const handleLogin = async () => {
    const { username, password } = credentials;
    if (await userExists(username, password)) {
      navigate('/profile');
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  /**
   * Checks if a user with the provided username and password exists.
   *
   * @param {string} username - The username to check.
   * @param {string} password - The password to check.
   * @returns {boolean} True if a user with the given username and password exists, false otherwise.
 */
  const userExists = async (username, password) => {
    try{
      const response = await fetch('/users');
      
      if (!response.ok) {
        throw new Error("failed to fetch users");
      }

      const users = await response.json();
      const matchingUser = users.find((user) => user.username === username && user.password === password);

      if (matchingUser) {
        console.log("MATCHED");
        return true;
      }
      return false;

    } catch (err) {
      console.error("Error checking if user exists", err);
      return false;
    }
  };

  // Function to handle key presses, particularly the "Enter" key for login
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <LoginContainer>
      <BackgroundImage src={bgImg} alt="bgImg" />
      <WelcomeMessage>
        <Avatars src={avatars} alt=" " />
        <div className="app-title">
          {titleMessage.split('').map((letter, index) => {
            return (
              <TextHover key={index}>
               {letter === " " ? '\u00A0' : letter}

              </TextHover>
            );
          })}
        </div>
      </WelcomeMessage>
      <LoginForm>
        <h2 className="login-header"> <strong>Email Verification</strong></h2>
        <ForgetMessageContainer>
          We have sent a code to your email
        </ForgetMessageContainer>
        <input
          className="user-input"
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />

        <button className="reset-button" onClick={() => handleNavigation('/reset')}>
          Verify account
        </button>

        <RegisterContainer> 
            Didn't receive code?
          <button className="forget-button" onClick={() => handleNavigation('/')}>
            Resend OTP
          </button>
        </RegisterContainer>

        <div className="separator-container">
          <hr className="separator-line" />
          <div className="separator-text">OR</div>
          <hr className="separator-line" />
        </div>
        <OtherLoginOptions>
          <IconOnlyButton>
            <Icon src={googleIcon} alt="Google" />
          </IconOnlyButton>
          <IconOnlyButton>
            <Icon src={fbIcon} alt="Facebook" />
          </IconOnlyButton>
          <IconOnlyButton>
            <Icon src={twitterIcon} alt="Twitter" />
          </IconOnlyButton>
        </OtherLoginOptions>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;
