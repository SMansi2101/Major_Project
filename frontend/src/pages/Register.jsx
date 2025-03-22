import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {

  const imgRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [standard, setStandard] = useState('');

  const navigate = useNavigate();

  const SubmitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      fullname: { firstname: firstName, lastname: lastName },
      standard,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, userData);

      navigate("/dashboard");
    } catch (error) {
      console.error("Registration Failed:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        y: -20,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0D0D0D]">
      {/* Left Side: Floating Image (Hidden on small screens) */}
      <div className="hidden md:flex md:w-2/5 bg-[#1C1C1E] items-center justify-center relative">
        <img
          ref={imgRef}
          src="images/registerimg.png"
          alt="Register"
          className="w-[80%] drop-shadow-xl"
        />
      </div>

      {/* Right Side: Form Section */}
      <div className="w-full md:w-3/5 flex flex-col items-center justify-center px-6 md:px-12 py-8">
        {/* Logo and Title */}
        <div className="flex items-center mb-6">
          <img src="images/Logo.png" alt="Logo" className="h-10 mr-3" />
          <span className="text-2xl font-semibold text-white">CareerExplorer</span>
        </div>

        {/* Registration Form */}
        <form className="w-full max-w-md bg-[#1C1C1E] p-6 rounded-lg shadow-lg" onSubmit={SubmitHandler}>
          <div className="mb-4">
            <label className="text-gray-300 block mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full p-3 rounded-md bg-[#2A2A2E] text-white focus:outline-none focus:ring-2 focus:ring-red-900"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-300 block mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full p-3 rounded-md bg-[#2A2A2E] text-white focus:outline-none focus:ring-2 focus:ring-red-900"
            />
          </div>

          <div className="mb-6">
            <label className="text-gray-300 block mb-1">Standard</label>
            <input
              type="number"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              placeholder="Your grade/class"
              className="w-full p-3 rounded-md bg-[#2A2A2E] text-white focus:outline-none focus:ring-2 focus:ring-red-900"
              required
            />
          </div>

          {/* Register Button */}
          <button type="submit" className="w-full py-3 bg-red-700 text-white font-bold rounded-md hover:bg-red-800 transition-all duration-300">
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
