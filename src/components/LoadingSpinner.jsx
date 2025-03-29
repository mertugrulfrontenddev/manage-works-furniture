import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center flex-column"
      style={{
        height: "75vh", // Full height of the viewport
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Transparent white background with slight opacity
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "12px", // Rounded corners
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", // Subtle shadow
        animation: "fadeIn 1.5s ease-out", // Smooth fade-in animation
        overflow: "hidden", // Prevent overflow of elements
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.3))",
          zIndex: -1, // Ensure it's behind the spinner
          animation: "gradientAnimation 4s ease infinite", // Subtle gradient animation
        }}
      ></div>

      <img
        src="sembol_loading.gif"
        alt="Loading..."
        style={{
          width: "170px", // Smaller, more minimal size
          height: "170px",
          zIndex: 1000, // Ensure it appears above everything
          animation: "rotate 2s linear infinite", // Continuous rotation for the spinner
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
