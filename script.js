/**
 * AegisGuard - Dynamic Password Strength Engine & Interactive Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const termsCheck = document.getElementById('termsCheck');
  
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIcon = document.getElementById('eyeIcon');
  const generateBtn = document.getElementById('generateBtn');
  const submitBtn = document.getElementById('submitBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const registrationForm = document.getElementById('registrationForm');
  
  // Strength Elements
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const strengthPercent = document.getElementById('strengthPercent');
  const crackValue = document.getElementById('crackValue');
  const crackTimeCard = document.getElementById('crackTimeCard');
  const matchBadge = document.getElementById('matchBadge');
  
  // Requirement Items
  const reqItems = {
    length: document.getElementById('req-length'),
    uppercase: document.getElementById('req-uppercase'),
    lowercase: document.getElementById('req-lowercase'),
    number: document.getElementById('req-number'),
    special: document.getElementById('req-special')
  };

  // Theme Management
  const savedTheme = localStorage.getItem('aegis_theme') || 'dark';
  document.body.className = savedTheme === 'light' ? 'light-theme' : 'dark-theme';

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    document.body.className = isDark ? 'light-theme' : 'dark-theme';
    localStorage.setItem('aegis_theme', isDark ? 'light' : 'dark');
    showToast(isDark ? 'Switched to Light Mode' : 'Switched to Dark Mode', 'fa-solid fa-moon');
  });

  // Password Visibility Toggle
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    confirmPasswordInput.type = isPassword ? 'text' : 'password';
    
    eyeIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  });

  // Password Strength Calculation Logic
  function evaluatePassword(pwd) {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    };

    // Update Requirement Checklist UI
    for (const key in checks) {
      const isMet = checks[key];
      const item = reqItems[key];
      const icon = item.querySelector('.req-icon');
      
      if (isMet) {
        item.classList.add('met');
        icon.className = 'fa-solid fa-circle-check req-icon';
      } else {
        item.classList.remove('met');
        icon.className = 'fa-solid fa-circle-notch req-icon';
      }
    }

    if (!pwd) {
      return { score: 0, percent: 0, label: 'Enter password', color: 'var(--strength-empty)', glow: 'transparent', timeToCrack: 'Instant' };
    }

    // Base score calculation from requirement checks
    let metCount = Object.values(checks).filter(Boolean).length;
    
    // Additional length bonus
    let lengthBonus = 0;
    if (pwd.length >= 12) lengthBonus += 15;
    if (pwd.length >= 16) lengthBonus += 15;

    // Character set pool size estimation for entropy
    let poolSize = 0;
    if (checks.lowercase) poolSize += 26;
    if (checks.uppercase) poolSize += 26;
    if (checks.number) poolSize += 10;
    if (checks.special) poolSize += 32;

    // Entropy in bits: E = L * log2(R)
    let entropy = poolSize > 0 ? pwd.length * Math.log2(poolSize) : 0;
    
    // Normalize percentage
    let percentage = Math.min(100, Math.round((entropy / 80) * 100));
    if (pwd.length < 6) percentage = Math.min(percentage, 20);

    // Determine Strength Level Tier
    let levelInfo = {
      label: 'Very Weak',
      color: 'var(--strength-weak)',
      glow: 'rgba(239, 68, 68, 0.4)'
    };

    if (percentage >= 90 && metCount === 5) {
      levelInfo = { label: 'Ultra Strong 🛡️', color: 'var(--strength-ultra)', glow: 'rgba(139, 92, 246, 0.5)' };
    } else if (percentage >= 75 && metCount >= 4) {
      levelInfo = { label: 'Strong', color: 'var(--strength-strong)', glow: 'rgba(6, 182, 212, 0.4)' };
    } else if (percentage >= 50 && metCount >= 3) {
      levelInfo = { label: 'Good', color: 'var(--strength-good)', glow: 'rgba(16, 185, 129, 0.4)' };
    } else if (percentage >= 25) {
      levelInfo = { label: 'Weak', color: 'var(--strength-fair)', glow: 'rgba(245, 158, 11, 0.4)' };
    }

    // Calculate Estimated Brute-Force Crack Time
    const crackTimeText = calculateCrackTime(entropy);

    return {
      percent: percentage,
      label: levelInfo.label,
      color: levelInfo.color,
      glow: levelInfo.glow,
      timeToCrack: crackTimeText
    };
  }

  // Calculate Crack Time based on entropy bits
  function calculateCrackTime(entropy) {
    if (entropy <= 0) return 'Instant';
    
    // Assuming 10 billion (10^10) offline hash attempts per second
    const combinations = Math.pow(2, entropy);
    const seconds = combinations / 1e10;

    if (seconds < 1) return 'Instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 3153600000000) return `${Math.round(seconds / 31536000000).toLocaleString()} centuries`;
    
    return 'Trillions of years 🌌';
  }

  // Update Dynamic Indicator Bar & Styling
  function updateStrengthUI() {
    const pwd = passwordInput.value;
    const result = evaluatePassword(pwd);

    // Dynamic CSS Variable Updates
    document.documentElement.style.setProperty('--current-strength-color', result.color);
    document.documentElement.style.setProperty('--current-strength-glow', result.glow);

    // Update Strength Bar Fill Width
    strengthFill.style.width = `${result.percent}%`;
    
    // Update Meta Information
    strengthText.textContent = result.label;
    strengthPercent.textContent = `${result.percent}%`;
    crackValue.textContent = result.timeToCrack;

    // Check Confirm Password Match
    validatePasswordMatch();

    // Check Overall Form Validation
    validateForm();
  }

  // Confirm Password Match Check
  function validatePasswordMatch() {
    const pwd = passwordInput.value;
    const confirmPwd = confirmPasswordInput.value;

    if (!confirmPwd) {
      matchBadge.className = 'match-badge';
      return;
    }

    if (pwd === confirmPwd) {
      matchBadge.className = 'match-badge visible';
      matchBadge.innerHTML = '<i class="fa-solid fa-check"></i> Passwords Match';
    } else {
      matchBadge.className = 'match-badge visible mismatch';
      matchBadge.innerHTML = '<i class="fa-solid fa-xmark"></i> Passwords Differ';
    }
  }

  // Overall Form Validation Rule
  function validateForm() {
    const isNameValid = fullNameInput.value.trim().length > 1;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    const pwd = passwordInput.value;
    const confirmPwd = confirmPasswordInput.value;
    const isPwdStrong = pwd.length >= 8;
    const isMatch = pwd.length > 0 && pwd === confirmPwd;
    const isTermsAccepted = termsCheck.checked;

    // Highlight input wrappers when valid
    fullNameInput.parentElement.classList.toggle('valid', isNameValid);
    emailInput.parentElement.classList.toggle('valid', isEmailValid);

    const isFormValid = isNameValid && isEmailValid && isPwdStrong && isMatch && isTermsAccepted;
    submitBtn.disabled = !isFormValid;
  }

  // Generate Strong Password Feature
  generateBtn.addEventListener('click', () => {
    const chars = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let generated = '';
    // Ensure at least one of each required type
    generated += chars.upper[Math.floor(Math.random() * chars.upper.length)];
    generated += chars.lower[Math.floor(Math.random() * chars.lower.length)];
    generated += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    generated += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];

    const allChars = chars.upper + chars.lower + chars.numbers + chars.symbols;
    const targetLength = 16;

    for (let i = 4; i < targetLength; i++) {
      generated += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle characters
    generated = generated.split('').sort(() => 0.5 - Math.random()).join('');

    passwordInput.value = generated;
    confirmPasswordInput.value = generated;

    // Trigger update
    updateStrengthUI();

    // Copy to clipboard notification
    navigator.clipboard.writeText(generated).then(() => {
      showToast('Generated strong password & copied to clipboard!', 'fa-solid fa-wand-magic-sparkles');
    }).catch(() => {
      showToast('Generated strong password!', 'fa-solid fa-key');
    });
  });

  // Toast Notification Helper
  function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Event Listeners for Live Feedback
  passwordInput.addEventListener('input', updateStrengthUI);
  confirmPasswordInput.addEventListener('input', updateStrengthUI);
  fullNameInput.addEventListener('input', validateForm);
  emailInput.addEventListener('input', validateForm);
  termsCheck.addEventListener('change', validateForm);

  // Form Submission
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...`;

    setTimeout(() => {
      submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Account Created!`;
      submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      showToast('Account created successfully! Welcome aboard.', 'fa-solid fa-shield-halved');
    }, 1500);
  });

  // Initial call
  updateStrengthUI();
});
