import React from 'react';

export default function Header({ username }: { username?: string }) {
  return (
    <>
      <header className="mxauto mt2 mb3">
        <img src="/assets/logo_white_350x84.png" alt="forket logo" width="200" className="block mxauto" />
        {username && <h1 className="mt1 tac">Hey, {username}!</h1>}
      </header>
    </>
  );
}