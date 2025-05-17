// Global state (in-memory, replace with actual API calls and localStorage for token)
let currentUser = null; // { email: 'user@example.com', role: 'user', token: 'fake-token' } or { email: 'admin@example.com', role: 'admin', token: 'fake-admin-token' }
let events = [
    {
        id: '1',
        name: 'Tech Event 2025',
        description: 'Join Areeb Technology in Cairo for an electrifying tech event showcasing cutting-edge innovations shaping tomorrow’s digital landscape. This premier gathering brings together industry leaders, startups, and tech enthusiasts to explore breakthroughs in AI, IoT, cybersecurity, and sustainable tech solutions. Engage in hands-on workshops, keynote sessions by global experts, and dynamic panel discussions on emerging trends. Network with pioneers driving Egypt’s tech revolution and discover tools to transform your business or career. Whether you’re a developer, entrepreneur, or tech-curious, this event offers unparalleled insights and collaboration opportunities. Don’t miss your chance to be part of Cairo’s most anticipated tech experience.',
        category: 'Technology',
        date: '2025-12-07T10:00:00',
        venue: 'Areeb technology',
        price: 99.99,
        image: '../assets/tech event.jpg'
    },
    {
        id: '2',
        name: 'Art Event',
        description: 'Step into a world of inspiration, celebrating creativity across mediums. Discover contemporary masterpieces, traditional craftsmanship, and groundbreaking digital art installations. Engage with renowned artists, curators, and innovators through live demonstrations, interactive workshops, and thought-provoking panel discussions on art’s evolving role in society. Network with emerging talents and galleries shaping Egypt’s vibrant art scene, and explore opportunities to blend technology with artistic expression. Whether you’re an artist, collector, or art enthusiast, this immersive experience invites you to ignite your passion and connect with Cairo’s cultural pulse. Don’t miss this fusion of tradition and innovation',
        category: 'Arts & Culture',
        date: '2025-09-06T14:00:00',
        venue: 'Arts and Culture Center',
        price: 45.00,
        image: '../assets/art workshop event.jpg'
    },
    {
        id: '3',
        name: 'Animal Right Day Event',
        description: 'Join a compassionate gathering in Cairo dedicated to advocating for animal welfare and ethical treatment. This impactful event unites activists, NGOs, and animal lovers to raise awareness through inspiring talks, educational workshops, and interactive exhibits on rescue initiatives, wildlife conservation, and humane policies. Engage with veterinarians, conservationists, and legal experts in panel discussions addressing challenges and solutions in animal rights. Discover volunteer opportunities, adoption drives, and sustainable ways to support local shelters. Whether you’re a seasoned advocate or a concerned citizen, empower yourself to make a difference and stand with Cairo’s growing community committed to protecting all living beings. Together, we amplify their voices.',
        category: 'Right Day',
        date: '2025-07-08T12:00:00',
        venue: 'Animal Rights Association',
        price: 5.00,
        image: '../assets/animal event.jpg'
    }
];
let bookings = []; // { userId: 'user@example.com', eventId: '1' }

const API_BASE_URL = '/api'; // Placeholder for your backend API URL

// --- Utility Functions ---
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function updateNavLinks() {
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link') || document.getElementById('login-link-details') || document.getElementById('login-link-congrats');
    const registerLink = document.getElementById('register-link') || document.getElementById('register-link-details') || document.getElementById('register-link-congrats');
    const adminLink = document.getElementById('admin-link') || document.getElementById('admin-link-details') || document.getElementById('admin-link-congrats');
    const logoutLink = document.getElementById('logout-link') || document.getElementById('logout-link-details') || document.getElementById('logout-link-admin') || document.getElementById('logout-link-congrats');

    if (loggedInUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline-block';
        if (adminLink) {
            adminLink.style.display = loggedInUser.role === 'admin' ? 'inline-block' : 'none';
        }
    } else {
        if (loginLink) loginLink.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'inline-block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    currentUser = null;
    updateNavLinks();
    // Potentially redirect to login or home page
    if (window.location.pathname.includes('admin.html') || window.location.pathname.includes('event-details.html')) {
        window.location.href = 'index.html';
    } else {
        // For other pages, just update nav or refresh if needed
        // window.location.reload(); // Or simply update UI elements
    }
}

// --- Event Listing (Home Page) ---
async function fetchEvents() {
    // In a real app, this would be: return fetch(`${API_BASE_URL}/events`).then(res => res.json());
    return Promise.resolve(events); // Using placeholder data
}

async function fetchUserBookings() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return Promise.resolve([]);
    // In a real app: return fetch(`${API_BASE_URL}/bookings/user/${user.id}`, { headers: getAuthHeaders() }).then(res => res.json());
    return Promise.resolve(bookings.filter(b => b.userId === user.email)); // Placeholder
}

async function displayEvents() {
    const eventGrid = document.getElementById('event-grid');
    if (!eventGrid) return;

    const [eventsData, userBookingsData] = await Promise.all([fetchEvents(), fetchUserBookings()]);
    const bookedEventIds = userBookingsData.map(b => b.eventId);

    eventGrid.innerHTML = ''; // Clear existing events
    eventsData.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <img src="${event.image}" alt="${event.name}">
            <h3>${event.name}</h3>
            <p class="category">Category: ${event.category}</p>
            <p class="date">Date: ${new Date(event.date).toLocaleString()}</p>
            <p class="venue">Venue: ${event.venue}</p>
            <p class="description-summary">${event.description.substring(0, 100)}...</p>
            <p class="price">Price: $${event.price.toFixed(2)}</p>
            ${bookedEventIds.includes(event.id) ? 
                '<div class="booked-label">Booked</div>' : 
                `<button class="button book-now-btn" data-event-id="${event.id}">Book Now</button>`
            }
            <a href="event-details.html?eventId=${event.id}" class="button secondary">View Details</a>
        `;
        eventGrid.appendChild(card);
    });

    document.querySelectorAll('.book-now-btn').forEach(button => {
        button.addEventListener('click', handleBookNow);
    });
}

// --- Event Details Page ---
async function fetchEventDetails(eventId) {
    // In a real app: return fetch(`${API_BASE_URL}/events/${eventId}`).then(res => res.json());
    return Promise.resolve(events.find(e => e.id === eventId)); // Placeholder
}

async function displayEventDetails() {
    const container = document.getElementById('event-details-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    if (!eventId) {
        container.innerHTML = '<p>Event not found.</p>';
        return;
    }

    const event = await fetchEventDetails(eventId);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    let isBooked = false;
    if (user) {
        const userBookingsData = await fetchUserBookings();
        isBooked = userBookingsData.some(b => b.eventId === eventId);
    }

    if (event) {
        container.innerHTML = `
            <img src="${event.image}" alt="${event.name}">
            <h2>${event.name}</h2>
            <p class="category">Category: ${event.category}</p>
            <p class="date"><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
            <p class="venue"><strong>Venue:</strong> ${event.venue}</p>
            <p class="price"><strong>Price:</strong> $${event.price.toFixed(2)}</p>
            <p class="description">${event.description}</p>
            ${isBooked ? 
                '<div class="booked-label">Already Booked</div>' : 
                `<button class="button book-now-btn" data-event-id="${event.id}">Book Now (1 Ticket)</button>`
            }
        `;
        container.querySelectorAll('.book-now-btn').forEach(button => {
            button.addEventListener('click', handleBookNow);
        });
    } else {
        container.innerHTML = '<p>Event details could not be loaded.</p>';
    }
}

// --- Booking Logic ---
async function handleBookNow(clickEvent) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please log in to book events.');
        window.location.href = 'login.html';
        return;
    }

    const eventId = clickEvent.target.dataset.eventId;
    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/bookings`, {
    //     method: 'POST',
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify({ eventId: eventId, userId: user.id /* or let backend get from token */ })
    // });
    // if (response.ok) {
    //     bookings.push({ userId: user.email, eventId: eventId }); // Simulate local update
    //     window.location.href = 'congratulations.html';
    // } else {
    //     alert('Booking failed. Please try again.');
    // }

    // Placeholder logic:
    const existingBooking = bookings.find(b => b.userId === user.email && b.eventId === eventId);
    if (existingBooking) {
        alert('You have already booked this event.');
        return;
    }
    bookings.push({ userId: user.email, eventId: eventId });
    console.log('Booked event:', eventId, 'for user:', user.email);
    
    // Change the button to "Booked" with green color
    const button = clickEvent.target;
    button.textContent = 'Booked';
    button.style.backgroundColor = 'var(--success-color)';
    button.disabled = true;
    
    alert('Booking successful! (Simulated)');
    // Delay redirect to show the button change
    setTimeout(() => {
        window.location.href = 'congratulations.html';
    }, 1000);
}

// --- Authentication (Login/Register) ---
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Use real API call to backend
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Create user object from response
            const user = {
                email: email,
                role: data.role,
                username: data.username,
                userId: data.userId
            };
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUser = user;
            updateNavLinks();
            window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html';
        } else {
            // Handle error response
            const errorData = await response.json();
            alert(`Login failed: ${errorData.message || 'Please check your credentials.'}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        
        // Fallback to test accounts if API call fails
        if (email === 'admin@example.com' && password === 'adminpass') {
            currentUser = { email: 'admin@example.com', role: 'admin' };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('authToken', 'fake-admin-token');
            updateNavLinks();
            window.location.href = 'admin.html';
        } else if (email === 'user@example.com' && password === 'userpass') {
            currentUser = { email: 'user@example.com', role: 'user' };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('authToken', 'fake-user-token');
            updateNavLinks();
            window.location.href = 'index.html';
        } else {
            alert('Login failed. You can use test accounts: admin@example.com/adminpass or user@example.com/userpass');
        }
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/auth/register`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, email, password, role: 'user' })
    // });
    // if (response.ok) {
    //     alert('Registration successful! Please log in.');
    //     window.location.href = 'login.html';
    // } else {
    //     const errorData = await response.json();
    //     alert(`Registration failed: ${errorData.message || 'Please try again.'}`);
    // }

    // Placeholder logic:
    alert('Registration successful! (Simulated) Please log in with the details you entered or use test accounts.');
    console.log('Registered user:', username, email);
    window.location.href = 'login.html';
}

// --- Admin Panel ---
const createEventForm = document.getElementById('create-event-form');
const updateEventForm = document.getElementById('update-event-form');
const adminEventList = document.getElementById('admin-event-list');
const showCreateEventFormButton = document.getElementById('show-create-event-form');

function checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        alert('Access denied. Admins only.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

async function displayAdminEvents() {
    if (!adminEventList || !checkAdminAccess()) return;

    const eventsData = await fetchEvents(); // Reuse fetchEvents for now
    adminEventList.innerHTML = ''; // Clear existing

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Date</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    const tbody = table.querySelector('tbody');
    eventsData.forEach(event => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.category}</td>
            <td>${new Date(event.date).toLocaleDateString()}</td>
            <td>$${event.price.toFixed(2)}</td>
            <td class="actions">
                <button class="button secondary edit-event-btn" data-event-id="${event.id}">Edit</button>
                <button class="button danger delete-event-btn" data-event-id="${event.id}">Delete</button>
            </td>
        `;
    });
    adminEventList.appendChild(table);

    document.querySelectorAll('.edit-event-btn').forEach(btn => btn.addEventListener('click', handleEditEventForm));
    document.querySelectorAll('.delete-event-btn').forEach(btn => btn.addEventListener('click', handleDeleteEvent));
}

function handleShowCreateEventForm() {
    if (!createEventForm || !updateEventForm) return;
    createEventForm.style.display = 'block';
    updateEventForm.style.display = 'none';
    createEventForm.reset(); // Clear form fields
}

function populateUpdateForm(eventId) {
    if (!updateEventForm || !createEventForm) return;
    const event = events.find(e => e.id === eventId); // Placeholder find
    if (event) {
        document.getElementById('updateEventId').value = event.id;
        document.getElementById('updateEventName').value = event.name;
        document.getElementById('updateEventDescription').value = event.description;
        document.getElementById('updateEventCategory').value = event.category;
        // Format date for datetime-local input: YYYY-MM-DDTHH:mm
        const isoDate = new Date(event.date).toISOString();
        document.getElementById('updateEventDate').value = isoDate.substring(0, 16);
        document.getElementById('updateEventVenue').value = event.venue;
        document.getElementById('updateEventPrice').value = event.price;
        document.getElementById('updateEventImage').value = event.image;

        updateEventForm.style.display = 'block';
        createEventForm.style.display = 'none';
    } else {
        alert('Event not found for editing.');
    }
}

function handleEditEventForm(clickEvent) {
    const eventId = clickEvent.target.dataset.eventId;
    populateUpdateForm(eventId);
}

async function handleCreateEvent(event) {
    event.preventDefault();
    if (!checkAdminAccess()) return;

    const newEvent = {
        id: String(Date.now()), // Temporary ID generation
        name: document.getElementById('eventName').value,
        description: document.getElementById('eventDescription').value,
        category: document.getElementById('eventCategory').value,
        date: document.getElementById('eventDate').value,
        venue: document.getElementById('eventVenue').value,
        price: parseFloat(document.getElementById('eventPrice').value),
        image: document.getElementById('eventImage').value
    };

    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/events`, {
    //     method: 'POST',
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify(newEvent)
    // });
    // if (response.ok) {
    //     events.push(await response.json()); // Add the created event returned by API
    //     displayAdminEvents();
    //     createEventForm.reset();
    //     createEventForm.style.display = 'none';
    // } else {
    //     alert('Failed to create event.');
    // }

    // Placeholder:
    events.push(newEvent);
    console.log('Created event:', newEvent);
    alert('Event created successfully! (Simulated)');
    displayAdminEvents();
    if(createEventForm) {
        createEventForm.reset();
        createEventForm.style.display = 'none';
    }
}

async function handleUpdateEvent(event) {
    event.preventDefault();
    if (!checkAdminAccess()) return;

    const eventId = document.getElementById('updateEventId').value;
    const updatedEventData = {
        name: document.getElementById('updateEventName').value,
        description: document.getElementById('updateEventDescription').value,
        category: document.getElementById('updateEventCategory').value,
        date: document.getElementById('updateEventDate').value,
        venue: document.getElementById('updateEventVenue').value,
        price: parseFloat(document.getElementById('updateEventPrice').value),
        image: document.getElementById('updateEventImage').value
    };

    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    //     method: 'PUT',
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify(updatedEventData)
    // });
    // if (response.ok) {
    //     const updatedEventFromServer = await response.json();
    //     const index = events.findIndex(e => e.id === eventId);
    //     if (index !== -1) events[index] = updatedEventFromServer;
    //     displayAdminEvents();
    //     updateEventForm.reset();
    //     updateEventForm.style.display = 'none';
    // } else {
    //     alert('Failed to update event.');
    // }

    // Placeholder:
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
        events[index] = { ...events[index], ...updatedEventData };
        console.log('Updated event:', events[index]);
        alert('Event updated successfully! (Simulated)');
        displayAdminEvents();
        if(updateEventForm) {
            updateEventForm.reset();
            updateEventForm.style.display = 'none';
        }
    } else {
        alert('Event not found for update.');
    }
}

async function handleDeleteEvent(clickEvent) {
    if (!checkAdminAccess()) return;
    const eventId = clickEvent.target.dataset.eventId;
    if (!confirm('Are you sure you want to delete this event?')) return;

    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    //     method: 'DELETE',
    //     headers: getAuthHeaders()
    // });
    // if (response.ok) {
    //     events = events.filter(e => e.id !== eventId);
    //     displayAdminEvents();
    // } else {
    //     alert('Failed to delete event.');
    // }

    // Placeholder:
    events = events.filter(e => e.id !== eventId);
    console.log('Deleted event:', eventId);
    alert('Event deleted successfully! (Simulated)');
    displayAdminEvents();
}

// --- Page Load Initializers ---
document.addEventListener('DOMContentLoaded', () => {
    updateNavLinks(); // Update nav on every page load

    // Attach logout listeners if logout links exist
    const logoutLinks = document.querySelectorAll('#logout-link, #logout-link-details, #logout-link-admin, #logout-link-congrats');
    logoutLinks.forEach(link => {
        if (link) link.addEventListener('click', handleLogout);
    });

    // Page-specific initializations
    if (document.getElementById('event-grid')) {
        displayEvents();
    }
    if (document.getElementById('event-details-container')) {
        displayEventDetails();
    }
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }
    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', handleRegister);
    }
    if (document.getElementById('admin-event-list')) {
        if(checkAdminAccess()) {
            displayAdminEvents();
            if (showCreateEventFormButton) {
                showCreateEventFormButton.addEventListener('click', handleShowCreateEventForm);
            }
            if (createEventForm) {
                createEventForm.addEventListener('submit', handleCreateEvent);
                document.getElementById('cancel-create-event').addEventListener('click', () => { createEventForm.style.display = 'none'; });
            }
            if (updateEventForm) {
                updateEventForm.addEventListener('submit', handleUpdateEvent);
                document.getElementById('cancel-update-event').addEventListener('click', () => { updateEventForm.style.display = 'none'; });
            }
        } 
    }
});

