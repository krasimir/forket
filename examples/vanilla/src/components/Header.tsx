"use client";

import React from "react";

export default function Header({ username, logout }: { username?: string; logout: Function }) {
  return (
    <>
      <header className="mxauto mt2 mb3">
        <img src="/assets/logo_white_350x84.png" alt="forket logo" width="200" className="block mxauto" />
        {username && <h1 className="mt1 tac">Hey, {username}!</h1>}
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
