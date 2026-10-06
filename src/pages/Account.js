import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './Account.css';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    nationality: ''
  });
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    language: 'English',
    notifications: true,
    newsletter: true,
    darkMode: false
  });
  const [bookings, setBookings] = useState([]);
  const { user, isLoggedIn, logout, theme, toggleTheme } = useUser();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '',
        dateOfBirth: '',
        nationality: ''
      });
    }
  }, [user]);

  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }));
  }, [theme]);

  useEffect(() => {
    const mockBookings = [
      {
        id: 'BK001',
        hotelName: 'Grand Palace Resort',
        location: 'Paris, France',
        checkIn: '2024-03-15',
        checkOut: '2024-03-18',
        status: 'Confirmed',
        totalAmount: 897,
        roomType: 'Deluxe Suite'
      },
      {
        id: 'BK002',
        hotelName: 'Ocean Breeze Hotel',
        location: 'Miami, USA',
        checkIn: '2024-02-10',
        checkOut: '2024-02-14',
        status: 'Completed',
        totalAmount: 756,
        roomType: 'Beach Suite'
      }
    ];
    setBookings(mockBookings);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="account-container">
        <div className="account-wrapper">
          <div className="not-logged-in">
            <div className="login-prompt">
              <div className="prompt-icon">👤</div>
              <h2>Please log in to access your account</h2>
              <p>Manage your profile, bookings, and preferences</p>
              <button className="login-btn">Sign In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handlePreferencesChange = (key, value) => {
    if (key === 'darkMode') {
      toggleTheme();
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderProfileTab = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>Personal Information</h3>
        <p>Update your account details and personal information</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={profileData.dateOfBirth}
              onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              placeholder="Enter your address"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nationality">Nationality</label>
            <select
              id="nationality"
              value={profileData.nationality}
              onChange={(e) => setProfileData({...profileData, nationality: e.target.value})}
            >
              <option value="">Select nationality</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button type="button" className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderBookingsTab = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>My Bookings</h3>
        <p>View and manage your hotel reservations</p>
      </div>

      <div className="bookings-list">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📋</div>
            <h4>No bookings found</h4>
            <p>You haven't made any reservations yet</p>
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-id">Booking #{booking.id}</div>
                <div className={`booking-status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </div>
              </div>

              <div className="booking-details">
                <div className="hotel-info">
                  <h4 className="hotel-name">{booking.hotelName}</h4>
                  <p className="hotel-location">📍 {booking.location}</p>
                  <p className="room-type">🏨 {booking.roomType}</p>
                </div>

                <div className="stay-info">
                  <div className="dates">
                    <div className="date-item">
                      <span className="date-label">Check-in</span>
                      <span className="date-value">{new Date(booking.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="date-separator">→</div>
                    <div className="date-item">
                      <span className="date-label">Check-out</span>
                      <span className="date-value">{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-price">
                  <div className="total-amount">
                    <span className="amount-label">Total Paid</span>
                    <span className="amount-value">${booking.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="booking-actions">
                <button className="action-btn view">View Details</button>
                <button className="action-btn download">Download Receipt</button>
                {booking.status === 'Confirmed' && (
                  <button className="action-btn cancel">Cancel Booking</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>Preferences & Settings</h3>
        <p>Customize your account preferences and app settings</p>
      </div>

      <div className="preferences-sections">
        <div className="preference-section">
          <h4>General Preferences</h4>
          <div className="preference-items">
            <div className="preference-item">
              <div className="preference-info">
                <label>Currency</label>
                <span className="preference-desc">Choose your preferred currency</span>
              </div>
              <select
                value={preferences.currency}
                onChange={(e) => handlePreferencesChange('currency', e.target.value)}
                className="preference-select"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <label>Language</label>
                <span className="preference-desc">Select your language</span>
              </div>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferencesChange('language', e.target.value)}
                className="preference-select"
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        <div className="preference-section">
          <h4>Notifications</h4>
          <div className="preference-items">
            <div className="preference-item">
              <div className="preference-info">
                <label>Push Notifications</label>
                <span className="preference-desc">Receive booking updates and offers</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => handlePreferencesChange('notifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <label>Newsletter</label>
                <span className="preference-desc">Get travel tips and special deals</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.newsletter}
                  onChange={(e) => handlePreferencesChange('newsletter', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="preference-section">
          <h4>Appearance</h4>
          <div className="preference-items">
            <div className="preference-item">
              <div className="preference-info">
                <label>Dark Mode</label>
                <span className="preference-desc">Switch between light and dark theme</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.darkMode}
                  onChange={(e) => handlePreferencesChange('darkMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>Security Settings</h3>
        <p>Manage your account security and privacy settings</p>
      </div>

      <div className="security-sections">
        <div className="security-section">
          <h4>Password</h4>
          <div className="security-item">
            <div className="security-info">
              <span>Last changed: 2 months ago</span>
              <p>Choose a strong password to keep your account secure</p>
            </div>
            <button className="security-btn">Change Password</button>
          </div>
        </div>

        <div className="security-section">
          <h4>Two-Factor Authentication</h4>
          <div className="security-item">
            <div className="security-info">
              <span>Status: Not enabled</span>
              <p>Add an extra layer of security to your account</p>
            </div>
            <button className="security-btn">Enable 2FA</button>
          </div>
        </div>

        <div className="security-section danger">
          <h4>Account Actions</h4>
          <div className="security-item">
            <div className="security-info">
              <span>Sign out of your account</span>
              <p>You'll need to sign in again to access your account</p>
            </div>
            <button className="security-btn logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <span>Delete your account</span>
              <p>Permanently delete your account and all associated data</p>
            </div>
            <button className="security-btn delete">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="account-container">
      <div className="account-wrapper">
        
        <div className="account-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h2 className="user-name">{user?.name}</h2>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="account-content">
          <div className="account-sidebar">
            <nav className="account-nav">
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="nav-icon">👤</span>
                Profile
              </button>
              <button
                className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <span className="nav-icon">📋</span>
                My Bookings
              </button>
              <button
                className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <span className="nav-icon">⚙️</span>
                Preferences
              </button>
              <button
                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <span className="nav-icon">🔒</span>
                Security
              </button>
            </nav>
          </div>

          <div className="account-main">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'bookings' && renderBookingsTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'security' && renderSecurityTab()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Account;