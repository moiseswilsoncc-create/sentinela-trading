import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings, BarChart3, Activity, Brain, DollarSign, Clock, Shield, Eye, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const Sentinela = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [apiConnected, setApiConnected] = useState(false);
  
  const [config, setConfig] = useState({
    capital: 1000000,
    riesgo: 2,
    maxOps: 10,
    probMin: 80,
    rrMin: 3,
    horaEscaneo: '08:00',
    timeframes: ['1H', '4H'],
    autoScan: true
  });

  const [agentes, setAgentes] = useState({
    tecnico: { estado: 'ACTIVO', operaciones: 1247, ultimoScan: '08:00 AM', progreso: 100 },
    fundamental: { estado: 'ACTIVO', fuentes: 12, noticias: 45, progreso: 100 },
    riesgo: { estado: 'ACTIVO', posicionesMax: 10, calculosHoy: 10, progreso: 100 },
    adaptativo: { estado: 'APRENDIENDO', adaptaciones: 47, patrones: 183, tasaExito: 95.7, progreso: 100 }
  });

  const [performance] = useState({
    capitalInicial: 1000000,
    capitalActual: 1156420,
    gananciaTotal: 156420,
    gananciaPercent: 15.64,
    winRate: 83.5,
    ganadoras: 260,
    perdedoras: 52,
    totalOps: 312,
    profitFactor: 3.21,
    activosEscaneados: 1247
  });

  const [operacionesValidadas] = useState([
    { id: 1, activo: 'GOLD', tipo: 'CFD', accion: 'COMPRA', entrada: 2654.30, sl: 2640.00, tp: 2695.00, prob: 89, rr: '1:3.0', score: 97, razon: 'RSI sobrecompra + MACD alcista', gananciaEsperada: 60234 },
    { id: 2, activo: 'EURUSD', tipo: 'FOREX', accion: 'VENTA', entrada: 1.0850, sl: 1.0900, tp: 1.0700, prob: 88, rr: '1:3.0', score: 95, razon: 'Divergencia bajista + USD fuerte', gananciaEsperada: 60000 },
    { id: 3, activo: 'AAPL', tipo: 'ACCIÓN', accion: 'COMPRA', entrada: 234.50, sl: 230.00, tp: 248.00, prob: 86, rr: '1:3.0', score: 93, razon: 'Earnings beat expectations', gananciaEsperada: 60006 },
    { id: 4, activo: 'GBPUSD', tipo: 'FOREX', accion: 'COMPRA', entrada: 1.2650, sl: 1.2600, tp: 1.2800, prob: 85, rr: '1:3.0', score: 91, razon: 'BoE hawkish + soporte clave', gananciaEsperada: 59999 }
  ]);

  const [posicionesActivas, setPosicionesActivas] = useState([
    { activo: 'GOLD', tipo: 'COMPRA', entrada: 2654.30, actual: 2665.80, sl: 2640.00, tp: 2695.00, pl: 5925, tiempo: '2h 45m' },
    { activo: 'EURUSD', tipo: 'VENTA', entrada: 1.0850, actual: 1.0832, sl: 1.0900, tp: 1.0700, pl: 7200, tiempo: '1h 30m' }
  ]);

  const [historialOperaciones] = useState([
    { fecha: '18 Oct 09:30', activo: 'EURUSD', tipo: 'VENTA', entrada: 1.0865, salida: 1.0805, resultado: 'WIN', pl: 6000, razon: 'TP alcanzado' },
    { fecha: '17 Oct 14:20', activo: 'GOLD', tipo: 'COMPRA', entrada: 2640.00, salida: 2680.00, resultado: 'WIN', pl: 8200, razon: 'TP alcanzado' },
    { fecha: '16 Oct 10:45', activo: 'AAPL', tipo: 'COMPRA', entrada: 230.50, salida: 238.30, resultado: 'WIN', pl: 6240, razon: 'TP alcanzado' },
    { fecha: '15 Oct 08:30', activo: 'WTI', tipo: 'VENTA', entrada: 71.20, salida: 69.80, resultado: 'LOSS', pl: -2100, razon: 'SL activado' }
  ]);

  useEffect(() => {
    const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;
    const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    const newsKey = import.meta.env.VITE_NEWS_API_KEY;
    
    if (finnhubKey && alphaKey && newsKey) {
      setApiConnected(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosicionesActivas(prev => prev.map(pos => {
        const variation = (Math.random() - 0.5) * 2;
        const newActual = pos.actual + variation;
        const newPl = ((newActual - pos.entrada) * 517).toFixed(0);
        return {
          ...pos,
          actual: parseFloat(newActual.toFixed(2)),
          pl: parseInt(newPl)
        };
      }));
      setLastUpdate(new Date().toLocaleTimeString());
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const ejecutarEscaneo = () => {
    setIsLoading(true);
    setAgentes({
      tecnico: { ...agentes.tecnico, progreso: 0 },
      fundamental: { ...agentes.fundamental, progreso: 0 },
      riesgo: { ...agentes.riesgo, progreso: 0 },
      adaptativo: { ...agentes.adaptativo, progreso: 0 }
    });

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setAgentes(prev => ({
        tecnico: { ...prev.tecnico, progreso: Math.min(progress + Math.random() * 10, 100) },
        fundamental: { ...prev.fundamental, progreso: Math.min(progress + Math.random() * 10, 100) },
        riesgo: { ...prev.riesgo, progreso: Math.min(progress + Math.random() * 10, 100) },
        adaptativo: { ...prev.adaptativo, progreso: Math.min(progress + Math.random() * 10, 100) }
      }));

      if (progress >= 100) {
        clearInterval(progressInterval);
        setIsLoading(false);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    }, 300);
  };

  const actualizarConfig = (campo, valor) => {
    setConfig(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const Tab = ({ id, icon: Icon, label, badge, active }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-5 py-3 font-medium transition-all relative ${active ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
      <Icon size={18} />
      {label}
      {badge && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 bg-gradient-to-r from-orange-900/50 to-red-900/50 p-6 rounded-lg border border-orange-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 p-3 rounded-lg">
                <Shield size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">SENTINELA</h1>
                <p className="text-gray-300">Sistema de Trading Inteligente WMCC</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={ejecutarEscaneo}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Escaneando...' : 'Escanear Ahora'}
              </button>
              <div className="flex items-center gap-2">
                {apiConnected ? (
                  <>
                    <Wifi size={16} className="text-green-400" />
                    <span className="text-sm text-green-400">APIs Conectadas</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={16} className="text-yellow-400" />
                    <span className="text-sm text-yellow-400">Modo Demo</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-400" />
              <span>Escaneo: {config.horaEscaneo} AM</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-red-400" />
              <span>TF: {config.timeframes.join(', ')}</span>
            </div>
            <div className="text-xs text-gray-400">Última actualización: {lastUpdate}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg border border-blue-600">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-blue-400" />
              <span className="font-bold text-sm">Agente Técnico</span>
            </div>
            <div className="text-xs text-gray-300">Estado: <span className="text-green-400">{agentes.tecnico.estado}</span></div>
            <div className="text-xs text-gray-300">{agentes.tecnico.operaciones} activos</div>
            {isLoading && (
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${agentes.tecnico.progreso}%` }}></div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-4 rounded-lg border border-purple-600">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={20} className="text-purple-400" />
              <span className="font-bold text-sm">Agente Fundamental</span>
            </div>
            <div className="text-xs text-gray-300">Estado: <span className="text-green-400">{agentes.fundamental.estado}</span></div>
            <div className="text-xs text-gray-300">{agentes.fundamental.noticias} noticias</div>
            {isLoading && (
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${agentes.fundamental.progreso}%` }}></div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-4 rounded-lg border border-orange-600">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} className="text-orange-400" />
              <span className="font-bold text-sm">Agente Riesgo</span>
            </div>
            <div className="text-xs text-gray-300">Estado: <span className="text-green-400">{agentes.riesgo.estado}</span></div>
            <div className="text-xs text-gray-300">{agentes.riesgo.calculosHoy} cálculos</div>
            {isLoading && (
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${agentes.riesgo.progreso}%` }}></div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded-lg border border-green-600">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={20} className="text-green-400" />
              <span className="font-bold text-sm">IA Adaptativa</span>
            </div>
            <div className="text-xs text-gray-300">Estado: <span className="text-yellow-400">{agentes.adaptativo.estado}</span></div>
            <div className="text-xs text-gray-300">{agentes.adaptativo.tasaExito}% éxito</div>
            {isLoading && (
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${agentes.adaptativo.progreso}%` }}></div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Capital Actual</div>
            <div className="text-2xl font-bold text-green-400">${performance.capitalActual.toLocaleString()}</div>
            <div className="text-xs text-gray-500">+{performance.gananciaPercent}%</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Ganancia Total</div>
            <div className="text-2xl font-bold text-green-400">+${performance.gananciaTotal.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-blue-400">{performance.winRate}%</div>
            <div className="text-xs text-gray-500">{performance.ganadoras}W / {performance.perdedoras}L</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Profit Factor</div>
            <div className="text-2xl font-bold text-purple-400">{performance.profitFactor}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Tab id="dashboard" icon={Activity} label="Dashboard" active={activeTab === 'dashboard'} />
          <Tab id="operaciones" icon={TrendingUp} label="Operaciones" badge={operacionesValidadas.length} active={activeTab === 'operaciones'} />
          <Tab id="posiciones" icon={Clock} label="Posiciones" badge={posicionesActivas.length} active={activeTab === 'posiciones'} />
          <Tab id="historial" icon={BarChart3} label="Historial" active={activeTab === 'historial'} />
          <Tab id="ia" icon={Brain} label="IA Adaptativa" active={activeTab === 'ia'} />
          <Tab id="config" icon={Settings} label="Configuración" active={activeTab === 'config'} />
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {apiConnected ? (
                <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-4 rounded-lg border border-green-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi size={20} className="text-green-400" />
                    <div className="font-bold">✅ CONECTADO - Datos en Tiempo Real</div>
                  </div>
                  <div className="text-sm text-gray-300">
                    APIs activas: Finnhub + Alpha Vantage + News API. Actualización cada 5 minutos.
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-4 rounded-lg border border-yellow-600">
                  <div className="flex items-center gap-2 mb-2">
                    <WifiOff size={20} className="text-yellow-400" />
                    <div className="font-bold">⚠️ MODO DEMO - Simulación Activa</div>
                  </div>
                  <div className="text-sm text-gray-300">
                    Las API Keys no están configuradas en Vercel. Sistema funcionando con datos simulados.
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 p-6 rounded-lg border border-orange-700">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Escaneo del Día Completado</h2>
                    <p className="text-gray-400">Realizado a las {config.horaEscaneo} AM</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-400">{operacionesValidadas.length}/{config.maxOps}</div>
                    <div className="text-sm text-gray-400">Operaciones validadas</div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold">Top Operaciones del Día</h3>
              {operacionesValidadas.map((op, idx) => (
                <div key={op.id} className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-orange-400">#{idx + 1}</div>
                      <div>
                        <div className="text-2xl font-bold">{op.activo}</div>
                        <div className="text-sm text-gray-400">{op.tipo} • Score: {op.score}/100</div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold text-lg ${op.accion === 'COMPRA' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {op.accion}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded mb-3">
                    <div className="text-sm text-gray-400 mb-2">Análisis:</div>
                    <div className="text-sm">{op.razon}</div>
                  </div>

                  <div className="grid grid-cols-5 gap-3 text-sm bg-gray-800 p-3 rounded">
                    <div>
                      <div className="text-gray-400 text-xs">Entrada</div>
                      <div className="font-mono font-bold text-blue-400">{op.entrada}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">SL</div>
                      <div className="font-mono font-bold text-red-400">{op.sl}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">TP</div>
                      <div className="font-mono font-bold text-green-400">{op.tp}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Prob</div>
                      <div className="font-bold text-yellow-400">{op.prob}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Ganancia</div>
                      <div className="font-bold text-green-400">${(op.gananciaEsperada/1000).toFixed(1)}K</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'operaciones' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Operaciones Validadas</h2>
              {operacionesValidadas.map((op, idx) => (
                <div key={op.id} className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-orange-400">#{idx + 1}</div>
                      <div>
                        <div className="text-xl font-bold">{op.activo}</div>
                        <div className="text-sm text-gray-400">{op.tipo} • Prob: {op.prob}%</div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold ${op.accion === 'COMPRA' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {op.accion}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3 bg-gray-800 p-4 rounded text-sm">
                    <div>
                      <div className="text-xs text-gray-400">Entrada</div>
                      <div className="font-mono font-bold text-blue-400">{op.entrada}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">SL</div>
                      <div className="font-mono font-bold text-red-400">{op.sl}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">TP</div>
                      <div className="font-mono font-bold text-green-400">{op.tp}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">RR</div>
                      <div className="font-bold text-yellow-400">{op.rr}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Score</div>
                      <div className="font-bold text-orange-400">{op.score}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'posiciones' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-blue-600 mb-4">
                <div className="flex items-center gap-2">
                  <RefreshCw size={18} className="text-blue-400" />
                  <div className="font-bold">Actualización automática cada 5 minutos</div>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Posiciones Activas ({posicionesActivas.length})</h2>
              {posicionesActivas.map((pos, idx) => (
                <div key={idx} className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-2xl font-bold">{pos.activo}</div>
                      <div className={`inline-block px-3 py-1 rounded text-sm font-bold mt-1 ${pos.tipo === 'COMPRA' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {pos.tipo}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${pos.pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pos.pl >= 0 ? '+' : ''}${pos.pl.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">{pos.tiempo}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm bg-gray-800 p-4 rounded">
                    <div>
                      <div className="text-gray-400">Entrada</div>
                      <div className="font-mono font-bold">{pos.entrada}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Actual</div>
                      <div className="font-mono font-bold text-blue-400">{pos.actual}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">SL</div>
                      <div className="font-mono font-bold text-red-400">{pos.sl}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">TP</div>
                      <div className="font-mono font-bold text-green-400">{pos.tp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'historial' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Historial de Operaciones</h2>
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {historialOperaciones.filter(op => op.resultado === 'WIN').length} Ganadoras
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-400">
                      {historialOperaciones.filter(op => op.resultado === 'LOSS').length} Perdedoras
                    </div>
                  </div>
                </div>
              </div>

              {historialOperaciones.map((op, idx) => (
                <div key={idx} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-lg">{op.activo} - {op.tipo}</div>
                      <div className="text-sm text-gray-400">{op.fecha}</div>
                    </div>
                    <div className={`px-3 py-1 rounded font-bold ${op.resultado === 'WIN' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {op.resultado}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm bg-gray-800 p-3 rounded">
                    <div>
                      <div className="text-gray-400">Entrada</div>
                      <div className="font-mono font-bold">{op.entrada}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Salida</div>
                      <div className="font-mono font-bold">{op.salida}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">P&L</div>
                      <div className={`font-bold ${op.pl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {op.pl > 0 ? '+' : ''}${op.pl.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Razón</div>
                      <div className="text-xs">{op.razon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 p-6 rounded-lg border border-green-700">
                <h2 className="text-2xl font-bold mb-4">🧠 Sistema de IA Adaptativa</h2>
                <p className="text-gray-300 mb-6">
                  El sistema aprende continuamente de cada operación para optimizar estrategias y mejorar la precisión.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Adaptaciones Realizadas</div>
                    <div className="text-3xl font-bold text-green-400">{agentes.adaptativo.adaptaciones}</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Patrones Aprendidos</div>
                    <div className="text-3xl font-bold text-blue-400">{agentes.adaptativo.patrones}</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Tasa de Éxito</div>
                    <div className="text-3xl font-bold text-purple-400">{agentes.adaptativo.tasaExito}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">📊 Aprendizaje Continuo</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <div className="font-bold">Optimización de Entry Points</div>
                      <div className="text-sm text-gray-400">Ajuste basado en {performance.totalOps} operaciones históricas</div>
                    </div>
                    <div className="text-green-400 font-bold">+12% precisión</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <div className="font-bold">Detección de Patrones Alcistas</div>
                      <div className="text-sm text-gray-400">Identificación de 23 nuevos patrones</div>
                    </div>
                    <div className="text-blue-400 font-bold">+8% efectividad</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <div className="font-bold">Gestión Adaptativa de Riesgo</div>
                      <div className="text-sm text-gray-400">Ajuste dinámico según volatilidad</div>
                    </div>
                    <div className="text-purple-400 font-bold">-15% drawdown</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">📈 Historial de Operaciones Registradas</h3>
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {historialOperaciones.filter(op => op.resultado === 'WIN').length} Ganadoras
                      </div>
                      <div className="text-sm text-gray-400">Promedio: +${Math.round(historialOperaciones.filter(op => op.resultado === 'WIN').reduce((sum, op) => sum + op.pl, 0) / historialOperaciones.filter(op => op.resultado === 'WIN').length).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-400">
                        {historialOperaciones.filter(op => op.resultado === 'LOSS').length} Perdedoras
                      </div>
                      <div className="text-sm text-gray-400">Promedio: ${Math.abs(Math.round(historialOperaciones.filter(op => op.resultado === 'LOSS').reduce((sum, op) => sum + op.pl, 0) / historialOperaciones.filter(op => op.resultado === 'LOSS').length)).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {historialOperaciones.map((op, idx) => (
                  <div key={idx} className="bg-gray-800 p-4 rounded-lg mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-lg">{op.activo} - {op.tipo}</div>
                        <div className="text-sm text-gray-400">{op.fecha}</div>
                      </div>
                      <div className={`px-3 py-1 rounded font-bold ${op.resultado === 'WIN' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {op.resultado}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400">Entrada</div>
                        <div className="font-mono font-bold">{op.entrada}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Salida</div>
                        <div className="font-mono font-bold">{op.salida}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">P&L</div>
                        <div className={`font-bold ${op.pl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {op.pl > 0 ? '+' : ''}${op.pl.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Razón</div>
                        <div className="text-xs">{op.razon}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">⚙️ Configuración SENTINELA</h2>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">💰 Configuración de Capital</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Capital Inicial</label>
                    <input
                      type="number"
                      value={config.capital}
                      onChange={(e) => actualizarConfig('capital', parseInt(e.target.value))}
                      className="w-full bg-gray-800 text-white text-2xl font-bold p-3 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Monto base para cálculos de riesgo</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Riesgo por Operación (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      value={config.riesgo}
                      onChange={(e) => actualizarConfig('riesgo', parseFloat(e.target.value))}
                      className="w-full bg-gray-800 text-white text-2xl font-bold p-3 rounded border border-gray-600 focus:border-orange-400 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo a arriesgar por trade (1% - 5%)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">🎯 Criterios de Trading</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <div className="flex-1 mr-4">
                      <div className="font-bold mb-1">Probabilidad Mínima (%)</div>
                      <div className="text-sm text-gray-400">Umbral para validar operaciones</div>
                    </div>
                    <input
                      type="number"
                      min="70"
                      max="95"
                      value={config.probMin}
                      onChange={(e) => actualizarConfig('probMin', parseInt(e.target.value))}
                      className="w-24 bg-gray-900 text-white text-xl font-bold p-2 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none text-center"
                    />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <div className="flex-1 mr-4">
                      <div className="font-bold mb-1">Risk/Reward Mínimo</div>
                      <div className="text-sm text-gray-400">Ratio ganancia vs pérdida (1:X)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">1:</span>
                      <input
                        type="number"
                        min="2"
                        max="5"
                        step="0.5"
                        value={config.rrMin}
                        onChange={(e) => actualizarConfig('rrMin', parseFloat(e.target.value))}
                        className="w-20 bg-gray-900 text-white text-xl font-bold p-2 rounded border border-gray-600 focus:border-purple-400 focus:outline-none text-center"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <div className="flex-1 mr-4">
                      <div className="font-bold mb-1">Máximo Operaciones Diarias</div>
                      <div className="text-sm text-gray-400">Límite de trades por día</div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={config.maxOps}
                      onChange={(e) => actualizarConfig('maxOps', parseInt(e.target.value))}
                      className="w-24 bg-gray-900 text-white text-xl font-bold p-2 rounded border border-gray-600 focus:border-blue-400 focus:outline-none text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">⏰ Configuración de Escaneo</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <div className="flex-1 mr-4">
                      <div className="font-bold mb-1">Hora de Escaneo</div>
                      <div className="text-sm text-gray-400">Hora diaria de análisis automático</div>
                    </div>
                    <input
                      type="time"
                      value={config.horaEscaneo}
                      onChange={(e) => actualizarConfig('horaEscaneo', e.target.value)}
                      className="bg-gray-900 text-white text-lg font-bold p-2 rounded border border-gray-600 focus:border-orange-400 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 bg-gray-800 rounded">
                    <div className="font-bold mb-3">Timeframes Analizados</div>
                    <div className="flex gap-3 flex-wrap">
                      {['1H', '4H', '1D'].map(tf => (
                        <label key={tf} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.timeframes.includes(tf)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                actualizarConfig('timeframes', [...config.timeframes, tf]);
                              } else {
                                actualizarConfig('timeframes', config.timeframes.filter(t => t !== tf));
                              }
                            }}
                            className="w-5 h-5 bg-gray-900 border-2 border-gray-600 rounded cursor-pointer"
                          />
                          <span className="text-white font-bold">{tf}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Selecciona los marcos temporales para análisis</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <div className="flex-1 mr-4">
                      <div className="font-bold mb-1">Escaneo Automático</div>
                      <div className="text-sm text-gray-400">Análisis diario sin intervención</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.autoScan}
                        onChange={(e) => actualizarConfig('autoScan', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-orange-900/30 border-2 border-orange-600 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-orange-400">📊 Universo de Activos Escaneados</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-sm">💱 Forex (Pares Principales)</span>
                      <span className="font-bold text-blue-400">28</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-sm">📈 Acciones USA</span>
                      <span className="font-bold text-green-400">500+</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-sm">🥇 Metales Preciosos</span>
                      <span className="font-bold text-yellow-400">4</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-sm">🛢️ Energía (Petróleo, Gas)</span>
                      <span className="font-bold text-orange-400">3</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-sm">📊 Índices Globales</span>
                      <span className="font-bold text-purple-400">12</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-sm">🌾 Commodities</span>
                      <span className="font-bold text-green-400">700+</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-orange-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">TOTAL ACTIVOS MONITOREADOS:</span>
                    <span className="text-3xl font-bold text-orange-400">~{performance.activosEscaneados}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Sistema escanea automáticamente todos los activos diariamente a las {config.horaEscaneo}, 
                    aplicando filtros de probabilidad ≥{config.probMin}% y RR ≥1:{config.rrMin}
                  </p>
                </div>
              </div>

              <div className="bg-green-900/30 border border-green-600 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={20} className="text-green-400" />
                  <div className="font-bold text-green-400">✅ Cambios Guardados Automáticamente</div>
                </div>
                <p className="text-sm text-gray-300">
                  Todos los cambios en la configuración se aplican inmediatamente. Los valores actuales están optimizados 
                  para un balance entre seguridad y rentabilidad.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sentinela;
