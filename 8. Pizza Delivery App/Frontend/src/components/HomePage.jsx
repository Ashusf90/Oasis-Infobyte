import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './shared/Navbar'; // Make sure this path is correct

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center text-white p-10 mt-20">
        <h1 className="text-6xl font-bold mb-4">
          Welcome to PizzaApp!
        </h1>
        <p className="text-2xl mb-8">
          Build your custom pizza, just the way you like it.
        </p>
        <Link to="/build-pizza" className="btn-primary">
          Start Building Your Pizza
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
