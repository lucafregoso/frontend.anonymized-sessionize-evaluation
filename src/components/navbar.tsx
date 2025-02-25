"use client";

import { useState, useEffect } from "react";

interface NavbarProps {
  message: string;
}

export default function Navbar({ message }: NavbarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {isMobile ? (
            <img
              src="img/logo-small.svg"
              alt="Codemotion Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          ) : (
            <>
              <img
                src="img/logo.svg"
                alt="Codemotion Logo"
                width={138}
                height={24}
                className="h-6 w-auto"
              />
            </>
          )}

          <div className="text-xs text-gray-600 text-right">{message}</div>
        </div>
      </div>
    </header>
  );
}
