import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, DollarSign, Activity, Brain, Shield, Target, Zap, Clock, BarChart3, Settings } from 'lucide-react';

const agents = [
  { id: 'technical', name: 'Agente Técnico', icon: Activity, color: 'bg-blue-600', status: 'ACTIVO', confidence: 92 },
  { id: 'fundamental', name: 'Agente Fundamental', icon: Brain, color: 'bg-purple-600', status: 'ACTIVO', confidence: 87 },
  { id: 'risk', name: 'Agente Riesgo', icon: Shield, color: 'bg-orange-600', status: 'ACTIVO', confidence: 94 },
  { id: 'adaptive', name: 'IA Adaptativa', icon: Zap, color: 'bg-green-600', status: 'EMERGIENDO', confidence: 89 }
];

const generateTrade = () => ({
  id: Date.now(),
  symbol: ['EUR/USD', 'GBP/USD', 'GOLD', 'OIL', 'BTC/USD'][Math.floor(Math.random() * 5)],
  type: Math.random() > 0.5 ? 'LONG' : 'SHORT',
  entry: (Math.random() * 100 + 50).toFixed(2),
  probability: Math.floor(Math.random() * 15 + 85),
  riskReward: (Math.random() * 2 + 2).toFixed(1),
  status: 'ACTIVA',
  time: new Date().toLocaleTimeString('es-CL')
});

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [balance, setBalance] = useState(1156420);
  const [todayProfit, setTodayProfit] = useState(156420);
  const [trades, setTrades] = useState([]);
  const [scanTime, setScanTime] = useState('08:00 AM');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [validatedOps, setValidatedOps] = useState(8);
  const [totalOps, setTotalOps] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      if (Math.random() > 0.7 && trades.length < 10) {
        setTrades(prev => [generateTrade(), ...prev].slice(0, 10));
        setValidatedOps(prev => Math.min(prev + 1, 10));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [trades.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 border-b border-red-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-red-600 to-orange-600 p-3 rounded-xl shadow-lg">
                <Target className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  SENTINELA
                </h1>
                <p className="text-sm text-gray-400 font-medium">Sistema de Trading Inteligente MACC</p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg">
              <Activity className="w-4 h-4" />
              Escanear Ahora
            </button>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Escaneo diario:</span>
              <span className="font-bold text-white">{scanTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Timeframes:</span>
              <span className="font-bold text-white">1H, 4H</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Máximo:</span>
              <span className="font-bold text-white">10 operaciones/día</span>
            </div>
          </div>
        </div>
      </header>

      {/* Agents Bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            {agents.map(agent => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} className={`${agent.color} rounded-lg p-4 shadow-lg`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-6 h-6" />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{agent.name}</h3>
                      <p className="text-xs opacity-90">Estado: {agent.status}</p>
                    </div>
                  </div>
                  <div className="text-xs opacity-75">Confianza: {agent.confidence}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Capital Actual</p>
              <p className="text-3xl font-bold text-green-400">${balance.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Ganancia Total</p>
              <p className="text-3xl font-bold text-green-400">+${todayProfit.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Win Rate</p>
              <p className="text-3xl font-bold text-blue-400">83.5%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Profit Factor</p>
              <p className="text-3xl font-bold text-purple-400">3.21</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            {[
              { id: 'dashboard', icon: Activity, label: 'Dashboard' },
              { id: 'operations', icon: TrendingUp, label: 'Operaciones Hoy' },
              { id: 'positions', icon: BarChart3, label: 'Posiciones' },
              { id: 'adaptive', icon: Zap, label: 'IA Adaptativa' },
              { id: 'config', icon: Settings, label: 'Configuración' }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 font-medium flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Mode Banner */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Activity className="w-5 h-5 text-green-400 animate-pulse" />
          <div className="flex-1">
            <p className="font-bold text-green-400">🟢 MODO SIMULACIÓN - Datos en Tiempo Real</p>
            <p className="text-sm text-gray-300">Las señales se actualizan cada 5 segundos simulando datos reales de 40%. Click en "Escanear Ahora" para ver los agentes en acción.</p>
          </div>
        </div>

        {/* Scan Status */}
        <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-lg p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Escaneo de Hoy Completado</h2>
              <p className="text-gray-300">Realizado a las {scanTime} • Última actualización: {lastUpdate.toLocaleTimeString('es-CL')}</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black text-yellow-400">{validatedOps}/{totalOps}</p>
              <p className="text-gray-300 text-sm mt-1">Operaciones validadas</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-orange-800">
            <div>
              <p className="text-gray-400 text-sm">Activos escaneados:</p>
              <p className="text-2xl font-bold">1247</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Rechazados:</p>
              <p className="text-2xl font-bold">1239</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Próximo escaneo:</p>
              <p className="text-2xl font-bold text-yellow-400">Mañana 08:00 AM</p>
            </div>
          </div>
        </div>

        {/* Trades Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold">Operaciones Validadas Hoy</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Símbolo</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Tipo</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Entrada</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Probabilidad</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">R/R</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Estado</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Hora</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, idx) => (
                  <tr key={trade.id} className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} hover:bg-gray-750`}>
                    <td className="py-4 px-6 font-bold text-lg">{trade.symbol}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-md text-sm font-bold ${
                        trade.type === 'LONG' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono">${trade.entry}</td>
                    <td className="py-4 px-6">
                      <span className="text-green-400 font-bold text-lg">{trade.probability}%</span>
                    </td>
                    <td className="py-4 px-6 font-bold">1:{trade.riskReward}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-md text-sm font-bold bg-blue-600">
                        {trade.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{trade.time}</td>
                  </tr>
                ))}
                {trades.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                      <p className="text-lg">Esperando señales del mercado...</p>
                      <p className="text-sm">Los agentes están analizando oportunidades</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
