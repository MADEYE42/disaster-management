# 🛡️ Suraksha

**Suraksha** is a mental health support platform designed to provide empathetic and supportive assistance to survivors through a chatbot powered by the 💡 Gemini 1.5 Flash API. The platform includes features for users to post emergencies, volunteers to accept and respond to emergencies, and a chatbot for mental health support. The chatbot is accessible via a 💬 floating widget, ensuring a non-intrusive user experience.

## 📚 Table of Contents
- [✨ Features](#features)
- [🖥️ Tech Stack](#tech-stack)
- [📋 Prerequisites](#prerequisites)
- [⚙️ Installation](#installation)
- [🚀 Usage](#usage)
- [📂 Project Structure](#project-structure)
- [🌐 API Endpoints](#api-endpoints)
- [🤖 Chatbot Integration](#chatbot-integration)
- [🛡️ Safety and Ethical Considerations](#safety-and-ethical-considerations)
- [🤝 Contributing](#contributing)
- [📧 Contact](#contact)

## ✨ Features
- **🚑 Emergency Posting and Management**:
  - Users can post emergencies with a title, description, and user ID.
  - Volunteers can view and accept/decline emergencies.
  - Emergencies are stored in a JSON file (`data/emergency.json`) for persistence.
- **🤖 Mental Health Support Chatbot**:
  - A chatbot powered by the 💡 Gemini 1.5 Flash API provides empathetic and supportive responses for mental health survivors.
  - The chatbot appears as a floating widget (💬 chat icon) in the bottom-right corner of the screen.
  - Clicking the icon opens a compact chat window where users can interact with the chatbot.
  - Includes a system instruction to ensure responses are non-judgmental, encouraging, and safe.
- **👥 User and Volunteer Dashboards**:
  - `UserDashboard`: Allows users to post and manage their emergencies.
  - `VolunteerDashboard`: Allows volunteers to view and accept/decline emergencies.
- **🔄 Real-Time Updates**:
  - Polling is used to fetch emergencies every 10 seconds (configurable).
- **🛡️ Safety Features**:
  - Disclaimer in the chatbot window informing users that the chatbot is not a licensed professional.
  - Links to mental health resources (e.g., NAMI, National Suicide Prevention Lifeline).
  - Encourages users to seek professional help for serious issues like self-harm.

## 🖥️ Tech Stack
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Data Storage**: JSON file (`data/emergency.json`)
- **Chatbot API**: Gemini 1.5 Flash API (Google Generative AI)
- **Libraries**: axios, react-hot-toast, framer-motion, react-icons
- **Styling**: Tailwind CSS with the Inter font (via Google Fonts)

## 📋 Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Gemini API Key**: Obtain an API key from Google Cloud for the Gemini 1.5 Flash API.

## ⚙️ Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/suraksha.git
   cd suraksha
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Create the Data Directory**:
   ```bash
   mkdir -p data
   chmod -R 755 data
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## 🚀 Usage
1. **Access the Platform**: Visit `http://localhost:3000`.
2. **Interact with the Chatbot**: Click the 💬 chat icon to open the chat window.
3. **User & Volunteer Dashboards**: Post and manage emergencies, accept or decline emergencies.

## 📂 Project Structure
(Structure content goes here)

## 🌐 API Endpoints
(API content goes here)

## 🤖 Chatbot Integration
(Integration content goes here)

## 🛡️ Safety and Ethical Considerations
(Considerations content goes here)

## 🤝 Contributing
1. **Fork the repository**.
2. **Create a new branch**.
3. **Make your changes and commit**.
4. **Push to your branch**.
5. **Open a pull request**.

## 📧 Contact
For questions or support, contact:
- **Email**: gmadye13@gmail.com

