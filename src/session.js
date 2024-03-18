// Import necessary modules
import { v4 as uuidv4 } from 'uuid';

// Function to get the value of a cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

// Function to generate a session ID if it doesn't exist in a cookie
function generateSessionId() {
    const sessionId = uuidv4();
    setCookie('session_id', sessionId, 1); // Cookie expires in 1 day
    return sessionId;
}

// Function to retrieve or generate the session ID
function getSessionId() {
    return getCookie('session_id') || generateSessionId();
}

// Get or generate the session ID
export const sessionId = getSessionId();

// Your application code here...
