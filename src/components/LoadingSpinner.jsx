import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTZ4MWR5NWY2bDR4Zm5idjExdmVnaTU2c2pwcHV3dmw4dDJ2Nmk1eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/feN0YJbVs0fwA/giphy.gif"
        alt="Loading..."
        style={{ width: "200px", height: "200px" }}
      />
    </div>
  );
};

export default LoadingSpinner;
