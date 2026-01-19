// Validation utilities
const validators = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation
  isValidPhone: (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[0-9\+\-\s\(\)]{4,30}$/;
    return phoneRegex.test(phone);
  },

  // Password validation (min 6 chars)
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  // Name validation
  isValidName: (name) => {
    return name && name.trim().length >= 2;
  },

  // Booking validation
  validateBooking: (data) => {
    const errors = {};

    if (!validators.isValidName(data.name)) {
      errors.name = 'Valid name required';
    }

    if (!validators.isValidEmail(data.email)) {
      errors.email = 'Valid email required';
    }

    if (data.phone && !validators.isValidPhone(data.phone)) {
      errors.phone = 'Valid phone number required';
    }

    if (!data.vehicleType || !data.vehicleType.trim()) {
      errors.vehicleType = 'Vehicle type required';
    }

    if (!data.brand || !data.brand.trim()) {
      errors.brand = 'Brand required';
    }

    if (!data.model || !data.model.trim()) {
      errors.model = 'Model required';
    }

    if (!data.service_type || !data.service_type.trim()) {
      errors.service_type = 'Service type required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Contact validation
  validateContact: (data) => {
    const errors = {};

    if (!validators.isValidName(data.fullName)) {
      errors.fullName = 'Valid name required';
    }

    if (!validators.isValidEmail(data.email)) {
      errors.email = 'Valid email required';
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Sign up validation
  validateSignUp: (data) => {
    const errors = {};

    if (!validators.isValidName(data.name)) {
      errors.name = 'Valid name required';
    }

    if (!validators.isValidEmail(data.email)) {
      errors.email = 'Valid email required';
    }

    if (!validators.isValidPassword(data.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Login validation
  validateLogin: (data) => {
    const errors = {};

    if (!validators.isValidEmail(data.email)) {
      errors.email = 'Valid email required';
    }

    if (!data.password || data.password.length === 0) {
      errors.password = 'Password required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

module.exports = validators;
