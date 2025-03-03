// A custom calendar implementation using Google Calendar API

// API key from Google Cloud Console
const API_KEY = 'YOUR_API_KEY';
// Calendar ID from your Google Calendar settings
const CALENDAR_ID = '0dad6fdfea9ef786c12b08ca4911e33913ddae52fa51bfe8349c39f584bffe2b@group.calendar.google.com';

// DOM elements
const calendarEl = document.getElementById('custom-calendar');
const monthYearEl = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const daysContainer = document.getElementById('days-container');

// Current date
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Fetch events from Google Calendar
async function fetchEvents(year, month) {
    // Calculate time range for the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Format dates for API request
    const timeMin = firstDay.toISOString();
    const timeMax = lastDay.toISOString();
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?` +
            `key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
    }
}

// Render calendar
async function renderCalendar() {
    // Update month and year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Calculate days in month and first day of month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Clear previous days
    daysContainer.innerHTML = '';
    
    // Fetch events for the month
    const events = await fetchEvents(currentYear, currentMonth);
    
    // Create day headers (Sun, Mon, etc.)
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeaderEl = document.createElement('div');
        dayHeaderEl.className = 'day-header';
        dayHeaderEl.textContent = day;
        daysContainer.appendChild(dayHeaderEl);
    });
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day empty';
        daysContainer.appendChild(emptyCell);
    }
    
    // Create cells for all days in month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day';
        
        const dateNum = document.createElement('div');
        dateNum.className = 'date-num';
        dateNum.textContent = day;
        dayCell.appendChild(dateNum);
        
        // Check for events on this day
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date);
            return eventDate.getDate() === day;
        });
        
        // Add events to day cell
        if (dayEvents.length > 0) {
            const eventsList = document.createElement('div');
            eventsList.className = 'events-list';
            
            dayEvents.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'event';
                eventEl.textContent = event.summary;
                
                // Add category class if available in event description
                if (event.description) {
                    const categoryMatch = event.description.match(/category:\s*(\w+)/i);
                    if (categoryMatch && categoryMatch[1]) {
                        eventEl.classList.add(`category-${categoryMatch[1].toLowerCase()}`);
                    }
                }
                
                eventsList.appendChild(eventEl);
            });
            
            dayCell.appendChild(eventsList);
        }
        
        daysContainer.appendChild(dayCell);
    }
}

// Navigation handlers
prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// Initialize calendar
renderCalendar();
