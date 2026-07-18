# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

wedding-planner/
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── videos/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Services/
│   │   ├── Process/
│   │   ├── Portfolio/
│   │   ├── Packages/
│   │   ├── Testimonials/
│   │   ├── FAQ/
│   │   ├── Contact/
│   │   ├── Footer/
│   │   ├── Button/
│   │   ├── SectionTitle/
│   │   ├── Card/
│   │   └── Loader/
│   │
│   ├── context/
│   │   ├── WeddingContext.jsx
│   │   └── WeddingProvider.jsx
│   │
│   ├── data/
│   │   ├── services.js
│   │   ├── gallery.js
│   │   ├── testimonials.js
│   │   ├── packages.js
│   │   ├── faq.js
│   │   └── process.js
│   │
│   ├── hooks/
│   │   └── useWedding.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Gallery.jsx
│   │   ├── Services.jsx
│   │   ├── Packages.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── scrollToTop.js
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── animations.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── vite-env.d.ts (if using TypeScript)
│
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md"# crewaura" 
