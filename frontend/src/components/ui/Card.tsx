import React from "react";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">{children}</div>
);

export default Card;
