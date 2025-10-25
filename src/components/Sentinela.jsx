import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Settings, BarChart3, Activity, Brain, DollarSign,
  Clock, Shield, Eye, RefreshCw, Wifi, WifiOff, AlertCircle
} from 'lucide-react';

const Sentinela = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [lastScanTime, setLastScanTime] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiErrors, setApiErrors] = useState([]);

  // Configuración inicial
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('sentinela_config');
    return saved
      ? JSON.parse(saved)
      : {
          capital: 1000000,
          riesgo: 2,
          maxOps: 10,
          probMin: 80,
          rrMin: 3,
          horaEscaneo: '08:00',
          timeframes: ['1H', '4H'],
          autoScan: true,
        };
  });

  const [agentes, setAgentes] = useState({
    tecnico: { estado: 'ESPERANDO', operaciones: 0, ultimoScan: 'N/A', progreso: 0 },
    fundamental: { estado: 'ESPERANDO', fuentes: 0, noticias: 0, progreso: 0 },
    riesgo: { estado: 'ESPERANDO', posicionesMax: config.maxOps, calculosHoy: 0, progreso: 0 },
    adaptativo: { estado: 'ESPERANDO', adaptaciones: 0, patrones: 0, tasaExito: 0, progreso: 0 },
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
    const saved = localStorage.getItem('sentinela_historial');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sentinela_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('sentinela_historial', JSON.stringify(historialOperaciones));
  }, [historialOperaciones]);

  useEffect(() => {
    const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;
    const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    const newsKey = import.meta.env.VITE_NEWS_API_KEY;

    if (finnhubKey && alphaKey && newsKey) setApiConnected(true);
  }, []);

  // ✅ FUNCIONES ÚNICAS

  // Obtener precio real
  const obtenerPrecioReal = async (simbolo) => {
    if (simbolo.includes('USD')) return await obtenerPrecioForex(simbolo);

    const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;
    if (!finnhubKey) {
      console.error('❌ Finnhub API Key no encontrada');
      return null;
    }

    try {
      console.log(`📊 Obteniendo precio de ${simbolo} desde Finnhub...`);
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${simbolo}&token=${finnhubKey}`);
      const data = await response.json();

      if (data.c && data.c > 0) {
        console.log(`✅ ${simbolo}: $${data.c}`);
        return data.c;
      }
      console.warn(`⚠️ ${simbolo}: Sin datos válidos`);
      return null;
    } catch (error) {
      console.error(`❌ Error obteniendo ${simbolo}:`, error);
      setApiErrors((prev) => [...prev, `${simbolo}: ${error.message}`]);
      return null;
    }
  };

  // Forex desde Alpha Vantage
  const obtenerPrecioForex = async (simbolo) => {
    const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    if (!alphaKey) {
      console.error('❌ Alpha Vantage API Key no encontrada');
      return null;
    }

    try {
      const from = simbolo.substring(0, 3);
      const to = simbolo.substring(3, 6);
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${alphaKey}`
      );
      const data = await response.json();

      if (data['Realtime Currency Exchange Rate']) {
        const precio = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        console.log(`✅ ${simbolo}: ${precio.toFixed(5)}`);
        return precio;
      } else if (data['Note']) {
        console.warn(`⚠️ ${simbolo}: Límite de API alcanzado`);
        setApiErrors((prev) => [...prev, `${simbolo}: Límite de Alpha Vantage (5 llamadas/min)`]);
        return null;
      } else {
        console.warn(`⚠️ ${simbolo}: Sin datos válidos`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error obteniendo ${simbolo}:`, error);
      setApiErrors((prev) => [...prev, `${simbolo}: ${error.message}`]);
      return null;
    }
  };

  // Precio aproximado commodities
  const obtenerPrecioCommodity = async (simbolo) => {
    const preciosBase = { GOLD: 2725, SILVER: 34, OIL: 72 };
    const precioBase = preciosBase[simbolo] || 100;
    const variacion = (Math.random() - 0.5) * (precioBase * 0.01);
    console.log(`🥇 ${simbolo}: $${(precioBase + variacion).toFixed(2)}`);
    return precioBase + variacion;
  };

  // Resto del código sin cambios (análisis técnico, tabs, interfaz, etc.)
  // 👇👇👇
  // --- MANTÉN TU CÓDIGO ORIGINAL DESDE AQUÍ ---
};

export default Sentinela;
