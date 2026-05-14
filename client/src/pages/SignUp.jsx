import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/v1/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
     
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/*Left Side Of Sign Up*/}
        <div className="flex-1">
          <Link to={"/"} className="font-bold dark:text-white text-4xl">
            <span className="px-1 py-1 bg-gradient-to-r from-green-500 via-teal-400 to-indigo-400 rounded-lg text-white">
              Hassan's
            </span>
            BLOG
          </Link>
          <p className=" mt-5 text-sm">
            This is a Hassan's Blog. You can sign up with email or password or
            with google.
          </p>
        </div>
        {/*On the right side of sign up */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                placeholder="Password"
                type="password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone={"greenToBlue"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Loading ...</span>
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            <OAuth/>
            <div className="flex gap-2 text-sm mt-4">
              <span>Have an account?</span>
              <Link to={"/sign-in"} className="text-blue-500">
                Sign in
              </Link>
            </div>
            {errorMessage && (
              <>
                <Alert className="mt-5" color={"failure"}>
                  {errorMessage}
                </Alert>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
