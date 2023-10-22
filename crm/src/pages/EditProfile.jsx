import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import bgImg from '../assets/nikuubg.jpg';
import styled, { keyframes } from 'styled-components';
import { primaryColor, secondaryColor } from '../utils/Color';
import axios from 'axios';

// Styled components for styling the profile page
const ProfileContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const SidebarColumn = styled.div`
  flex: 0 0 15%;
  min-width: 250px;
  background-color: #f0f0f0;
`;

const ProfileDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;
const ProfileTitle = styled.div`
  padding-top: 4rem;
  font-weight: bold;
  padding-left: 7%;
  padding-bottom: 1rem;

  h2.profile-header {
    font-size: 30px;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 10px;
    margin-top: 10px;
    font-weight: bold;
  }
`;
const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 86%;
  padding-left: 6%;
  padding-right: 6%;
`
const LeftColumn = styled.div`
  display: flex;
  flex: 0.6;
  flex-direction: column; 
  height: 80%;
  background-color: hsla(278, 69%, 38%, 0.1);
  margin: 0 1rem 0 1rem;
  border-radius: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`
const RightColumn = styled.div`
  display: flex;
  flex: 0.4;
  flex-direction: column; 
  height: 80%;
  background-color: hsla(278, 69%, 38%, 0.1);
  margin: 0 1rem 0 1rem;
  border-radius: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`
const InfoBox = styled.div`
  background-color: white;
  text-align: center;
  height: 90%;
  width: 95%;
  border-radius: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`
const ProfilePicContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 90%;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 1rem 0rem;

  .info-header {
    width: 16rem;
  }
`
const ProfilePic = styled.div`
  width: 150px; 
  height: 150px; 
  border-radius: 50%; 
  border: 1px solid #ddd;
  overflow: hidden;
  margin-right: 2rem;
`;
const ProfilePicImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  .profile-button {
    width: 100%;
    margin-top: 8px;
    margin-bottom: 8px;
    background-color: ${secondaryColor};
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
    border-radius: 5px;
    text-align: center;
    transition: background-color 0.3s ease;
    font-family: 'Poppins', sans-serif;

    &:hover {
      background-color: ${primaryColor};
    }
  }
`;
const ProfileButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 8px;
  background-color: ${secondaryColor};
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;
  transition: background-color 0.3s ease;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background-color: ${primaryColor};
  }
`;

/**
 * React component for the user profile page.
 * Displays user information and allows editing.
 */
function EditProfile() {

  // store the states
  const [isEditMode, setIsEditMode] = useState(false); 
  const [changesSaved, setChangesSaved] = useState(false); 
  const [postImage, setPostImage] = useState( { myFile : ""})
  const [selectedImagePath, setSelectedImagePath] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
    city: '',
    state: '',
  });

  // Create a URLSearchParams object to parse the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Get the 'username' parameter value from the URL
  const storedUsername = urlParams.get('username');

  // Fetch user data and set it in the component state.
  useEffect(() => {
    async function fetchUserDataAndSetState() {
      try {
        const userResponse = await fetchUserData(storedUsername);
        setUserData(userResponse);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserDataAndSetState();
  }, [storedUsername]);

  /**
   * Handle the logic for uploading an image.
   * @param {Event} event - The file input change event.
   */
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('userImage', file);
    try {
      const response = await fetch('/users/uploadImage', {
        method: 'PUT',
        body: formData,
      });
  
      if (response.status === 200) {
        const responseData = await response.json();
        
        setSelectedImagePath(responseData.filePath);
        console.log('Image uploaded successfully');
      } else {
        console.error('Failed to upload image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  // Toggle between edit and view mode for user profile.
  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  /**
   * Handle saving changes to user profile.
   * @param {Event} event - The form submission event.
   */
  const handleSaveChanges = async (event) => {
    event.preventDefault();
  
    // console.log('Stored Username:', storedUsername);
    const commonData = { ...userData, username: storedUsername };
  
    // Check if a new image was selected and update the data object accordingly
    if (selectedImagePath) {
      commonData.userImage = selectedImagePath;
    }
  
    try {
      // Send a PATCH request with the common data
      const response = await axios.patch(`/users/`, commonData);
  
      if (response.status === 200) {
        // Changes were successfully saved in the backend
        setChangesSaved(true);
        setIsEditMode(false);
        window.location.reload();
      } else {
        // Handle error if the request was not successful
        console.error('Failed to save changes to the backend.');
      }
    } catch (error) {
      console.error('Error in axios request:', error);
      // Handle the error as needed
      const errorMessage = error.response?.data?.message || 'An error occurred';
      alert(errorMessage);
    }
  };
  
  
  return (
    <ProfileContainer>
      <SidebarColumn>
        <Sidebar userName = {storedUsername}/>
      </SidebarColumn>
      <ProfileDisplayContainer>
        <ProfileTitle>
          <h2 className="profile-header">Profile</h2>
        </ProfileTitle>
        <ProfileInfoContainer>
          <LeftColumn>
            <InfoBox>
              VOTE NO            
            </InfoBox>
            <InfoBox>
              VOTE NO            
            </InfoBox>
          </LeftColumn>
          <RightColumn>
            <ProfilePicContainer>
              <ProfilePic>
                <ProfilePicImage src={userData.userImage ? '/' + userData.userImage : ''} alt="" />
              </ProfilePic>
              <h2 className="info-header">YO EVANO BICHAHH</h2>
            </ProfilePicContainer>
            <InfoBox>
              VOTE NO   
              <ButtonGroup>
                {isEditMode ? (
                  <label className="profile-button">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                ) : null}
                {isEditMode ? (
                  <>
                    <ProfileButton onClick={handleSaveChanges}>
                      Save Changes
                    </ProfileButton>
                  </>
                ) : (
                  <ProfileButton onClick={toggleEditMode}>Edit Profile</ProfileButton>
                )}
              </ButtonGroup>         
            </InfoBox>
          </RightColumn>
        </ProfileInfoContainer>
      </ProfileDisplayContainer>

        {/* <ProfileColumns>
          <div className="profile-info">
            <h2 className="info-header">First Name</h2>
            <input
              type="text"
              placeholder="etc. John"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              disabled={!isEditMode}
              className={isEditMode ? 'input-edit-mode' : 'input-nonedit-mode'}
            />
            <h2 className="info-header">Last Name</h2>
            <input
              type="text"
              placeholder="etc. Smith"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              disabled={!isEditMode}
              className={isEditMode ? 'input-edit-mode' : ''}
            />
            <h2 className="info-header">Email</h2>
            <input
              type="text"
              placeholder="etc. example@gmail.com"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              disabled={!isEditMode}
              className={isEditMode ? 'input-edit-mode' : ''}
            />
            <h2 className="info-header">Password</h2>
            <input
              type="password"
              placeholder="etc. Jsmith1923"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              disabled={!isEditMode}
              className={isEditMode ? 'input-edit-mode' : ''}
            />         
          </div>
          <div className="profile-info">
            <h2 className="info-header">Contact Number</h2>
            <input
              type="text"
              placeholder="etc. 0452382938"
              value={userData.contactNumber}
              onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
              disabled={!isEditMode}
              className={isEditMode ? 'input-edit-mode' : ''}
            />
            <h2 className="info-header">Address</h2>
            <input
              type="text"
              placeholder="197 Joy Street"
              value={userData.address ? userData.address.street : ''}
              onChange={(e) => setUserData({ ...userData, address: { ...userData.address, street: e.target.value } })}
              disabled={!isEditMode}
              className={isEditMode ? 'input-edit-mode' : ''}
            />
            <h2 className="info-header">City</h2>
            <input
              type="text"
              placeholder="etc. Melbourne"
              value={userData.address ? userData.address.city : ''}
              onChange={(e) => setUserData({ ...userData, address: { ...userData.address, city: e.target.value } })}
              disabled={!isEditMode}
              className={isEditMode ? 'input-edit-mode' : ''}
            />
            <h2 className="info-header">State</h2>
            <input
              type="text"
              placeholder="etc. Victoria"
              value={userData.address ? userData.address.state : ''}
              onChange={(e) => setUserData({ ...userData, address: { ...userData.address, state: e.target.value } })}
              disabled={!isEditMode}
              className={isEditMode ? 'input-edit-mode' : ''}
            />
          </div>
          <div className="profile-pic">
            <h2 className="info-header">Profile Pic</h2>
            <ProfilePicContainer>
              <ProfilePicImage src={userData.userImage ? '/' + userData.userImage : ''} alt="" />
            </ProfilePicContainer>
            <ButtonGroup>
              {isEditMode ? (
                <label className="profile-button">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              ) : null}
              {isEditMode ? (
                <>
                  <ProfileButton onClick={handleSaveChanges}>
                    Save Changes
                  </ProfileButton>
                </>
              ) : (
                <ProfileButton onClick={toggleEditMode}>Edit Profile</ProfileButton>
              )}
            </ButtonGroup>
          </div>
        </ProfileColumns> */}
    </ProfileContainer>
  );
}

/**
 * Fetch user data based on the provided username.
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} A promise that resolves to user data.
 * @throws {Error} If there is an error fetching user data.
 */
const fetchUserData = async (username) => {
  try {
    const response = await fetch(`/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const allUserData = await response.json();

    // Filter the user data to find the matching username
    const userData = allUserData.find(user => user.username === username);

    if (!userData) {
      throw new Error(`User with username "${username}" not found`);
    }

    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Handle the error as needed
  }
};

export default EditProfile;
