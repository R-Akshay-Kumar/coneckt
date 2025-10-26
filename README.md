# Project: coneckt – Internal Chat Application

## Overview

**coneckt** is a simple yet modern internal chat application I created to help teams communicate and collaborate more efficiently.  

The idea is inspired by tools like **Microsoft Lync** and **Slack**, but this version is completely built from scratch using **HTML**, **CSS**, and **JavaScript**.  

---

## Features Implemented

### Login & Signup Page

- A dedicated `login.html` page where users can either **log in** or **create a new account**.

- JavaScript is used to **toggle between Login and Sign Up** modes smoothly.

- Includes a **simulated login** that redirects users to the main chat interface (`chat.html`) after submitting the form.

---

### Chat Application Interface

- The main chat page follows a **three-column layout**, similar to popular chat tools:

  1. **Navigation Bar:** A slim sidebar with icons for quick access to Chats and Groups.

  2. **List Panel:** Displays either **individual chat contacts** or **group chats**. A **search bar** is included for future functionality.

  3. **Chat Area:** The main section where messages are displayed.

---

### Dynamic List Switching

- Sidebar buttons toggle between **Chats** and **Groups**.

- Each section displays relevant contacts or groups with names, avatars, and status indicators.

---

### Search Bar

- A **search bar** is added to the top of the list panel.

- It’s currently UI-only but is ready for backend integration to support real searching in future updates.

---

### User Profile & Logout

- A **profile icon** is placed at the bottom of the navigation bar.

- Clicking the profile shows a **dropdown menu** with options to:

  - Change Name  

  - Change Bio  

  - Change Profile Photo  

  - Logout  

- The **Logout** option redirects the user back to `login.html`.

---

### Chat Functionality

- Each chat starts with a few **custom sample messages** (for example, “Hi! This is Dheeraj.”).

- When the user sends a message, a **simulated reply** (“Hello!”) appears.

- **Local avatar images** (`userDP.png`, `contactDP.png`, `groupDP.png`) are used to give the chat a more realistic look.

---

## Future Improvements (Backend Integration)

Here’s the plan for the next stages of development:

- **Backend (Node.js):**  
  To handle login/signup, authentication, and message storage.

- **Database (MySQL):**  
  To store user data, contacts, groups, and chat history.

- **Real-Time Messaging (Socket.io):**  
  To replace the current simulated replies with live, real-time messages between users.

- **Frontend Upgrade (React.js):**  
  To make the chat system more dynamic, responsive, and scalable.

---
