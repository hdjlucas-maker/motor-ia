import React from 'react';

const Auth = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Motor IA</h1>
      <p>Faça login para continuar</p>
      <button className="btn btn-primary" style={{ marginTop: 20 }}>Entrar com Google</button>
    </div>
  );
};

export default Auth;
