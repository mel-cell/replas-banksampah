import { useEffect } from "react";
import { useNavigate } from "react-router";
import Home from "../page/index";

export function meta() {
  return [
    { title: "Replas - recicle to e-money" },
    { name: "description", content: "Welcome to Replas!" },
  ];
}

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and redirect to appropriate dashboard
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;

        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/user');
        }
      } catch (error) {
        // Invalid token, stay on home page
        console.log('Invalid token, staying on home page');
      }
    }
  }, [navigate]);

  return <Home />;
}
