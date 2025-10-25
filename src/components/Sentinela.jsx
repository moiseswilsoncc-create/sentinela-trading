import React, { useState, useEffect } from "react";
import {
  TrendingUp, Settings, BarChart3, Activity, Brain, DollarSign,
  Clock, Shield, Eye, RefreshCw, Wifi, WifiOff, AlertCircle
} from "lucide-react";

const Sentinela = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [lastScanTime, setLastScanTime] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiErrors, setApiErrors] = useState([]);

  // Configuración inicial
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("sentinela_config");
    return saved
      ? JSON.parse(saved)
      : {
          capital: 1000000,
          riesgo: 2,
          maxOps: 10,
          probMin: 80,
          rrMin: 3,
          horaEscaneo: "08:00",
          timeframes: ["1H", "4H"],
          autoScan: true,
        };
  });

  const [agentes, setAgentes] = useState({
    tecnico: { estado: "ESPERANDO", operaciones: 0, ultimoScan: "N/A", progreso: 0 },
    fundamental: { estado: "ESPERANDO", fuentes: 0, noticias: 0, progreso: 0 },
    riesgo: { estado: "ESPERANDO", posicionesMax: config.maxOps, calculosHoy: 0, progreso: 0 },
    adaptativo: { estado: "ESPERANDO", adaptaciones: 0, patrones: 0, tasaExito: 0, progreso: 0 },
  });

  const [performance, setPerformance] = useState({
    capitalInicial: config.capital,
    capitalActual: config.capital,
    gananciaTotal: 0,
    gananciaPercent: 0,
    winRate: 0,
    ganadoras: 0,
    perdedoras: 0,
    totalOps: 0,
    profitFactor: 0,
    activosEscaneados: 0,
  });

  const [operacionesValidadas, setOperacionesValidadas] = useState([]);
  const [posicionesActivas, setPosicionesActivas] = useState([]);

  const [historialOperaciones, setHistorialOperaciones] = useState(() => {
    const saved = localStorage.getItem("sentinela_historial");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("sentinela_config", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("sentinela_historial", JSON.stringify(historialOperaciones));
  }, [historialOperaciones]);

  useEffect(() => {
    const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;
    const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    const newsKey = import.meta.env.VITE_NEWS_API_KEY;
    if (finnhubKey && alphaKey && newsKey) setApiConnected(true);
  }, []);

  // 🔹 FUNCIONES PRINCIPALES DE OBTENCIÓN DE DATOS

  const obtenerPrecioReal = async (simbolo) => {
    if (simbolo.includes("USD")) return await obtenerPrecioForex(simbolo);

    const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;
    if (!finnhubKey) {
      console.error("❌ Finnhub API Key no encontrada");
      return null;
    }

    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${simbolo}&token=${finnhubKey}`
      );
      const data = await response.json();
      if (data.c && data.c > 0) return data.c;
      return null;
    } catch (error) {
      console.error("❌ Error obteniendo precio:", error);
      setApiErrors((prev) => [...prev, `${simbolo}: ${error.message}`]);
      return null;
    }
  };

  const obtenerPrecioForex = async (simbolo) => {
    const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    if (!alphaKey) {
      console.error("❌ Alpha Vantage API Key no encontrada");
      return null;
    }

    try {
      const from = simbolo.substring(0, 3);
      const to = simbolo.substring(3, 6);
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${alphaKey}`
      );
      const data = await response.json();
      if (data["Realtime Currency Exchange Rate"]) {
        return parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
      }
      return null;
    } catch (error) {
      console.error("❌ Error Forex:", error);
      setApiErrors((prev) => [...prev, `${simbolo}: ${error.message}`]);
      return null;
    }
  };

  const obtenerPrecioCommodity = async (simbolo) => {
    const preciosBase = { GOLD: 2725, SILVER: 34, OIL: 72 };
    const precioBase = preciosBase[simbolo] || 100;
    const variacion = (Math.random() - 0.5) * (precioBase * 0.01);
    return precioBase + variacion;
  };

  // 🔹 FUNCIONES DE ESCANEO Y SIMULACIÓN

  const escanearMercado = async () => {
    setIsLoading(true);
    setApiErrors([]);
    setAgentes((prev) => ({
      ...prev,
      tecnico: { ...prev.tecnico, estado: "ESCANEANDO...", progreso: 50 },
      fundamental: { ...prev.fundamental, estado: "ANALIZANDO...", progreso: 40 },
    }));

    setTimeout(() => {
      setAgentes((prev) => ({
        tecnico: { ...prev.tecnico, estado: "COMPLETADO", progreso: 100, operaciones: 12 },
        fundamental: { ...prev.fundamental, estado: "ACTUALIZADO", progreso: 100, noticias: 18 },
        riesgo: { ...prev.riesgo, estado: "OK", progreso: 100, calculosHoy: 10 },
        adaptativo: { ...prev.adaptativo, estado: "OPTIMIZADO", progreso: 100, tasaExito: 85 },
      }));
      setPerformance((prev) => ({
        ...prev,
        activosEscaneados: 1400,
        winRate: 0.52,
        totalOps: 10,
        ganadoras: 5,
        perdedoras: 5,
        profitFactor: 1.45,
      }));
      setLastScanTime(new Date().toLocaleTimeString());
      setIsLoading(false);
    }, 2500);
  };

  // 🔹 RENDER DEL PANEL PRINCIPAL

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Eye className="text-blue-400" /> SENTINELA TRADING
        </h1>
        <div className="flex items-center gap-4">
          {apiConnected ? (
            <span className="text-green-400 flex items-center gap-1">
              <Wifi size={18} /> APIs Conectadas
            </span>
          ) : (
            <span className="text-red-400 flex items-center gap-1">
              <WifiOff size={18} /> Sin conexión API
            </span>
          )}
          <button
            onClick={escanearMercado}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-bold transition disabled:opacity-50"
          >
            <RefreshCw className={isLoading ? "animate-spin" : ""} size={18} />
            {isLoading ? "Escaneando..." : "Escanear Ahora"}
          </button>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="flex gap-4 mb-6">
        {["dashboard", "agentes", "configuracion", "historial"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Dashboard principal */}
      {activeTab === "dashboard" && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Activity /> Rendimiento
            </h2>
            <p className="text-gray-400">
              Ganancia total:{" "}
              <span className="text-green-400 font-bold">
                ${performance.gananciaTotal.toFixed(2)}
              </span>
            </p>
            <p className="text-gray-400">
              Win Rate:{" "}
              <span className="text-blue-400 font-bold">
                {(performance.winRate * 100).toFixed(1)}%
              </span>
            </p>
            <p className="text-gray-400">Total de operaciones: {performance.totalOps}</p>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp /> Mercado
            </h2>
            <p className="text-gray-400">Activos escaneados: {performance.activosEscaneados}</p>
            <p className="text-gray-400">Último escaneo: {lastScanTime || "N/A"}</p>
            {apiErrors.length > 0 && (
              <div className="text-red-400 mt-2 text-sm flex gap-1 items-center">
                <AlertCircle size={14} /> {apiErrors.length} errores detectados
              </div>
            )}
          </div>

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Brain /> IA Adaptativa
            </h2>
            <p className="text-gray-400">
              Tasa de éxito:{" "}
              <span className="text-purple-400 font-bold">
                {agentes.adaptativo.tasaExito}%
              </span>
            </p>
            <p className="text-gray-400">Patrones detectados: {agentes.adaptativo.patrones}</p>
            <p className="text-gray-400">Estado: {agentes.adaptativo.estado}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sentinela;
