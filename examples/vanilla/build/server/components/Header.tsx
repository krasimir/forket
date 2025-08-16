"use client";

import React from "react";

export default function Header({ username, logout }: { username?: string; logout: Function }) {
  return (
    <>
      <header className="mxauto mt2 mb3">
        <img src="/assets/logo_white_350x84.png" alt="forket logo" width="200" className="block mxauto" />
        {username && (
          <span className="block abs tar p05 op05" style={{ top: 0, right: "90px" }}>
            Hey, {username}!
          </span>
        )}
        {username && (
          <button
            className="reset abs"
            onClick={async () => {
              if (await logout()) {
                window.location.reload();
              }
            }}
            style={{ top: 0, right: 0 }}
          >
            ✖ logout
          </button>
        )}
      </header>
    </>
  );
}
