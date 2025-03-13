import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthStore } from "../store/auth.store";
import { ProfileStore } from "../store/profile.store";

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { authUser } = AuthStore();
    const {myProfile } = ProfileStore();

    const {logout} = AuthStore();
    const handleLogout = () => {
        logout();
    }

  return (
    <nav className="bg-[#1E1E1E] text-white px-6 py-4 flex justify-between items-center shadow-lg cursor-pointer">
      {/* Left Side: Brand Name */}
      <Link className="text-2xl font-bold" to='/' >EduGenius</Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/coursespage" className="hover:text-gray-300">Courses</Link>
        {authUser ? (
          <>
            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
            {
              myProfile && myProfile.role === "Student" ? (
                <Link to="/uploadVideo" className="hover:text-gray-300">Upload</Link>
              ) : null
            }
            <Link onClick={handleLogout} className="hover:text-gray-300">Logout</Link>
          </>
        ) : (
          <>
            <Link to="/auth" className="hover:text-gray-300">Login</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 bg-[#1E1E1E] w-48 py-4 flex flex-col items-center space-y-4 shadow-lg md:hidden">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/coursespage" className="hover:text-gray-300">Courses</Link>
          {authUser ? (
            <>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              {
                myProfile && myProfile.role === "Student" ? (
                  <Link to="/uploadVideo" className="hover:text-gray-300">Upload</Link>
                ) : null
              }
              <Link onClick={handleLogout} className="hover:text-gray-300">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/auth" className="hover:text-gray-300">Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;