import React from "react";

function MWDropdown({ onSelect }) {
  return (
    <div className="dropdown">
      <button onClick={() => onSelect("before")}>Insert Before</button>
      <button onClick={() => onSelect("after")}>Insert After</button>
    </div>
  );
}

export default MWDropdown;