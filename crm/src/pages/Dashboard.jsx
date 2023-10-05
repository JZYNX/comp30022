import React, {useState} from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import { primaryColor, secondaryColor } from '../utils/Color';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '@mui/icons-material/Delete';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;
const SidebarColumn = styled.div`
  flex: 0 0 15%;
  min-width: 250px;
  background-color: #f0f0f0;
`;
const DashboardInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
// stats row on dashboard
const StatsContainer = styled.div`
  padding-top: 2rem;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;
const StatBox = styled.div`
  text-align: left;
  background-color: #ededed;
  border-radius: 1rem;
  padding: 0.5rem;
  padding-left: 2rem;
  margin: 0 0.25rem;
  height: 100%;
  width: 100%;

  h2.number {
    font-size: 36px; 
    font-weight: bold;
    margin: 0rem;
  }
  p.descriptor {
    margin: 0;
    font-size: 18px; 
  }
`;
// second row of dashboard including events and new connections
const SocialsBox = styled.div`
  display: flex;
  flex: 1;
  width: 90%;
  margin: auto;
  margin-top: 2rem;
  flex-direction: row;
`;
const EventConnectionDisplay = styled.div`
  flex: 1;
  background-color: #ededed;
  border-radius: 1rem;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  margin: 0 0.25rem;
  height: 100%;
  width: 100%;
  p.descriptor {
    font-size: 1.5rem; /* Adjust the font size as needed */
    font-weight: bold;
    margin-top: 0.313rem;
  }
`;
// implement notes display and create pop up notes feature
const NotesBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 90%;
  max-height: 20rem;
  margin: 2rem auto;
  background-color: #ededed;
  border-radius: 1rem;
`;
const NotesHeader = styled.div`
  display: flex;
  flex: 0.3;

  p.descriptor {
    font-size: 1.5rem; /* Adjust the font size as needed */
    font-weight: bold;
    padding-left: 2rem;
  }

  button {
    height: 2.5rem;
    width: 8rem;
    background-color: ${secondaryColor}; /* Use your desired button color */
    font-family: 'Poppins', sans-serif;
    color: white;
    border: none;
    border-radius: 1.25rem;
    padding: 0.625rem 1.25rem;
    margin-left: auto;
    margin-right: 2rem;
    margin-top: 1.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: ${primaryColor}; /* Use a darker color for hover effect */
    }
  }
`;
const NotesList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  overflow-y: auto;

  .note-item {
    display: flex;
    margin: 0.5rem 2rem;
    background-color: white;
    border-radius: 1rem;
    width: 43%;
    padding-left: 2rem;

    p.note-title {
      font-size: 0.9rem;
      &:hover {
        cursor: pointer;
      }
    }
    button {
      border: none;
      margin: auto 2rem auto auto; 
      background-color: inherit;

      &:hover {
        cursor: pointer;
      }
    }
  }
  &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: ${secondaryColor};
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
`;
const NotesPopup = styled.div`
  position: fixed; /* Change position to fixed */
  top: 0;
  left: 15%;
  width: 85%;
  height: 100%; 
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 0;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  overflow: hidden;

  .button-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  button {
    background-color: ${secondaryColor}; /* Use your desired button color */
    width: 50%;
    color: white;
    border: none;
    border-radius: 15px;
    padding: 1rem 2rem;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Poppins', sans-serif;
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
    transition: background-color 0.3s;
    &:hover {
      background-color: ${primaryColor}; /* Use a darker color for hover effect */
    }
  }
`;
const StyledInput = styled.input`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 18px;
  resize: vertical;
  width: calc(100% - 4rem); /* Calculate the width with margins */
`;

const StyledTextArea = styled.textarea`
  font-family: 'Poppins', sans-serif;
  margin-bottom: 0.5rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  resize: vertical;
  width: calc(100% - 4rem); /* Calculate the width with margins */
`;

function Dashboard() {

  const [showNotesPopup, setShowNotesPopup] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newTitle && newNote) {
      const updatedNotes = [
        ...notes,
        { title: newTitle, note: newNote }
      ];
      setNotes(updatedNotes);
      clearNoteInput();
    } else {
      showError('Please include a title and a note.');
    }
    setShowNotesPopup(null);
  };

  const clearNoteInput = () => {
    setNewTitle('');
    setNewNote('');
  };

  const showError = (message) => {
    toast.error(message);
  };

  const deleteNote = (index) => {
    if (index >= 0 && index < notes.length) {
      const updatedNotes = [...notes];
      updatedNotes.splice(index, 1);
      setNotes(updatedNotes);
    }
  };

  const updateTitle = (value) => {
    if (showNotesPopup !== null && showNotesPopup >= 0 && showNotesPopup < notes.length) {
      const updatedNotes = [...notes];
      updatedNotes[showNotesPopup].title = value;
      setNotes(updatedNotes);
    } else {
      setNewTitle(value);
    }
  };
  
  const updateNote = (value) => {
    if (showNotesPopup !== null && showNotesPopup >= 0 && showNotesPopup < notes.length) {
      const updatedNotes = [...notes];
      updatedNotes[showNotesPopup].note = value;
      setNotes(updatedNotes);
    } else {
      setNewNote(value);
    }
  };

  const exitAddNote = () => {
    if (
      (showNotesPopup !== null && showNotesPopup >= 0 && showNotesPopup < notes.length) ||
      (newTitle || newNote)
    ) {
      // If there are changes, prompt the user for confirmation
      const confirmDiscard = window.confirm(
        "Are you sure you want to discard the current note? Any unsaved changes will be lost."
      );
      if (!confirmDiscard) {
        return; // User canceled the discard action
      }
    }
    // Clear the note content and close the popup
    setNewTitle('');
    setNewNote('');
    setShowNotesPopup(null);
  };

  return (
    <DashboardContainer>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      <SidebarColumn>
        <Sidebar />
      </SidebarColumn>
      <DashboardInfo>
        <StatsContainer>
          <StatBox>
            <h2 className="number">150</h2>
            <p className="descriptor">Connections</p>
          </StatBox>
          <StatBox>
            <h2 className="number">12</h2>
            <p className="descriptor">Upcoming Events</p>
          </StatBox>
          <StatBox>
            <h2 className="number">4</h2>
            <p className="descriptor">To-do Tasks</p>
          </StatBox>
        </StatsContainer>
        <SocialsBox>
          <EventConnectionDisplay>
            <p className="descriptor">Upcoming Events</p> 
          </EventConnectionDisplay>
          <EventConnectionDisplay>
            <p className="descriptor">New Connections</p> 
          </EventConnectionDisplay>
        </SocialsBox>
        <NotesBox>
          <NotesHeader>
            <p className="descriptor">Notes</p>
            <button onClick={() => setShowNotesPopup(-1)}>New Note</button>
          </NotesHeader>
          <NotesList>
            {notes.map((note, index) => (
              <div className="note-item" key={index}>
                <p className='note-title'>{note ? note.title : 'No Title'}</p>
                <button onClick={() => deleteNote(index)} style={{ fontSize: "8px" }}><DeleteIcon/></button>
              </div>
            ))}
          </NotesList>
          {showNotesPopup !== null && (
            <NotesPopup>
              <StyledInput
                type="text"
                placeholder="Enter title here"
                value={showNotesPopup !== null && showNotesPopup >= 0 && showNotesPopup < notes.length ? notes[showNotesPopup].title : newTitle}
                onChange={(e) => updateTitle(e.target.value)}
              />
              <StyledTextArea
                rows="40"
                value={showNotesPopup !== null && showNotesPopup >= 0 && showNotesPopup < notes.length ? notes[showNotesPopup].note : newNote}
                onChange={(e) => updateNote(e.target.value)}
                placeholder="Enter your note here"
              />
              <div className="button-container">
                <button onClick={handleAddNote}>Save Note</button>
                <button onClick={exitAddNote}>Discard Note</button>
              </div>
            </NotesPopup>
          )}
        </NotesBox>
      </DashboardInfo>
    </DashboardContainer>
  );
}

export default Dashboard;
