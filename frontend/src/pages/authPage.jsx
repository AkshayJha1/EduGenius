import { useState } from "react";
import { AuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

const AuthPage = () => {
  
  const [isSignup, setIsSignup] = useState(false); // true = signup, false = login

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [signupFormData, setSignupFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { login, signup, isSigningIn, isLoggingIn } = AuthStore();

  const handleAuth = (e) => {
    e.preventDefault(); // Prevents page reload

    if (isSignup) {
      signup(signupFormData);
      setSignupFormData({
        fullName: "",
        email: "",
        password: "",
      })
    } else {
      login(loginFormData);
      setLoginFormData({
        email: "",
        password: "",
      })
    }
  };

  return (
    <div className="hero min-h-screen flex items-center justify-center bg-[#1E1E1E] text-white">
      <div
        className={`hero-content flex-col transition-all duration-500 ${
          isSignup ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        {/* Left Side - Login/Signup Form */}
        <div className="card bg-[#2C2C2C] w-full max-w-sm shadow-lg p-6 rounded-lg">
          <form className="card-body" onSubmit={handleAuth}>
            {/* Name Field (Only for Signup) */}
            {isSignup && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="input input-bordered bg-[#3C3C3C] text-white"
                  required
                  value={signupFormData.fullName}
                  onChange={(e) =>
                    setSignupFormData({ ...signupFormData, fullName: e.target.value })
                  }
                />
              </div>
            )}

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered bg-[#3C3C3C] text-white"
                required
                value={isSignup ? signupFormData.email : loginFormData.email}
                onChange={(e) =>
                  isSignup
                    ? setSignupFormData({ ...signupFormData, email: e.target.value })
                    : setLoginFormData({ ...loginFormData, email: e.target.value })
                }
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered bg-[#3C3C3C] text-white"
                required
                value={isSignup ? signupFormData.password : loginFormData.password}
                onChange={(e) =>
                  isSignup
                    ? setSignupFormData({ ...signupFormData, password: e.target.value })
                    : setLoginFormData({ ...loginFormData, password: e.target.value })
                }
              />
              {!isSignup && (
                <label className="label">
                  <a href="#" className="label-text-alt text-blue-400 hover:underline">
                    Forgot password?
                  </a>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" onClick={handleAuth} className="btn bg-blue-600 hover:bg-blue-700 text-white w-full">
                {isSignup ? "Sign Up" : "Login"}
              </button>
            </div>

            {/* Toggle Login/Signup */}
            <p className="text-center mt-4">
              {isSignup ? (
                <span>
                  Already a user?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(false)}
                    className="text-blue-400 font-semibold underline"
                  >
                    Login
                  </button>
                </span>
              ) : (
                <span>
                  New user?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className="text-blue-400 font-semibold underline"
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </p>
          </form>
        </div>

        {/* Right Side - Dynamic Heading and Description */}
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-5xl font-bold text-white">
            {isSignup ? "Sign Up Now!" : "Login Now!"}
          </h1>
          <p className="py-6 text-gray-400">
            {isSignup
              ? "Join us today and start your journey with amazing features."
              : "Welcome back! Log in to continue your experience with us."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
