import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Function to register a user
export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the status is either 200 or 201
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Error registering user');
      }
  
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  

// Function to register as a guest
export const registerAsGuest = () => {
  window.location.href = "/guestPage"; // Redirect to guestPage
};
