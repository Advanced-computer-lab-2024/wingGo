import React, { useState } from 'react';
import { registerUser, registerAsGuest } from '../APIs/RegisterApi'; // Import the API functions
import '../styling/RegisterPage.css';  // Import custom CSS for styling

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tourist'); // Default role is tourist
  const [mobileNumber, setMobileNumber] = useState('');  // Tourist-specific field
  const [nationality, setNationality] = useState('');    // Tourist-specific field
  const [dob, setDob] = useState('');                    // Tourist-specific field
  const [jobOrStudent, setJobOrStudent] = useState('job'); // Tourist-specific field
  const [wallet, setWallet] = useState('');               // Optional field
  const [isGuest, setIsGuest] = useState(false); // Guest flag
  const [error, setError] = useState(''); // Error state to handle form issues
  const [successMessage, setSuccessMessage] = useState(''); // Success message for feedback

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the form from refreshing the page
    
    // If registering as a guest
    if (isGuest) {
      registerAsGuest();
      return;
    }

    // Prepare user data
    const newUser = {
      username,
      email,
      password,
      role,
    };

    // If role is tourist, add tourist-specific fields
    if (role === 'tourist') {
      newUser.mobileNumber = mobileNumber;
      newUser.nationality = nationality;
      newUser.DOB = dob;
      newUser.jobOrStudent = jobOrStudent;
      newUser.wallet = wallet || 0; // Optional field with a default of 0
    }

    // Register the user using the API
    try {
      const response = await registerUser(newUser); // Call registerUser from registerApi.js
      window.alert('localhost:8000 says: User registered successfully!');
      setSuccessMessage('User registered successfully!');
      setError(''); // Clear any previous error
    } catch (error) {
      // Extract the error message from the backend response and display it
      const errorMessage = error.response?.data?.message || 'Error registering, please try again.';
      window.alert(`localhost:8000 says: ${errorMessage}`);
      setError(errorMessage); // Set the specific error message from the backend
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}  {/* Show error message if there’s an error */}
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Show success message */}
      
      <form onSubmit={handleSubmit} className="register-form">
        {!isGuest && (
          <>
            <input 
              type="text" 
              placeholder="Enter your username" 
              value={username}  // Bind value to state
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="register-input"
            />
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}  // Bind value to state
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="register-input"
            />
            <input 
              type="password" 
              placeholder="Create a password" 
              value={password}  // Bind value to state
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="register-input"
            />

            {/* Tourist-specific fields */}
            {role === 'tourist' && (
              <>
                <input 
                  type="text" 
                  placeholder="Enter your mobile number" 
                  value={mobileNumber} 
                  onChange={(e) => setMobileNumber(e.target.value)} 
                  required 
                  className="register-input"
                />
                <input 
                  type="text" 
                  placeholder="Enter your nationality" 
                  value={nationality} 
                  onChange={(e) => setNationality(e.target.value)} 
                  required 
                  className="register-input"
                />
                <input 
                  type="date" 
                  placeholder="Date of Birth (YYYY-MM-DD)" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  required 
                  className="register-input"
                />
                <select 
                  value={jobOrStudent} 
                  onChange={(e) => setJobOrStudent(e.target.value)} 
                  required 
                  className="register-select"
                >
                  <option value="job">Job</option>
                  <option value="student">Student</option>
                </select>
                {/* <input 
                  type="number" 
                  placeholder="Wallet Balance (Optional)" 
                  value={wallet} 
                  onChange={(e) => setWallet(e.target.value)} 
                  className="register-input"
                  aria-label="Wallet Balance (Optional)"
                /> */}
              </>
            )}

            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="register-select"
            >
              <option value="tourist">Tourist</option>
              <option value="tour guide">Tour Guide</option>
              <option value="seller">Seller</option>
              <option value="advertiser">Advertiser</option>
            </select>
            <button type="submit" className="register-btn">Register</button>
          </>
        )}
      </form>
      <button onClick={() => setIsGuest(true)} className="guest-btn">Continue as Guest</button>
    </div>
  );
};

export default RegisterPage;
