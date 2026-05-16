import { Button } from "flowbite-react";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import FooterComponent from "./components/FooterComponent";
import OnlyAdminRoutes from "./components/OnlyAdminRoutes";
import PrivateRoutes from "./components/PrivateRoutes";        // 🔥 NEW
import AuthorRoutes from "./components/AuthorRoutes";          // 🔥 NEW
import CreatePost from "./pages/CreatePost";
import PostUpdate from "./pages/PostUpdate";
import Post from "./pages/Post";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import PostById from "./pages/PostId";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
<Route path="/terms" element={<Legal />} />
<Route path="/privacy" element={<Legal />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/search" element={<Search />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/post/:postSlug" element={<Post />} />
          <Route path="/post-id/:postId" element={<PostById />} />

          
          {/* 🔥 Private Routes - Sirf logged-in users (Dashboard) */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* 🔥 Author Routes - Author aur Admin (Create/Update Post) */}
          <Route element={<AuthorRoutes />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<PostUpdate />} />
          </Route>
          
          {/* 🔥 Admin Routes - Sirf Admin (Extra admin features) */}
          <Route element={<OnlyAdminRoutes />}>
            {/* Admin specific routes yahan add honge */}
          </Route>
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </>
  );
}

export default App;