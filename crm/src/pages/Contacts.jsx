import React, { useState, useEffect } from "react";
import styled, { keyframes } from 'styled-components';
import bgImg from '../assets/nikuubg.jpg';
import { useNavigate } from 'react-router-dom';
import { primaryColor, secondaryColor } from '../utils/Color';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    margin-top: 3rem;
    img {
      height: 2rem;
    }
    h3 {
      font-size: 36px;
      color: ${primaryColor};
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    margin-top: 3rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: ${secondaryColor};
      min-height: 3rem;
      cursor: pointer;
      width: 80%;
      border-radius: 2rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .username {
        margin-left: 0rem;
        h3 {
          font-size: 1rem;
          color: white;
          text-align: center;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        font-size: 1.4rem;
        color: ${primaryColor}};
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default function Contacts({ contacts, changeChat }) {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(null);
  const [currentSelected, setCurrentSelected] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storedUsername = urlParams.get('username');
    setCurrentUserName(storedUsername);
    // console.log(contacts) for testing
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    // console.log(contact); for testing 
    changeChat(contact);
  };

  const handleNavigation = (path) => {
      navigate(path);
  };

  return (
    <>
    <Container>
        <div className="brand">
        {/* <img src={Logo} alt="logo" /> */}
        <h3>
          elevate. <span style={{ fontWeight: 'normal', fontSize: '16px' }}>chat</span>
        </h3>
        </div>
        <div className="contacts">
        {contacts.map((contact, index) => {
            return (
            <div
                key={contact._id}
                className={`contact ${
                index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
            >
                <div className="avatar">
                  {contact.userImage ? (
                    <img
                    src={contact.userImage}
                    alt={contact.username}
                    style={{
                      width: '42px', 
                      height: '42px',
                      borderRadius: '50%',
                      display: 'block', 
                      margin: '0 0.7rem', 
                    }}
                    />
                  ) : (
                    <AccountCircleIcon
                      fontSize="large"
                      color="primary"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: 'white',
                        color: '#5e43b0',
                        borderRadius: '50%',
                        display: 'block', 
                        margin: '0 0.7rem', 
                      }}
                    />
                  )}
                </div>
                <div className="username">
                  <h3>
                    {contact.username.length > 12 ? contact.username.slice(0, 12) + '...' : contact.username}
                  </h3>
                </div>
            </div>
            );
        })}
        </div>
        <div className="current-user">
        <div className="username">
            <h2 
              onClick={() => handleNavigation(`/dashboard?username=${currentUserName}`)}
              style={{ cursor: 'pointer' }}
              >
                &lt;&lt;dashboard</h2>
        </div>
        </div>
    </Container>

    </>
  );
}