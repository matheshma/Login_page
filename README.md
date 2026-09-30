# 🛡️ AegisGuard - Dynamic Password Field & Strength Indicator

A modern, highly responsive registration form featuring a dynamic password strength meter bar, real-time security entropy analysis, interactive requirement checklist, password crack time estimation, and a built-in strong password generator.

Built with **HTML5, Vanilla CSS3 (Glassmorphism), and Modern JavaScript (ES6)**. Zero external dependencies required. Optimized for instant deployment on **Vercel**.

---

## ✨ Features

- ⚡ **Dynamic Password Strength Bar**: Fluid CSS animation bar that adjusts width and changes color in real-time (`Red` → `Orange` → `Emerald` → `Cyan` → `Purple Glow`).
- 🔐 **Real-time Entropy & Criteria Checks**: Dynamic checklist that checks for length (8+ chars), uppercase, lowercase, numbers, and special symbols.
- ⏱️ **Crack Time Estimator**: Real-time calculation of estimated brute-force crack time (from *Instant* up to *Trillions of years*).
- 🪄 **Instant Password Generator**: One-click generation of 16-character strong passwords with automatic clipboard copying.
- 👁️ **Show/Hide Password Toggle**: Clean eye-icon toggle for instant visibility control.
- 🌙 **Dark / Light Theme Toggle**: Persistent theme switching using `localStorage`.
- 🚀 **Vercel Hostable**: Pre-configured with `vercel.json` for zero-configuration 1-click hosting on Vercel.

---

## 🚀 How to Host on Vercel

### Option 1: Direct GitHub Integration (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Initial commit - Dynamic password form"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com).
3. Click **"Add New Project"** -> **"Import Git Repository"**.
4. Select `Login_page` repository.
5. Click **"Deploy"**. Vercel will automatically build and publish your live website URL in seconds!

### Option 2: Using Vercel CLI
1. Install Vercel CLI globally (if not already installed):
   ```bash
   npm install -g vercel
   ```
2. In your project directory, run:
   ```bash
   vercel
   ```
3. Follow the quick prompts in your terminal to complete instant deployment.

---

## 💻 Local Development

To run and preview locally:

```bash
# Using npm serve
npm start

# Or open index.html directly in any web browser!
```

---

## 🛠️ File Structure

- `index.html` - Form structure, accessibility attributes, and dynamic elements.
- `styles.css` - Custom styling, glassmorphism card, color variables, glowing effects, and responsive layout.
- `script.js` - Real-time password strength calculation, entropy estimation, checklist updates, and password generator logic.
- `vercel.json` - Vercel deployment configuration.
- `package.json` - Npm scripts for local preview.
