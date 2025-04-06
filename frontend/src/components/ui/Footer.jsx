import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-gray-200 text-gray-600 text-sm py-3 px-6 border-t shadow-inner">
      <div className="text-center">
        © {new Date().getFullYear()} Pixels. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
