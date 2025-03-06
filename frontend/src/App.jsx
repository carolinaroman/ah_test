import React from "react";
import { createBrowserRouter, NavLink, RouterProvider } from "react-router-dom";

import Home from "@/pages/Home.jsx";
import WizardForm from "@/pages/WizardForm";

/**
 * A layout component providing a centered container with navigation
 * for all subpages. The nav bar uses NavLink, which automatically
 * adds an `active` class when the current page matches the route
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to be rendered inside the layout
 *
 * @returns {JSX.Element} A container div with navigation and children content
 */
const Layout = ({ children }) => (
  <div className="container mx-auto w-4/5 min-h-screen">
    <nav className="links flex gap-4 p-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-blue-600 hover:text-blue-800 font-medium ${
            isActive ? "underline underline-offset-4" : ""
          }`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/form"
        className={({ isActive }) =>
          `text-blue-600 hover:text-blue-800 font-medium ${
            isActive ? "underline underline-offset-4" : ""
          }`
        }
      >
        Wizard
      </NavLink>
    </nav>

    {children}
  </div>
);

const router = createBrowserRouter([
  // Welcome page: greeting text and start wizard
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  // Wizard: Onboarding
  {
    path: "/form/*",
    element: (
      <Layout>
        <WizardForm />
      </Layout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
