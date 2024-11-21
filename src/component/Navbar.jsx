import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Importing ToastContainer and toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("loggedInUser");

  const handleLogout = () => {
    setLoading(true); // Show loading state

    setTimeout(() => {
      // Simulate logout process
      localStorage.removeItem("loggedInUser"); // Remove user from localStorage

      // Show success toast
      toast.success("Logged out successfully!");

      // Navigate to login page after a delay
      navigate("/Login");
      setLoading(false); // Hide loading state
    }, 2000); // Simulate a 2-second delay for logging out
  };

  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <AcmeLogo />
            <p className="font-bold text-inherit">To-Do-List</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <NavLink color="foreground" to="/">
              Home
            </NavLink>
          </NavbarItem>
          {!isLoggedIn && (
            <>
              <NavbarItem>
                <NavLink to="/Login" aria-current="page">
                  Login
                </NavLink>
              </NavbarItem>
              <NavbarItem>
                <NavLink color="foreground" to="/Registration">
                  Registration
                </NavLink>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        <NavbarContent justify="end">
          {isLoggedIn && (
            <NavbarItem>
              <NavLink
                to='/Login'
                color="primary"
                variant="flat"
                onClick={handleLogout}
                disabled={loading} 
              >
                {loading ? "Logging out..." : "Log Out"}
              </NavLink>
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"}
                className="w-full"
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      {/* ToastContainer to render toast notifications */}
      <ToastContainer />
    </>
  );
}
