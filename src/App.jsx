import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, DollarSign, Activity, Brain, Shield, Target, Zap } from 'lucide-react';

// Simulador de datos de mercado
const generateMarketData = () => {
  const symbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'GOLD', 'OIL', 'BTC/USD'];
  return symbols.map(symbol => ({
    symbol,
    price: (Math.random() * 100 + 50).toFixed(2),
    change: (Math.random() * 10 - 5).toFixed(2),
    volume: Math.floor(Math.random() * 1000000),
    trend: Math.random() > 0.5 ? 'up' : 'down'
  }));
};

// Agentes IA
const agents = [
  { 
    id: 'technical', 
    name: 'Agente Técnico', 
    icon: Activity,
    color: 'blue',
    description: 'Análisis de patrones y tendencias'
  },
  { 
    id: 'fundamental', 
    name: 'Agente Fundamental', 
    icon: Brain,
    color: 'purple',
    description: 'Evaluación de noticias y eventos'
  },
  { 
    id: 'risk', 
    name: 'Agente de Riesgo', 
    icon: Shield,
    color: 'red',
    description: 'Gestión de capital y exposición'
  },
  { 
    id: 'adaptive', 
    name: 'Agente Adaptativo', 
    icon: Zap,
    color: 'green',
    description: 'Optimización continua del sistema'
  }
];

function App() {
  const [marketData, setMarketData] = useState([]);
  const [trades, setTrades] = useState([]);
  const [balance, setBalance] = useState(1000000);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agentStatus, setAgentStatus] = useState({});

  // Simulación de datos en tiempo real
  useEffect(() => {
    const updateMarket = () => {
      setMarketData(generateMarketData());
      
      // Simular análisis de agentes
      const newStatus = {};
      agents.forEach(agent => {
        newStatus[agent.id] = {
          active: true,
          confidence: Math.floor(Math.random() * 40 + 60),
          lastUpdate: new Date().toLocaleTimeString()
        };
      });
      setAgentStatus(newStatus);

      // Simular operaciones ocasionales
      if (Math.random() > 0.9) {
        const data = generateMarketData();
        const randomSymbol = data[Math.floor(Math.random() * data.length)];
        const tradeType = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const probability = Math.floor(Math.random() * 20 + 80);
        const riskReward = (Math.random() * 2 + 1).toFixed(1);
        
        const newTrade = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          symbol: randomSymbol.symbol,
          type: tradeType,
          price: randomSymbol.price,
          probability: probability,
          riskReward: riskReward,
          status: 'ACTIVE',
          pnl: 0
        };
        
        setTrades(prev => [newTrade, ...prev.slice(0, 9)]);
      }
    };

    updateMarket();
    const interval = setInterval(updateMarket, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SENTINELA
                </h1>
                <p className="text-xs text-gray-400">Sistema Multi-Agente de Trading IA</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400">Capital Total</p>
                <p className="text-xl font-bold text-green-400">
                  ${balance.toLocaleString()}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {['dashboard', 'agents', 'trades', 'market'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Operaciones Activas</p>
                    <p className="text-2xl font-bold">{trades.filter(t => t.status === 'ACTIVE').length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Win Rate</p>
                    <p className="text-2xl font-bold text-green-400">85%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">PnL Hoy</p>
                    <p className="text-2xl font-bold text-green-400">+$12,450</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Riesgo Total</p>
                    <p className="text-2xl font-bold text-yellow-400">2.5%</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Agentes Status */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Estado de Agentes IA</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map(agent => {
                  const Icon = agent.icon;
                  const status = agentStatus[agent.id] || {};
                  return (
                    <div key={agent.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`bg-${agent.color}-500 bg-opacity-20 p-2 rounded`}>
                          <Icon className={`w-5 h-5 text-${agent.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{agent.name}</h3>
                          <p className="text-xs text-gray-400">{agent.description}</p>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Confianza:</span>
                        <span className="font-bold text-green-400">{status.confidence}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>Última actualización:</span>
                        <span>{status.lastUpdate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Operaciones Recientes</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Hora</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Símbolo</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Tipo</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Precio</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Prob.</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">R/R</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.slice(0, 5).map(trade => (
                      <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-3 px-4 text-sm">{trade.time}</td>
                        <td className="py-3 px-4 font-medium">{trade.symbol}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.type === 'BUY' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">${trade.price}</td>
                        <td className="py-3 px-4 text-green-400">{trade.probability}%</td>
                        <td className="py-3 px-4">1:{trade.riskReward}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500 bg-opacity-20 text-blue-400">
                            {trade.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Sistema Multi-Agente</h2>
            {agents.map(agent => {
              const Icon = agent.icon;
              const status = agentStatus[agent.id] || {};
              return (
                <div key={agent.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className={`bg-${agent.color}-500 bg-opacity-20 p-3 rounded-lg`}>
                      <Icon className={`w-8 h-8 text-${agent.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{agent.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-400">Activo</span>
                        </div>
                      </div>
                      <p className="text-gray-400 mb-4">{agent.description}</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Confianza</p>
                          <p className="text-lg font-bold text-green-400">{status.confidence}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Señales Hoy</p>
                          <p className="text-lg font-bold">{Math.floor(Math.random() * 20 + 10)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Precisión</p>
                          <p className="text-lg font-bold text-green-400">{Math.floor(Math.random() * 15 + 80)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === 'trades' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Historial de Operaciones</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Hora</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Símbolo</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Tipo</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Precio Entrada</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Probabilidad</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Risk/Reward</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Estado</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map(trade => (
                    <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4 text-sm">{trade.time}</td>
                      <td className="py-3 px-4 font-medium">{trade.symbol}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          trade.type === 'BUY' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">${trade.price}</td>
                      <td className="py-3 px-4 text-green-400 font-semibold">{trade.probability}%</td>
                      <td className="py-3 px-4">1:{trade.riskReward}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500 bg-opacity-20 text-blue-400">
                          {trade.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-green-400 font-bold">${trade.pnl.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Datos de Mercado en Tiempo Real</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketData.map(item => (
                <div key={item.symbol} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{item.symbol}</h3>
                    <TrendingUp className={`w-5 h-5 ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <p className="text-2xl font-bold mb-1">${item.price}</p>
                  <p className={`text-sm ${parseFloat(item.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {parseFloat(item.change) >= 0 ? '+' : ''}{item.change}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Vol: {item.volume.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>SENTINELA v1.0 | Sistema Multi-Agente de Trading con IA | © 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
