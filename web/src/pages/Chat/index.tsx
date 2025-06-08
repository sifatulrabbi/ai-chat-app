import React from "react";
import { Outlet } from "react-router";

export const ChatPage: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
