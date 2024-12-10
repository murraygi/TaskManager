import React from "react";
import Assignment from "@mui/icons-material/Assignment";

function Header() {
  return (
    <header>
      <h1>
        <div className="header-content">
        <Assignment className="logo-icon" />
        Task Manager
        </div>
      </h1>
    </header>
  );
}

export default Header;