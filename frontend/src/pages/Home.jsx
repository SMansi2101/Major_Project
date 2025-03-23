import React, { useRef } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Home = () => {
    const imgRef = useRef(null);

    // GSAP Floating Animation for Image
    useGSAP(() => {
        gsap.to(imgRef.current, {
            y: 20,
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "power1.inOut",
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-black text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="images/Logo.png" alt="Logo" className="h-10 mr-3" />
                    <span className="text-lg font-semibold">CareerExplorer</span>
                </div>
                {/* Admin Only Button - Navigates to /login */}
                <Link to="/admin-login">
                    <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-transform duration-300 hover:scale-105">
                        Admin Only
                    </button>
                </Link>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16 md:h-[60vh] space-y-8 md:space-y-0">
                {/* Left Side */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        Discover Your Future:
                    </h1>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        Explore Professional Fields
                    </h1>
                    <p className="text-gray-700 mt-4 text-sm md:text-lg">
                        Our platform empowers students to explore diverse career paths from an early age. 
                        With engaging quizzes and tailored resources, we help you uncover your passions 
                        and prepare for a successful future.
                    </p>
                    {/* Register Button - Navigates to /register */}
                    <Link to="/register">
                        <button className="mt-6 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-transform duration-300 hover:scale-105">
                            Register Now
                        </button>
                    </Link>
                </div>

                {/* Right Side (Animated Image) */}
                <div className="md:w-1/2 flex justify-center">
                    <img 
                        ref={imgRef} 
                        src="images/homeimg.png" 
                        alt="Home Illustration" 
                        className="h-72 md:h-96" // Floating Image
                    />
                </div>
            </div>

            {/* Three-Column Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 md:px-12 py-10">
                {[
                    { title: "Unlock Your Potential", text: "Register today to explore diverse career fields tailored for your interests.", button: "Join →", link: "/register" },
                    { title: "Take Quizzes", text: "Engage with quizzes that help you discover your strengths in various fields.", button: "Start →", link: "/register" },
                    { title: "Access Resources", text: "Gain access to essential materials that prepare you for your future career.", button: "Explore →", link: "/register" }
                ].map((item, index) => (
                    <div key={index} className="bg-white p-6 shadow-lg rounded-lg text-center">
                        <h2 className="text-lg md:text-xl font-semibold">{item.title}</h2>
                        <p className="text-gray-600 mt-2">{item.text}</p>
                        {/* Button with Link to the corresponding page */}
                        <Link to={item.link}>
                            <button className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-transform duration-300 hover:scale-105">
                                {item.button}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
