# Command Center — Emergency Incident Management Board

> Portfolio project authored by **Nicolás Velah**  
> A control center application for **managing emergency assistance requests**. Built with **React (Gatsby framework)** but focused on the **incident workflow design** rather than the framework itself.

---

## 🚀 Overview

The **Command Center** is a **scrum-like management board** adapted to emergency scenarios.  
It allows operators to receive, organize, and resolve incident reports in real time:

- Vehicle accidents  
- Breakdowns (engine failure, towing needs)  
- Tire changes and roadside repairs  
- General emergency assistance  

Each incident is represented as a **card on a board**, progressing through predefined workflow stages until resolution.  

The system integrates **preconfigured response scripts** to streamline operator–client communication, including chat flows that can connect directly with a client app.

---

## 🧱 Architecture & Design

Although developed with **Gatsby** (React framework for static and dynamic sites), the main focus of the project is the **control board logic and workflows**.  

The architecture applies concepts of **Clean Architecture** and **Dependency Injection**:

- **Domain**: Defines core entities like `Incident`, `AssistanceRequest`, and `Operator`.  
- **Application (Use Cases)**: Encapsulates workflows such as creating incidents, assigning operators, and updating statuses.  
- **Infrastructure**: Adapters for communication channels (chat API, push notifications).  
- **Interface (Presentation)**: React/Gatsby components for board UI, operator dashboards, and chat panels.  

**Dependency Injection** allows swapping communication adapters (e.g., client app chat vs. SMS integration) without altering the workflows or UI.

---

## 📋 Key Features

- **Scrum-style incident board**: incidents move across workflow columns (e.g., *New*, *Assigned*, *In Progress*, *Resolved*).  
- **Preconfigured response scripts**: guides for operators to handle typical roadside assistance scenarios.  
- **Live chat integration**: operators can communicate directly with clients via the app channel.  
- **Incident prioritization**: categorize and escalate emergencies by type and severity.  
- **Multi-role support**: operators, supervisors, and admins.  
- **Audit trail**: track history of each incident (timestamps, actions taken, operator notes).  

---

## 🔌 Example Workflows

1. **Vehicle Breakdown Reported**  
   - Client submits request → “New” column.  
   - Operator uses *Breakdown* script → collects vehicle location and condition.  
   - Incident moves to *Assigned*.  
   - Assistance dispatched → “In Progress”.  
   - Operator marks as *Resolved* after confirmation.  

2. **Tire Change Request**  
   - Client submits → “New”.  
   - Operator launches *Tire Change* script (step-by-step questions).  
   - Assistance team notified.  
   - Incident tracked until *Resolved*.  

---

## 📁 Suggested Folder Structure

```
src/
├── components/           # React UI components (board, cards, chat panel)
├── containers/           # State management and orchestration of workflows
├── context/              # App contexts (auth, operator session, incident state)
├── pages/                # Gatsby pages and routes
├── scripts/              # Preconfigured response scripts
├── domain/               # Core models (Incident, Request, Operator)
├── infrastructure/       # Adapters for chat API, persistence, notifications
├── utils/                # Shared utilities
└── dependecy-injections.ts # Composition root for DI
```

---

## 🛡️ Security & Reliability

- **Authentication**: operator login with role-based access.  
- **Authorization**: role enforcement for actions (only supervisors/admins can escalate or close incidents).  
- **Data protection**: sensitive client information is handled with care; communication channels are abstracted.  
- **Resilience**: board state persists even if an operator disconnects.  

---

## ⚙️ Getting Started

```bash
# install dependencies
npm install

# start development server
npm run develop

# build for production
npm run build

# serve production build
npm run serve
```

Environment variables define API endpoints for communication (chat, persistence, etc.).

---

## 🎯 Use Cases

This project demonstrates how scrum-like workflow concepts can be applied outside of software development to critical real-time operations like **emergency management**. It is suitable for:

- Roadside assistance companies  
- Emergency call centers  
- Logistics/dispatch teams  

---

## 👤 Author

This project is authored and maintained by **Nicolás Velah** as part of a professional portfolio.  
It demonstrates the ability to combine **React/Gatsby frontend development** with **workflow design**, **Clean Architecture**, and **real-time incident management**.

---

## 📜 License

This project is the intellectual property of **Nicolás Velah**.  
It may be used for **educational and reference purposes**.  
For **commercial use**, explicit permission from the author is required.

---

## 🤝 For Recruiters / Hiring Managers

This project showcases:

- Implementation of **workflow management systems** using a scrum-like model.  
- Application of **Clean Architecture** and **Dependency Injection** in frontend development.  
- Integration of **real-time communication channels** (chat, scripts, operator–client flows).  
- Design for **high-stakes environments** like emergency and roadside assistance.  

It highlights the capacity to deliver **scalable, mission-critical control systems** with professional software architecture practices.
