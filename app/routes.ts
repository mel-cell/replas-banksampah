import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/app.tsx"),
  route("about", "routes/about.tsx"),
  route("services", "routes/services.tsx"),
  route("contact", "routes/contact.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  // route("dashboard/user", "routes/dashboard/user.tsx"),
  // route("dashboard/admin", "routes/dashboard/admin.tsx"),
] satisfies RouteConfig;
