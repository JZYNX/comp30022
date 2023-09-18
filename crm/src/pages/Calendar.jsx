import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import ModalPopup from '../components/ModalPopup';
import { bgColor, defaultEventColor, textColor } from "../utils/Color";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/calendar.css";


const CalendarContainer = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color:rgba(255, 255, 255, 0.3);
`;

const SidebarColumn = styled.div`
  flex: 0 0 15%;
  min-width: 250px;
  background-color: #f0f0f0;
`;

const FullCalendarContainer = styled.div`
    position: relative;
    margin-top: 1rem;
    padding: 2rem;
    width: 100%;
    color: black;
`;

let eventIdCounter = 3;

function Calendar() {
    const [currEvents, setEvents] = useState([
        {
            id: '1',
            title: 'Event 1',
            start: '2023-09-20T10:00:00',
            end: '2023-09-20T12:00:00',
        },
        {
            id: '2',
            title: 'Event 2',
            start: '2023-09-21T14:00:00',
            end: '2023-09-21T16:00:00',
        },
    ]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [modalMode, setModalMode] = useState('create');

    const handleDateClick = (info) => {
        setModalMode('create');
        setStartDate(info.date);
        const nEndDate = new Date(info.date);
        nEndDate.setMinutes(nEndDate.getMinutes() + 30);
        setEndDate(nEndDate);
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    const HandleDateDrag = (info) => {
        setModalMode('create');
        setStartDate(info.start);
        setEndDate(info.end);
        setSelectedEvent(null);
        setIsModalOpen(true);
    }

    const handleEventClick = (info) => {
        setModalMode('edit');
        setStartDate(null);
        setEndDate(null);
        setSelectedEvent(info.event);
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    const handleCreateEvent = (event) => {
        if (modalMode === 'create') {
            const newEvent = {
                id: eventIdCounter.toString(), 
                ...event
            };
            setEvents([...currEvents, newEvent]);
            eventIdCounter += 1;
        } else if (modalMode === 'edit') {
            const updatedEvents = currEvents.map((e) =>
                e.id === selectedEvent.id ? { ...e, ...event } : e
            );
            setEvents(updatedEvents);
        }

        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleEventChange = (info) => {
        const updatedEvent = {
            ...info.event.toPlainObject(), 
            start: info.event.start?.toISOString() || null,
            end: info.event.end?.toISOString() || null,
        };
    
        const updatedEvents = currEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
        );
    
        setEvents(updatedEvents);
    };

    console.log(currEvents);

    return (
        <CalendarContainer>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
            <SidebarColumn>
                <Sidebar />
            </SidebarColumn>
            <FullCalendarContainer>
                <FullCalendar
                    height="90vh"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,today,next",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    allDaySlot={true}
                    events={currEvents}
                    eventResizableFromStart={true}
                    eventStartEditable={true}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    select={HandleDateDrag}
                    eventBackgroundColor={defaultEventColor}
                    eventBorderColor={defaultEventColor}
                    eventTextColor={textColor}
                    eventDisplay={'block'}
                    selectable={true}
                    editable={true}
                    selectMirror={true}
                    dayMaxEventRows={true}
                    eventTimeFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: 'short'
                    }}
                    navLinks={true}
                    eventDrop={handleEventChange} 
                    eventResize={handleEventChange}
                />
                <ModalPopup
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSave={handleCreateEvent}
                    mode={modalMode}
                    event={selectedEvent}
                    start={startDate}
                    end={endDate}
                />
            </FullCalendarContainer>
        </CalendarContainer>
    );
}

export default Calendar;