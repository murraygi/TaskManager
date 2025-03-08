import React from "react";
import Assignment from "@mui/icons-material/Assignment";

function Header() {
  return (
    <header>
        <div className="header-content">
        <Assignment className="logo-icon" fontSize="large" />
        <h1>Task Manager</h1>
        </div>
    </header>
  );
}

export default Header;