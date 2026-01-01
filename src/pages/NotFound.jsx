import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex items-center h-screen font-serif bg-white">
      <div className="container mx-auto">
        <div className="text-center">
          <div
            className=" h-100 bg-center bg-no-repeat flex items-center justify-center"
            style={{
              backgroundImage:
                "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
            }}
          >
            <p className="font-bold text-7xl top-25 position-absolute">404</p>
          </div>

          {/* Content box */}
          <div className="-mt-12 contant_box_404">
            <h3 className="text-2xl font-semibold">Look like you're lost</h3>
            <p className="text-gray-600">
              The page you are looking for is not available!
            </p>

            <Link
              to="/"
              className="inline-block px-3 py-2 m-5 text-white transition bg-[#9e1c20] rounded-md text-decoration-none link_404 hover:bg-[#a2383c]"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
