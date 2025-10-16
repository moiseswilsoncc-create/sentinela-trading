import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings, BarChart3, Activity, Brain, DollarSign, Clock, Shield, Eye, RefreshCw } from 'lucide-react';

const Sentinela = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
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

  // Simulación de actualización de precios en tiempo real
  const [operacionesValidadas, setOperacionesValidadas] = useState([
    { id: 1, activo: 'GOLD', tipo: 'CFD', accion: 'COMPRA', entrada: 4178.66, sl: 4140.00, tp: 4295.00, prob: 89, rr: '1:3.0', score: 97, razon: 'RSI 82.1 sobrecompra + MACD divergencia alcista + Máximo histórico cercano', tf1h: 'Tendencia alcista fuerte', tf4h: 'Ruptura resistencia 4150', gananciaEsperada: 60234, riesgo: 20000 },
    { id: 2, activo: 'EURUSD', tipo: 'FOREX', accion: 'VENTA', entrada: 1.15636, sl: 1.16200, tp: 1.13944, prob: 88, rr: '1:3.0', score: 95, razon: 'Divergencia bajista RSI + Trump suaviza tensiones China + USD fortaleza', tf1h: 'Rechazo en resistencia', tf4h: 'Patrón doble techo formado', gananciaEsperada: 60000, riesgo: 20000 },
    { id: 3, activo: 'COFFEE', tipo: 'CFD', accion: 'COMPRA', entrada: 383.30, sl: 376.00, tp: 405.20, prob: 86, rr: '1:3.0', score: 93, razon: 'Rally +50.33% YoY + Heladas Brasil + Déficit oferta proyectado', tf1h: 'Rebote en soporte clave', tf4h: 'Tendencia alcista intacta', gananciaEsperada: 60006, riesgo: 20000 },
    { id: 4, activo: 'GBPUSD', tipo: 'FOREX', accion: 'COMPRA', entrada: 1.30450, sl: 1.29800, tp: 1.32400, prob: 85, rr: '1:3.0', score: 91, razon: 'Horario óptimo Asia-Europa + BoE hawkish + Soporte fuerte 1.30', tf1h: 'Momentum alcista', tf4h: 'Ruptura media móvil 200', gananciaEsperada: 59999, riesgo: 20000 },
    { id: 5, activo: 'NVDA', tipo: 'ACCIÓN', accion: 'COMPRA', entrada: 137.98, sl: 133.50, tp: 151.42, prob: 84, rr: '1:3.0', score: 89, razon: 'Post-earnings patrón +92% éxito histórico + Sector tech líder', tf1h: 'Consolidación alcista', tf4h: 'Bandera alcista formándose', gananciaEsperada: 59991, riesgo: 20000 },
    { id: 6, activo: 'WTI', tipo: 'CFD', accion: 'VENTA', entrada: 78.40, sl: 80.20, tp: 73.00, prob: 82, rr: '1:3.0', score: 85, razon: 'Inventarios EIA alcistas + Demanda China débil + Resistencia técnica', tf1h: 'Divergencia bajista formada', tf4h: 'Rechazo en zona 78-80', gananciaEsperada: 59999, riesgo: 20000 },
    { id: 7, activo: 'DAX40', tipo: 'ÍNDICE', accion: 'COMPRA', entrada: 15820.00, sl: 15680.00, tp: 16240.00, prob: 81, rr: '1:3.0', score: 83, razon: 'ECB dovish esperado + Sector automotriz rebote + Euro débil favorece exportaciones', tf1h: 'Rechazo en mínimos', tf4h: 'Patrón W invertida', gananciaEsperada: 60060, riesgo: 20000 },
    { id: 8, activo: 'GOOGL', tipo: 'ACCIÓN', accion: 'COMPRA', entrada: 167.50, sl: 163.80, tp: 178.60, prob: 80, rr: '1:3.0', score: 82, razon: 'Anuncio IA Gemini + Sector tech momentum + Soporte técnico clave', tf1h: 'Bandera alcista', tf4h: 'EMA 50 soporte', gananciaEsperada: 58500, riesgo: 20000 }
  ]);

  const [posicionesActivas, setPosicionesActivas] = useState([
    { activo: 'GOLD', tipo: 'COMPRA', entrada: 4178.66, actual: 4195.30, sl: 4140.00, tp: 4295.00, pl: 8600, tiempo: '2h 45m' },
    { activo: 'EURUSD', tipo: 'VENTA', entrada: 1.15636, actual: 1.15420, sl: 1.16200, tp: 1.13944, pl: 7660, tiempo: '1h 30m' },
    { activo: 'COFFEE', tipo: 'COMPRA', entrada: 383.30, actual: 386.50, sl: 376.00, tp: 405.20, pl: 8768, tiempo: '3h 15m' }
  ]);

  const [historialOperaciones, setHistorialOperaciones] = useState([
    { fecha: '14 Oct 09:30', activo: 'EURUSD', tipo: 'VENTA', entrada: 1.15800, salida: 1.15200, resultado: 'WIN', pl: 6000, razon: 'TP alcanzado' },
    { fecha: '13 Oct 14:20', activo: 'GOLD', tipo: 'COMPRA', entrada: 4150.00, salida: 4210.00, resultado: 'WIN', pl: 7800, razon: 'TP alcanzado' },
    { fecha: '12 Oct 10:45', activo: 'NVDA', tipo: 'COMPRA', entrada: 135.50, salida: 142.30, resultado: 'WIN', pl: 5440, razon: 'TP alcanzado' },
    { fecha: '11 Oct 08:30', activo: 'COFFEE', tipo: 'COMPRA', entrada: 380.00, salida: 375.50, resultado: 'LOSS', pl: -2700, razon: 'SL activado' },
    { fecha: '10 Oct 15:00', activo: 'WTI', tipo: 'VENTA', entrada: 79.50, salida: 74.20, resultado: 'WIN', pl: 8850, razon: 'TP alcanzado' }
  ]);

  // Función para cerrar posición automáticamente
  const cerrarPosicion = (posicion, precio, motivo) => {
    const resultado = posicion.pl > 0 ? 'WIN' : 'LOSS';
    const nuevaOperacion = {
      fecha: new Date().toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      activo: posicion.activo,
      tipo: posicion.tipo,
      entrada: posicion.entrada,
      salida: precio,
      resultado: resultado,
      pl: posicion.pl,
      razon: motivo
    };
    
    setHistorialOperaciones(prev => [nuevaOperacion, ...prev]);
    setPosicionesActivas(prev => prev.filter(p => p.activo !== posicion.activo));
  };

  const historialAdaptativo = [
    { fecha: '14 Oct 09:30', activo: 'NVDA', patron: 'Post-earnings', resultado: 'WIN', ajuste: 'Entrada +2.5%', mejora: '+8%' },
    { fecha: '13 Oct 14:20', activo: 'EURUSD', patron: 'Divergencia RSI', resultado: 'WIN', ajuste: 'TP +15 pips', mejora: '+12%' },
    { fecha: '12 Oct 10:45', activo: 'GOLD', patron: 'VIX >20', resultado: 'WIN', ajuste: 'SL ampliado', mejora: '+5%' },
    { fecha: '11 Oct 08:30', activo: 'TSLA', patron: 'Contra-tendencia', resultado: 'LOSS', ajuste: 'FILTRO APLICADO', mejora: 'Pérdidas evitadas' }
  ];

  // Simulación de actualización de precios cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setPosicionesActivas(prev => prev.map(pos => {
        const variation = (Math.random() - 0.5) * 2;
        const newActual = pos.actual + variation;
        const newPl = ((newActual - pos.entrada) * 517).toFixed(0);
        
        // Verificar si alcanzó TP o SL automáticamente
        if (pos.tipo === 'COMPRA') {
          if (newActual >= pos.tp) {
            cerrarPosicion(pos, pos.tp, 'TP alcanzado automáticamente');
            return null;
          }
          if (newActual <= pos.sl) {
            cerrarPosicion(pos, pos.sl, 'SL activado automáticamente');
            return null;
          }
        } else {
          if (newActual <= pos.tp) {
            cerrarPosicion(pos, pos.tp, 'TP alcanzado automáticamente');
            return null;
          }
          if (newActual >= pos.sl) {
            cerrarPosicion(pos, pos.sl, 'SL activado automáticamente');
            return null;
          }
        }
        
        return {
          ...pos,
          actual: parseFloat(newActual.toFixed(2)),
          pl: parseInt(newPl)
        };
      }).filter(Boolean));
      setLastUpdate(new Date().toLocaleTimeString());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulación de escaneo manual
  const ejecutarEscaneo = () => {
    setIsLoading(true);
    setAgentes({
      tecnico: { ...agentes.tecnico, progreso: 0 },
      fundamental: { ...agentes.fundamental, progreso: 0 },
      riesgo: { ...agentes.riesgo, progreso: 0 },
      adaptativo: { ...agentes.adaptativo, progreso: 0 }
    });

    // Simular progreso de cada agente
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
        {/* Header con Logo SENTINELA */}
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
              <div className="text-xs text-gray-400">Última actualización: {lastUpdate}</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-400" />
              <span>Escaneo diario: {config.horaEscaneo} AM</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-red-400" />
              <span>Timeframes: {config.timeframes.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400" />
              <span>Máximo: {config.maxOps} operaciones/día</span>
            </div>
          </div>
        </div>

        {/* Estado de Agentes IA con progreso */}
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

        {/* Stats principales */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Capital Actual</div>
            <div className="text-2xl font-bold text-green-400">${performance.capitalActual.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Inicial: ${performance.capitalInicial.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Ganancia Total</div>
            <div className="text-2xl font-bold text-green-400">+${performance.gananciaTotal.toLocaleString()}</div>
            <div className="text-xs text-green-500">+{performance.gananciaPercent}%</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-blue-400">{performance.winRate}%</div>
            <div className="text-xs text-gray-500">{performance.ganadoras}W / {performance.perdedoras}L</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Profit Factor</div>
            <div className="text-2xl font-bold text-purple-400">{performance.profitFactor}</div>
            <div className="text-xs text-gray-500">{performance.totalOps} ops</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Tab id="dashboard" icon={Activity} label="Dashboard" active={activeTab === 'dashboard'} />
          <Tab id="operaciones" icon={TrendingUp} label="Operaciones Hoy" badge={operacionesValidadas.length} active={activeTab === 'operaciones'} />
          <Tab id="posiciones" icon={Clock} label="Posiciones" badge={posicionesActivas.length} active={activeTab === 'posiciones'} />
          <Tab id="ia" icon={Brain} label="IA Adaptativa" active={activeTab === 'ia'} />
          <Tab id="config" icon={Settings} label="Configuración" active={activeTab === 'config'} />
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Panel de simulación */}
              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-4 rounded-lg border border-green-600">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw size={20} className="text-green-400" />
                  <div className="font-bold">MODO SIMULACIÓN - Datos en Tiempo Real</div>
                </div>
                <div className="text-sm text-gray-300">
                  Los precios se actualizan cada 5 segundos simulando datos reales de APIs. 
                  Click en "Escanear Ahora" para ver los agentes en acción.
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 p-6 rounded-lg border border-orange-700">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Escaneo de Hoy Completado</h2>
                    <p className="text-gray-400">Realizado a las {config.horaEscaneo} AM • Última actualización: {lastUpdate}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-400">{operacionesValidadas.length}/{config.maxOps}</div>
                    <div className="text-sm text-gray-400">Operaciones validadas</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm bg-gray-800/50 p-4 rounded">
                  <div>
                    <span className="text-gray-400">Activos escaneados:</span>
                    <span className="ml-2 font-bold text-orange-400">{performance.activosEscaneados}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Rechazados:</span>
                    <span className="ml-2 font-bold text-red-400">{performance.activosEscaneados - operacionesValidadas.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Próximo escaneo:</span>
                    <span className="ml-2 font-bold text-yellow-400">Mañana {config.horaEscaneo} AM</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold">Top 5 Operaciones del Día</h3>
              {operacionesValidadas.slice(0, 5).map((op, idx) => (
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
                    <div className="text-sm mb-2">{op.razon}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div className="bg-blue-900/30 p-2 rounded border border-blue-700">
                        <span className="text-blue-400 font-bold">1H:</span> {op.tf1h}
                      </div>
                      <div className="bg-purple-900/30 p-2 rounded border border-purple-700">
                        <span className="text-purple-400 font-bold">4H:</span> {op.tf4h}
                      </div>
                    </div>
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

              {posicionesActivas.length > 0 && (
                <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
                  <div className="font-bold mb-2">📊 Posiciones Activas: {posicionesActivas.length} (Actualizando en tiempo real)</div>
                  <div className="text-sm text-gray-300">
                    P&L Total Abierto: <span className="text-green-400 font-bold">+${posicionesActivas.reduce((sum, p) => sum + p.pl, 0).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'operaciones' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Operaciones Validadas - Hoy {config.horaEscaneo} AM</h2>
              {operacionesValidadas.map((op, idx) => (
                <div key={op.id} className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-orange-400">#{idx + 1}</div>
                      <div>
                        <div className="text-xl font-bold">{op.activo}</div>
                        <div className="text-sm text-gray-400">{op.tipo} • Prob: {op.prob}% • Score: {op.score}</div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold ${op.accion === 'COMPRA' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {op.accion}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-3 rounded mb-3">
                    <div className="text-sm">{op.razon}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div className="bg-blue-900/30 p-2 rounded border border-blue-700">
                        <span className="text-blue-400 font-bold">1H:</span> {op.tf1h}
                      </div>
                      <div className="bg-purple-900/30 p-2 rounded border border-purple-700">
                        <span className="text-purple-400 font-bold">4H:</span> {op.tf4h}
                      </div>
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
                      <div className="text-xs text-gray-400">Ganancia</div>
                      <div className="font-bold text-green-400">${(op.gananciaEsperada/1000).toFixed(1)}K</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'posiciones' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-4 rounded-lg border border-green-600 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw size={18} className="text-green-400 animate-spin" />
                  <div className="font-bold">Actualizando precios cada 5 segundos</div>
                </div>
                <div className="text-sm text-gray-300">
                  Los precios y P&L se actualizan automáticamente simulando datos en tiempo real
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
                      <div className="text-sm text-gray-400">{pos.tiempo} • Actualizando...</div>
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

              <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
                <div className="text-xl font-bold mb-2">P&L Total Posiciones Abiertas</div>
                <div className="text-3xl font-bold text-green-400">
                  +${posicionesActivas.reduce((sum, p) => sum + p.pl, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 mt-2">Última actualización: {lastUpdate}</div>
              </div>
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 p-6 rounded-lg border border-green-700">
                <h2 className="text-2xl font-bold mb-4">🧠 Aprendizaje Adaptativo</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Adaptaciones</div>
                    <div className="text-3xl font-bold text-green-400">{agentes.adaptativo.adaptaciones}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Patrones Aprendidos</div>
                    <div className="text-3xl font-bold text-blue-400">{agentes.adaptativo.patrones}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Tasa de Éxito</div>
                    <div className="text-3xl font-bold text-purple-400">{agentes.adaptativo.tasaExito}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-900/30 border border-orange-600 p-4 rounded-lg">
                <div className="font-bold mb-2">🎯 Cómo funciona la IA Adaptativa:</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>• <span className="text-orange-400">Aprende de cada operación:</span> Analiza wins y losses para mejorar futuras decisiones</div>
                  <div>• <span className="text-orange-400">Ajusta parámetros:</span> Modifica SL, TP y criterios de entrada según patrones detectados</div>
                  <div>• <span className="text-orange-400">Filtra activos problemáticos:</span> Evita setups que históricamente tienen baja tasa de éxito</div>
                  <div>• <span className="text-orange-400">Optimiza timeframes:</span> Identifica horarios y condiciones óptimas para cada activo</div>
                </div>
              </div>

              <h3 className="text-xl font-bold">Historial de Operaciones Completo</h3>
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {historialOperaciones.filter(op => op.resultado === 'WIN').length} Ganadoras
                    </div>
                    <div className="text-sm text-gray-400">
                      vs {historialOperaciones.filter(op => op.resultado === 'LOSS').length} Perdedoras
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {((historialOperaciones.filter(op => op.resultado === 'WIN').length / historialOperaciones.length) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
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

              <h3 className="text-xl font-bold mt-6">Aprendizaje por Patrones</h3>
              {historialAdaptativo.map((item, idx) => (
                <div key={idx} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-lg">{item.activo} - {item.patron}</div>
                      <div className="text-sm text-gray-400">{item.fecha}</div>
                    </div>
                    <div className={`px-3 py-1 rounded font-bold ${item.resultado === 'WIN' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {item.resultado}
                    </div>
                  </div>
                  <div className="text-sm bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 mb-1">Ajuste aplicado:</div>
                    <div className="mb-2">{item.ajuste}</div>
                    <div className="text-green-400 font-bold">Mejora en performance: {item.mejora}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">⚙️ Configuración SENTINELA</h2>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-bold mb-2">Capital Inicial ($)</label>
                <input 
                  type="number" 
                  value={config.capital} 
                  onChange={(e) => setConfig({...config, capital: Number(e.target.value)})} 
                  className="w-full bg-gray-800 px-4 py-2 rounded border border-gray-600 text-white focus:border-orange-500 outline-none" 
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-bold mb-2">Riesgo por Operación: {config.riesgo}%</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="0.5" 
                  value={config.riesgo} 
                  onChange={(e) => setConfig({...config, riesgo: Number(e.target.value)})} 
                  className="w-full" 
                />
                <div className="text-sm text-gray-400 mt-2">
                  Riesgo por operación: ${(config.capital * config.riesgo / 100).toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-bold mb-2">Máximo Operaciones Diarias: {config.maxOps}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={config.maxOps} 
                  onChange={(e) => setConfig({...config, maxOps: Number(e.target.value)})} 
                  className="w-full" 
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-bold mb-2">Probabilidad Mínima: {config.probMin}%</label>
                <input 
                  type="range" 
                  min="70" 
                  max="95" 
                  value={config.probMin} 
                  onChange={(e) => setConfig({...config, probMin: Number(e.target.value)})} 
                  className="w-full" 
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-bold mb-2">Ratio RR Mínimo: 1:{config.rrMin}</label>
                <input 
                  type="range" 
                  min="2" 
                  max="5" 
                  step="0.5" 
                  value={config.rrMin} 
                  onChange={(e) => setConfig({...config, rrMin: Number(e.target.value)})} 
                  className="w-full" 
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-bold mb-2">Hora de Escaneo Diario</label>
                <input 
                  type="time" 
                  value={config.horaEscaneo} 
                  onChange={(e) => setConfig({...config, horaEscaneo: e.target.value})} 
                  className="w-full bg-gray-800 px-4 py-2 rounded border border-gray-600 text-white focus:border-orange-500 outline-none" 
                />
                <div className="text-sm text-gray-400 mt-2">
                  💡 Recomendado: 08:00 AM (30 min antes apertura NYSE)
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-bold mb-2">Timeframes de Análisis</label>
                <div className="flex gap-2">
                  {['1H', '4H', '1D'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => {
                        if (config.timeframes.includes(tf)) {
                          setConfig({...config, timeframes: config.timeframes.filter(t => t !== tf)});
                        } else {
                          setConfig({...config, timeframes: [...config.timeframes, tf]});
                        }
                      }}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        config.timeframes.includes(tf) 
                          ? 'bg-gradient-to-r from-orange-600 to-red-600' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Seleccionados: {config.timeframes.join(', ')}
                </div>
              </div>

              <div className="bg-orange-900/30 border border-orange-600 p-4 rounded-lg">
                <div className="font-bold mb-2">📊 Activos Escaneados por SENTINELA:</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>✓ <span className="text-orange-400">Forex:</span> 50+ pares (EUR/USD, GBP/USD, USD/JPY, etc.)</div>
                  <div>✓ <span className="text-orange-400">Acciones USA:</span> 3,000+ (AAPL, NVDA, GOOGL, TSLA, MSFT, etc.)</div>
                  <div>✓ <span className="text-orange-400">Commodities:</span> Oro, Plata, Café, Cobre, Platino</div>
                  <div>✓ <span className="text-orange-400">Energía:</span> Petróleo WTI, Brent, Gas Natural</div>
                  <div>✓ <span className="text-orange-400">Agrícolas:</span> Café, Azúcar, Trigo, Maíz, Soja</div>
                  <div>✓ <span className="text-orange-400">Índices:</span> S&P 500, NASDAQ, Dow Jones, DAX, FTSE</div>
                  <div className="font-bold text-orange-400 mt-2">TOTAL: ~1,247 activos CFD compatibles con XTB</div>
                  <div className="text-red-400 text-sm mt-2">❌ Criptomonedas excluidas del análisis</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-600 p-4 rounded-lg">
                <div className="font-bold mb-2">🎯 Estrategia de Operación SENTINELA:</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>• <span className="text-green-400">Frecuencia:</span> Escaneo automático 1 vez al día a las {config.horaEscaneo} AM</div>
                  <div>• <span className="text-blue-400">Timeframes:</span> {config.timeframes.join(', ')} (Day Trading optimizado)</div>
                  <div>• <span className="text-purple-400">Ejecución:</span> Manual en broker XTB</div>
                  <div>• <span className="text-yellow-400">Límite:</span> Máximo {config.maxOps} operaciones simultáneas</div>
                  <div>• <span className="text-orange-400">Criterios:</span> Probabilidad ≥{config.probMin}% + Ratio RR ≥1:{config.rrMin}</div>
                  <div>• <span className="text-red-400">Riesgo:</span> {config.riesgo}% por operación (${(config.capital * config.riesgo / 100).toLocaleString()} por trade)</div>
                  <div>• <span className="text-pink-400">IA Adaptativa:</span> Aprendizaje continuo mejorando criterios de entrada/salida</div>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
                <div className="font-bold mb-2">🔮 Próximos Pasos:</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>1. <span className="text-blue-400">Conectar APIs reales:</span> Finnhub, Alpha Vantage, News API</div>
                  <div>2. <span className="text-blue-400">Desplegar en web:</span> Acceso desde cualquier dispositivo</div>
                  <div>3. <span className="text-blue-400">Alertas automáticas:</span> Notificaciones cuando aparezcan setups</div>
                  <div>4. <span className="text-blue-400">Historial persistente:</span> Base de datos para tracking completo</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sentinela;
