
# ✨ Simple CRM Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/react-^19.2.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-^5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind%20css-^3.3.0-cyan.svg)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-doodax.com-success?style=for-the-badge)](https://doodax.com)

A professional, high-performance Customer Relationship Management (CRM) dashboard designed for freelancers and small businesses. This application prioritizes data privacy through a **Local-First** architecture, ensuring all sensitive client data remains securely within the user's browser via Local Storage.

---

## 🚀 Live Demo

Experience the full application live:  
👉 **[doodax.com](https://doodax.com/tools/simple-crm-dashboard/index.html)** (Opens in a new tab)

---

## 🌟 Key Features

*   **Privacy-Centric Architecture**: Zero backend dependency. All data is persisted securely in the browser's Local Storage.
*   **Cosmic UI/UX**: Immersive, animated nebula background with glassmorphism design principles for a modern feel.
*   **Complete Contact Management**: Create, Read, Update, and Delete (CRUD) contacts with ease.
*   **Task Tracking**: Integrated task manager for every contact to keep projects moving forward.
*   **Data Portability**: robust Excel (`.xlsx`) Import and Export capabilities.
*   **SEO Optimized**: Fully compliant with modern SEO standards, including JSON-LD Schema and meta tags.
*   **Responsive Design**: Flawless experience on Desktops, Tablets, and Mobile devices.

## 📂 Project Structure

```bash
simple-crm-dashboard/
├── index.html              # Entry point with SEO metadata & Schema
├── index.tsx               # React application entry
├── App.tsx                 # Main layout wrapper
├── components/
│   ├── ThemeLayout.tsx     # Animated background, footer, and modal logic
│   └── CRMTool.tsx         # Core CRM functionality and UI components
├── utils/
│   ├── LocalStorageManager.ts # Helper for type-safe local storage access
│   └── SeoArticle.tsx      # SEO content component
├── public/                 # Static assets (implicitly served from root)
│   ├── robots.txt          # Crawler directives
│   ├── sitemap.xml         # Site structure
│   └── favicon.svg         # App icon
└── README.md               # Documentation
```

## 🛠️ Technology Stack

*   **Frontend Library**: React 19 (Hooks, Functional Components)
*   **Language**: TypeScript (Strict type checking)
*   **Styling**: Tailwind CSS (Utility-first framework)
*   **Data Handling**: SheetJS (xlsx) for spreadsheet operations
*   **Animation**: CSS3 Keyframes & Transitions

## 🏁 Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hsinidev/simple-crm-dashboard.git
    cd simple-crm-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact & Credits

**HSINI MOHAMED**

*   **Website:** [doodax.com](https://doodax.com)
*   **Email:** [hsini.web@gmail.com](mailto:hsini.web@gmail.com)
*   **GitHub:** [@hsinidev](https://github.com/hsinidev)

---
*Powered by HSINI MOHAMED*
