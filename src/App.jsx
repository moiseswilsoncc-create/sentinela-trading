// ✅ App.jsx — versión simple que carga directamente el panel SENTINELA
import React from 'react';
import Sentinela from './components/Sentinela';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sentinela />
    </div>
  );
}

export default App;
