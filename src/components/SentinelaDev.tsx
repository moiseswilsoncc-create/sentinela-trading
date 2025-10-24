import React, { useEffect, useState, useRef } from "react";
import {
  TrendingUp,
  Settings,
  BarChart3,
  Activity,
  Brain,
  DollarSign,
  Clock,
  Shield,
  Eye,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle
} from "lucide-react";

/**
 * SentinelaDev.tsx
 * Versión de desarrollo avanzada de Sentinela con:
 * - Agentes modulares (tecnico, fundamental, riesgo, adaptativo)
 * - Orquestador IA que combina los resultados
 * - Persistencia en IndexedDB (helper simple incluido)
 * - Throttling para APIs (Alpha Vantage)
 * - Panel de métricas manuales y diagnóstico
 *
 * Recomendación de uso:
 * - Modo Dev: conserva logs y trazas
 * - Asegúrate de configurar API keys en .env o en Vercel (VITE_*)
 */

/* ---------------------------
   IndexedDB helper (pequeña capa)
   - No requiere dependencia externa
   --------------------------- */
const IDB_NAME = "SentinelaDB";
const IDB_VERSION = 1;
const STORE_HISTORIAL = "historial";
const STORE_METRICAS = "metricas";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_HISTORIAL)) {
        db.createObjectStore(STORE_HISTORIAL, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_METRICAS)) {
        db.createObjectStore(STORE_METRICAS, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(storeName: string, value: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const s = tx.objectStore(storeName);
    s.put(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGetAll(storeName: string) {
  const db = await openDB();
  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const s = tx.objectStore(storeName);
    const req = s.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(storeName: string, key: string) {
  const db = await openDB();
  return new Promise<any>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const s = tx.objectStore(storeName);
    const req = s.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* ---------------------------
   Utilidades
   --------------------------- */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const safeNumber = (v: any, fallback = 0) =>
  typeof v === "number" && !isNaN(v) ? v : fallback;

/* ---------------------------
   Tipos (simples)
   --------------------------- */
type Analisis = {
  activo: string;
  tipo: "FOREX" | "CFD" | "ACCIÓN";
  accion: "COMPRA" | "VENTA";
  entrada: number;
  sl: number;
  tp: number;
  prob: number;
  score: number;
  razon: string;
  gananciaEsperada: number;
  timestamp: string;
};

/* ---------------------------
   Agentes (módulos internos)
   Cada agente devuelve un objeto con conclusiones y métricas.
   --------------------------- */

async function tecnicoAgent(
  simbolo: string,
  precio: number,
  config: any
): Promise<{ analisis?: Analisis; meta: any }> {
  // Simulación de análisis técnico avanzado
  // Aquí puedes sustituir por indicadores reales (RSI, MACD, MA cross, etc.)
  const baseProb = 70 + Math.random() * 25; // 70-95
  const baseScore = 60 + Math.random() * 40; // 60-100
  const esCompra = Math.random() > 0.5;
  const variacion = precio * 0.015; // 1.5%

  const entrada = parseFloat(precio.toFixed(precio < 10 ? 5 : 2));
  const sl = parseFloat((esCompra ? precio - variacion : precio + variacion).toFixed(precio < 10 ? 5 : 2));
  const tp = parseFloat((esCompra ? precio + variacion * config.rrMin : precio - variacion * config.rrMin).toFixed(precio < 10 ? 5 : 2));

  const analisis: Analisis = {
    activo: simbolo,
    tipo: simbolo.includes("USD")
      ? "FOREX"
      : ["GOLD", "SILVER", "OIL"].includes(simbolo)
      ? "CFD"
      : "ACCIÓN",
    accion: esCompra ? "COMPRA" : "VENTA",
    entrada,
    sl,
    tp,
    prob: Math.round(baseProb),
    score: Math.round(baseScore),
    razon: "Sesgo técnico (momentum + soportes/resistencias)",
    gananciaEsperada: Math.round(config.capital * (config.riesgo / 100) * config.rrMin),
    timestamp: new Date().toISOString(),
  };

  return { analisis: baseProb >= config.probMin ? analisis : undefined, meta: { fuente: "tecnico", baseProb, baseScore } };
}

async function fundamentalAgent(simbolo: string, config: any): Promise<{ conclusion?: string; meta: any }> {
  // Simulación de análisis fundamental
  // En producción, llamar APIs de noticias, indicadores macro, calendario económico.
  const impacto = Math.random() > 0.7 ? "ALTO" : "BAJO";
  const sentimiento = Math.random() > 0.5 ? "POSITIVO" : "NEUTRO";

  const conclusion =
    impacto === "ALTO" && sentimiento === "POSITIVO"
      ? `Fundamentales favorables para ${simbolo}`
      : impacto === "ALTO" && sentimiento === "NEUTRO"
      ? `Fundamentales mixtos para ${simbolo}`
      : `Fundamentales neutros para ${simbolo}`;

  return { conclusion, meta: { impacto, sentimiento, fuente: "fundamental" } };
}

async function riesgoAgent(operaciones: Analisis[], config: any) {
  // Calcula exposición, posiciones máximas y sugiere recortes
  const totalExpectedRisk = operaciones.reduce((acc, op) => acc + (op.gananciaEsperada || 0), 0);
  const posicionesMax = config.maxOps;
  const overlapRisk = totalExpectedRisk / config.capital;
  const recomendacion = overlapRisk > 0.2 ? "REDUCIR" : "OK";

  return { posicionesMax, overlapRisk, recomendacion, meta: { fuente: "riesgo" } };
}

async function adaptativoAgent(historial: any[], config: any) {
  // Simula aprendizaje: calcula winRate histórico y sugiere ajustes
  const wins = historial.filter((h) => h.resultado === "WIN").length;
  const total = historial.length || 1;
  const winRate = (wins / total) * 100;
  const ajuste = winRate < 50 ? "AGRESIVIZAR-TEST" : "MANTENER";
  return { winRate, ajuste, meta: { fuente: "adaptativo" } };
}

/* ---------------------------
   Orquestador IA (fusión de agentes)
   - Recibe outputs y devuelve veredicto y score compuesto
   --------------------------- */
async function orchestratorAgent(
  tecnicoOut: any,
  fundamentalOut: any,
  riesgoOut: any,
  adaptativoOut: any,
  config: any
) {
  // Ponderaciones (puedes ajustar dinámicamente)
  const wTec = 0.6;
  const wFund = 0.3;
  const wRisk = 0.1;

  const scoreTec = tecnicoOut?.analisis?.score ? tecnicoOut.analisis.score : 0;
  const probTec = tecnicoOut?.analisis?.prob ? tecnicoOut.analisis.prob : 0;

  // Simple aggregator
  const compositeScore = Math.round(scoreTec * wTec + (probTec / 100) * 100 * wFund);
  const decision = compositeScore > 75 && tecnicoOut?.analisis ? "EXECUTABLE" : "NO_EXECUTABLE";

  const razon =
    decision === "EXECUTABLE"
      ? "Convergencia Técnica + Soporte Fundamental"
      : "Se requiere más evidencia (riesgo/score)";

  return {
    decision,
    compositeScore,
    razon,
    meta: {
      partes: { tecnico: tecnicoOut?.meta, fundamental: fundamentalOut?.meta, riesgo: riesgoOut, adaptativo: adaptativoOut?.meta },
    },
  };
}

/* ---------------------------
   API price fetchers (throttled + safe)
   - Usa import.meta.env.VITE_... para keys
   - No prints de keys
   --------------------------- */

async function fetchFinnhubQuote(symbol: string) {
  const key = import.meta.env.VITE_FINNHUB_API_KEY;
  if (!key) {
    throw new Error("Finnhub API key missing");
  }
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Finnhub HTTP ${r.status}`);
  return await r.json();
}

async function fetchAlphaForex(from: string, to: string) {
  const key = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  if (!key) {
    throw new Error("Alpha Vantage API key missing");
  }
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${key}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Alpha HTTP ${r.status}`);
  return await r.json();
}

/* ---------------------------
   Componente principal
   --------------------------- */
const SentinelaDev: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  // configuración (dev-friendly)
  const [config, setConfig] = useState<any>(() => {
    const saved = localStorage.getItem("sentinela_config_dev");
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
          throttleAlphaMs: 13000, // Alpha Vantage rate limit
        };
  });

  // agentes state
  const [agentes, setAgentes] = useState<any>({
    tecnico: { estado: "ESPERANDO", operaciones: 0, ultimoScan: "N/A", progreso: 0 },
    fundamental: { estado: "ESPERANDO", fuentes: 0, noticias: 0, progreso: 0 },
    riesgo: { estado: "ESPERANDO", posicionesMax: config.maxOps, calculosHoy: 0, progreso: 0 },
    adaptativo: { estado: "ESPERANDO", adaptaciones: 0, patrones: 0, tasaExito: 0, progreso: 0 },
  });

  // performance & lists
  const [performance, setPerformance] = useState<any>({
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

  const [operacionesValidadas, setOperacionesValidadas] = useState<Analisis[]>([]);
  const [posicionesActivas, setPosicionesActivas] = useState<any[]>([]);
  const [historialOperaciones, setHistorialOperaciones] = useState<any[]>([]);
  const isMounted = useRef(true);

  // cargar historial desde IndexedDB (async)
  useEffect(() => {
    isMounted.current = true;
    (async () => {
      try {
        const h = await idbGetAll(STORE_HISTORIAL);
        if (isMounted.current) setHistorialOperaciones(h || []);
        const metrics = await idbGetAll(STORE_METRICAS);
        // opcional: aplicar métricas almacenadas
      } catch (err) {
        console.warn("IDB load error", err);
      }
    })();
    return () => {
      isMounted.current = false;
    };
  }, []);

  // persistir configuracion en localStorage (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem("sentinela_config_dev", JSON.stringify(config));
    }, 800);
    return () => clearTimeout(t);
  }, [config]);

  // validar keys de API al inicio
  useEffect(() => {
    const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;
    const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    const newsKey = import.meta.env.VITE_NEWS_API_KEY;
    console.log("🔑 Dev check API keys (present?)", {
      finnhub: !!finnhubKey,
      alpha: !!alphaKey,
      news: !!newsKey,
    });
    setApiConnected(!!finnhubKey || !!alphaKey); // si alguna key está presente, consideramos conectado en dev
  }, []);

  // utilidad para pedir precio real (unificada y segura)
  async function obtenerPrecioRealUnificado(simbolo: string) {
    try {
      // commodities simuladas
      if (["GOLD", "SILVER", "OIL"].includes(simbolo)) {
        // simular precio aproximado
        const base = simbolo === "GOLD" ? 2725 : simbolo === "SILVER" ? 34 : 72;
        const vari = (Math.random() - 0.5) * base * 0.01;
        return Number((base + vari).toFixed(2));
      }

      // Forex -> Alpha Vantage
      if (/^[A-Z]{6}$/.test(simbolo) || simbolo.length === 6) {
        const from = simbolo.substring(0, 3);
        const to = simbolo.substring(3, 6);
        try {
          const data = await fetchAlphaForex(from, to);
          if (data && data["Realtime Currency Exchange Rate"]) {
            const val = parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
            return val;
          } else {
            // nota o throttle
            if (data && data.Note) {
              setApiErrors((s) => [...s, `Alpha limit: ${data.Note}`]);
              return null;
            }
            return null;
          }
        } catch (err) {
          setApiErrors((s) => [...s, `Alpha error: ${err.message}`]);
          return null;
        } finally {
          // throttle prudente
          await delay(config.throttleAlphaMs);
        }
      }

      // Acciones -> Finnhub
      const symbolMap: Record<string, string> = {
        EURUSD: "OANDA:EUR_USD",
        GBPUSD: "OANDA:GBP_USD",
        USDJPY: "OANDA:USD_JPY",
        AUDUSD: "OANDA:AUD_USD",
        USDCAD: "OANDA:USD_CAD",
        NZDUSD: "OANDA:NZD_USD",
      };
      const symbol = symbolMap[simbolo] || simbolo;
      const quote = await fetchFinnhubQuote(symbol);
      if (quote && quote.c) return quote.c;
      return null;
    } catch (err: any) {
      setApiErrors((s) => [...s, `${simbolo}: ${err.message}`]);
      return null;
    }
  }

  /* ---------------------------
     Escaneo completo (orquestado)
     --------------------------- */
  const ejecutarEscaneo = async (manualReason?: string) => {
    console.log("🔍 Ejecutando escaneo (dev)", { reason: manualReason });
    setIsLoading(true);
    setApiErrors([]);
    setOperacionesValidadas([]);
    setAgentes((p: any) => ({
      ...p,
      tecnico: { ...p.tecnico, estado: "ESCANEANDO", progreso: 0 },
      fundamental: { ...p.fundamental, estado: "ANALIZANDO", progreso: 0 },
      riesgo: { ...p.riesgo, estado: "CALCULANDO", progreso: 0 },
      adaptativo: { ...p.adaptativo, estado: "OPTIMIZANDO", progreso: 0 },
    }));

    const activosParaEscanear = [
      "EURUSD",
      "GBPUSD",
      "USDJPY",
      "AUDUSD",
      "USDCAD",
      "NZDUSD",
      "GOLD",
      "SILVER",
      "OIL",
      "AAPL",
      "MSFT",
      "GOOGL",
      "TSLA",
      "AMZN",
      "META",
      "NVDA",
    ];

    const operacionesEncontradas: Analisis[] = [];
    let activosEscaneados = 0;
    let progress = 0;

    for (const activo of activosParaEscanear) {
      try {
        const precio = await obtenerPrecioRealUnificado(activo);
        activosEscaneados++;
        progress = Math.min(100, progress + Math.round(100 / activosParaEscanear.length));
        setAgentes((prev: any) => ({
          ...prev,
          tecnico: { ...prev.tecnico, progreso: progress, operaciones: activosEscaneados },
          fundamental: { ...prev.fundamental, progreso: progress },
        }));

        if (!precio || precio <= 0) continue;

        // Ejecutar agentes en paralelo (tolerante a fallos)
        const [tec, fund] = await Promise.allSettled([
          tecnicoAgent(activo, precio, config),
          fundamentalAgent(activo, config),
        ]);

        const tecOut = tec.status === "fulfilled" ? tec.value : null;
        const fundOut = fund.status === "fulfilled" ? fund.value : null;

        // Si tecnico propone analisis y cumple prob -> evaluar riesgo + adaptativo
        if (tecOut?.analisis && tecOut.analisis.prob >= config.probMin) {
          // evaluar riesgo local
          const riskOut = await riesgoAgent([tecOut.analisis], config);
          const adaptOut = await adaptativoAgent(historialOperaciones, config);
          const orches = await orchestratorAgent(tecOut, fundOut, riskOut, adaptOut, config);

          // si orquestador permite, aceptar
          if (orches.decision === "EXECUTABLE") {
            operacionesEncontradas.push(tecOut.analisis);
            console.log("✅ Encontrada operación ejecutable:", tecOut.analisis.activo, "score", tecOut.analisis.score);
          } else {
            console.log("ℹ️ Orquestador rechazó:", activo, orches.razon);
          }
        }
      } catch (err: any) {
        console.error("Escaneo error", err);
        setApiErrors((s) => [...s, `Escaneo ${activo}: ${err.message}`]);
      }

      // Pequeña pausa para no saturar la UI
      await delay(300);
    }

    // ordenar y top N
    const topN = operacionesEncontradas.sort((a, b) => b.score - a.score).slice(0, config.maxOps);
    setOperacionesValidadas(topN);
    setPerformance((p: any) => ({ ...p, activosEscaneados }));

    // Actualizar agentes estado final
    setAgentes((prev: any) => ({
      ...prev,
      tecnico: { ...prev.tecnico, estado: topN.length > 0 ? "ACTIVO" : "ESPERANDO", progreso: 100, operaciones: activosEscaneados },
      fundamental: { ...prev.fundamental, estado: "ACTIVO", progreso: 100 },
      riesgo: { ...prev.riesgo, estado: "ACTIVO", progreso: 100 },
      adaptativo: { ...prev.adaptativo, estado: "APRENDIENDO", progreso: 100 },
    }));

    // Guardar topN en IndexedDB como registro de escaneo
    try {
      const registro = {
        id: `scan_${Date.now()}`,
        timestamp: new Date().toISOString(),
        top: topN,
        activosEscaneados,
        configSnapshot: config,
      };
      await idbPut(STORE_HISTORIAL, registro);
      const h = await idbGetAll(STORE_HISTORIAL);
      setHistorialOperaciones(h);
    } catch (err) {
      console.warn("IDB save error", err);
    }

    setLastScanTime(new Date().toLocaleString());
    setLastUpdate(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  /* ---------------------------
     Actualizar posiciones activas (ejemplo)
     - para Dev: actualiza P/L con precios actuales
     --------------------------- */
  useEffect(() => {
    let mounted = true;
    const actualizarPosiciones = async () => {
      if (posicionesActivas.length === 0) return;
      const updated = await Promise.all(
        posicionesActivas.map(async (pos) => {
          const precio = await obtenerPrecioRealUnificado(pos.activo);
          if (precio) {
            const multiplicador = pos.activo.includes("USD") ? 100000 : 100;
            const newPl = Math.round((precio - pos.entrada) * multiplicador);
            return { ...pos, actual: precio, pl: newPl };
          }
          return pos;
        })
      );
      if (mounted) setPosicionesActivas(updated);
      setLastUpdate(new Date().toLocaleTimeString());
    };

    if (apiConnected && posicionesActivas.length > 0) {
      actualizarPosiciones();
      const inter = setInterval(actualizarPosiciones, 300000); // 5min
      return () => {
        mounted = false;
        clearInterval(inter);
      };
    }
    return () => (mounted = false);
  }, [apiConnected, posicionesActivas]);

  /* ---------------------------
     Escaneo automático diario (dev)
     --------------------------- */
  useEffect(() => {
    if (!config.autoScan) return;
    const verificar = () => {
      const ahora = new Date();
      const horaActual = ahora.getHours().toString().padStart(2, "0") + ":" + ahora.getMinutes().toString().padStart(2, "0");
      const ultimo = localStorage.getItem("sentinela_ultimo_escaneo_dev");
      const hoy = new Date().toDateString();
      if (horaActual === config.horaEscaneo && ultimo !== hoy) {
        ejecutarEscaneo("auto");
        localStorage.setItem("sentinela_ultimo_escaneo_dev", hoy);
      }
    };
    verificar();
    const t = setInterval(verificar, 60000);
    return () => clearInterval(t);
  }, [config.autoScan, config.horaEscaneo, apiConnected]);

  /* ---------------------------
     Manejo de configuración y helper UI
     --------------------------- */
  const actualizarConfig = (campo: string, valor: any) => {
    setConfig((p: any) => ({ ...p, [campo]: valor }));
  };

  /* ---------------------------
     Métricas manuales (panel dev)
     - correlation (simple) entre dos activos (usa último historial si disponible)
     - winrate (historial)
     - top activos por score en último scan
     --------------------------- */
  const calcularCorrelacionSimple = async (a: string, b: string) => {
    // método simplificado: comparar precio serie usando historial de scans (dev)
    // Aquí solo devuelve un número aleatorio simulado para demo
    const corr = (Math.random() * 2 - 1).toFixed(2);
    // guardar métrica en IDB
    await idbPut(STORE_METRICAS, { key: `corr_${a}_${b}`, value: corr, ts: Date.now() });
    return parseFloat(corr);
  };

  const calcularWinRate = () => {
    const wins = historialOperaciones.reduce((acc, reg: any) => acc + (reg.top?.filter((t: any) => t.resultado === "WIN")?.length || 0), 0);
    const total = historialOperaciones.reduce((acc, reg: any) => acc + (reg.top?.length || 0), 0);
    return total === 0 ? 0 : (wins / total) * 100;
  };

  /* ---------------------------
     UI (Dev) - mantuve tu layout y agregué controles dev
     --------------------------- */

  const TabButton: React.FC<{ id: string; icon: any; label: string; badge?: number }> = ({ id, icon: Icon, label, badge = 0 }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded font-medium ${activeTab === id ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}>
      <Icon size={16} />
      <span>{label}</span>
      {badge > 0 && <span className="ml-2 bg-red-500 text-xs rounded-full px-2">{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-gradient-to-r from-orange-900/50 to-red-900/50 p-6 rounded-lg border border-orange-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 p-3 rounded-lg">
                <Shield size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">SENTINELA — DEV</h1>
                <p className="text-gray-300">Modo desarrollo: logs y métricas para pruebas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => ejecutarEscaneo("manual_ui")}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded font-bold ${isLoading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                {isLoading ? "Escaneando..." : "Escanear Ahora"}
              </button>
              <div>
                {apiConnected ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <Wifi size={16} />
                    <span className="text-sm">APIs</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <WifiOff size={16} />
                    <span className="text-sm">Modo Demo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-6 flex-wrap text-sm text-gray-300">
            <div className="flex items-center gap-2"><Clock size={14} /> Escaneo: {config.horaEscaneo}</div>
            <div className="flex items-center gap-2"><Eye size={14} /> TF: {config.timeframes.join(", ")}</div>
            <div>Última actualización: {lastUpdate}</div>
            {lastScanTime && <div className="text-green-400">Último escaneo: {lastScanTime}</div>}
          </div>

          {apiErrors.length > 0 && (
            <div className="mt-3 p-2 bg-red-900/30 border border-red-600 rounded text-xs">
              <p className="font-bold text-red-400 mb-1">⚠️ Errores de API:</p>
              {apiErrors.slice(0, 4).map((e, i) => (
                <p key={i} className="text-gray-300">• {e}</p>
              ))}
            </div>
          )}
        </div>

        {/* Agents summary */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-4 bg-blue-900 rounded border border-blue-600">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={18} />
              <div className="font-bold">Agente Técnico</div>
            </div>
            <div className="text-xs text-gray-300">Estado: {agentes.tecnico.estado}</div>
            <div className="text-xs text-gray-300">Operaciones: {agentes.tecnico.operaciones}</div>
          </div>

          <div className="p-4 bg-purple-900 rounded border border-purple-600">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={18} />
              <div className="font-bold">Agente Fundamental</div>
            </div>
            <div className="text-xs text-gray-300">Estado: {agentes.fundamental.estado}</div>
          </div>

          <div className="p-4 bg-orange-900 rounded border border-orange-600">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={18} />
              <div className="font-bold">Agente Riesgo</div>
            </div>
            <div className="text-xs text-gray-300">Posiciones max: {agentes.riesgo.posicionesMax || config.maxOps}</div>
          </div>

          <div className="p-4 bg-green-900 rounded border border-green-600">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={18} />
              <div className="font-bold">IA Adaptativa</div>
            </div>
            <div className="text-xs text-gray-300">Estado: {agentes.adaptativo.estado}</div>
          </div>
        </div>

        {/* Controls tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <TabButton id="dashboard" icon={Activity} label="Dashboard" />
          <TabButton id="operaciones" icon={TrendingUp} label="Operaciones" badge={operacionesValidadas.length} />
          <TabButton id="posiciones" icon={Clock} label="Posiciones" badge={posicionesActivas.length} />
          <TabButton id="historial" icon={BarChart3} label="Historial" badge={historialOperaciones.length} />
          <TabButton id="ia" icon={Brain} label="IA" />
          <TabButton id="config" icon={Settings} label="Configuración" />
        </div>

        {/* Main content */}
        <div className="bg-gray-800 rounded p-6 border border-gray-700">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900 rounded border border-gray-700">
                  <div className="text-sm text-gray-400">Capital Actual</div>
                  <div className="text-2xl font-bold text-green-400">${performance.capitalActual.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-gray-900 rounded border border-gray-700">
                  <div className="text-sm text-gray-400">Ganancia Total</div>
                  <div className="text-2xl font-bold text-green-400">${performance.gananciaTotal.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-gray-900 rounded border border-gray-700">
                  <div className="text-sm text-gray-400">Win Rate</div>
                  <div className="text-2xl font-bold text-blue-400">{performance.winRate.toFixed(1)}%</div>
                </div>
                <div className="p-4 bg-gray-900 rounded border border-gray-700">
                  <div className="text-sm text-gray-400">Activos Escaneados</div>
                  <div className="text-2xl font-bold text-orange-400">{performance.activosEscaneados}</div>
                </div>
              </div>

              <div className="bg-orange-900/20 p-4 rounded border border-orange-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Resumen del Último Escaneo</h2>
                    <p className="text-sm text-gray-300">{lastScanTime ? `Último escaneo: ${lastScanTime}` : "No se ha ejecutado escaneo aún."}</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{operacionesValidadas.length}/{config.maxOps}</div>
                    <div className="text-sm text-gray-400">Operaciones validadas</div>
                  </div>
                </div>
              </div>

              {operacionesValidadas.length > 0 ? (
                operacionesValidadas.map((op, i) => (
                  <div key={op.activo + i} className="bg-gray-700 p-4 rounded border border-gray-600">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-2xl font-bold">{op.activo}</div>
                        <div className="text-sm text-gray-400">{op.tipo} • Score {op.score} • Prob {op.prob}%</div>
                      </div>
                      <div className={`px-3 py-1 rounded ${op.accion === "COMPRA" ? "bg-green-600" : "bg-red-600"}`}>{op.accion}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 bg-gray-700 rounded">
                  <AlertCircle size={48} className="mx-auto text-red-400" />
                  <div className="text-gray-300 mt-4">No hay operaciones validadas aún. Ejecuta un escaneo para probar.</div>
                </div>
              )}
            </div>
          )}

          {activeTab === "operaciones" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Operaciones Validadas ({operacionesValidadas.length})</h2>
              {operacionesValidadas.length === 0 ? (
                <div className="p-6 bg-gray-700 rounded text-center">Sin operaciones validadas</div>
              ) : operacionesValidadas.map((op, idx) => (
                <div key={op.activo + idx} className="bg-gray-700 p-4 rounded border border-gray-600">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-lg font-bold">{op.activo}</div>
                      <div className="text-sm text-gray-400">{op.razon}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Entrada</div>
                      <div className="font-mono font-bold">{op.entrada}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "posiciones" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Posiciones Activas ({posicionesActivas.length})</h2>
              {posicionesActivas.length === 0 ? (
                <div className="p-6 bg-gray-700 rounded text-center">No hay posiciones activas</div>
              ) : posicionesActivas.map((p, i) => (
                <div key={i} className="bg-gray-700 p-4 rounded border border-gray-600 mb-2">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold">{p.activo}</div>
                      <div className="text-sm text-gray-400">{p.tiempo}</div>
                    </div>
                    <div className="text-right">
                      <div className={`${p.pl >= 0 ? "text-green-400" : "text-red-400"} font-bold`}>${p.pl}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "historial" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Historial de Escaneos ({historialOperaciones.length})</h2>
              {historialOperaciones.length === 0 ? (
                <div className="p-6 bg-gray-700 rounded text-center">Sin historial</div>
              ) : historialOperaciones.map((h: any) => (
                <div key={h.id} className="bg-gray-700 p-4 rounded border border-gray-600 mb-2">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold">Escaneo: {new Date(h.timestamp).toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Activos escaneados: {h.activosEscaneados}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Top: {h.top?.length || 0}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "ia" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Agente IA Orquestador (Dev)</h2>
              <p className="text-sm text-gray-300">Controla fusión de agentes y métricas adaptativas.</p>

              <div className="bg-gray-700 p-4 rounded border border-gray-600">
                <div className="flex gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Historial entries</div>
                    <div className="text-2xl font-bold text-green-400">{historialOperaciones.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">WinRate aproximado</div>
                    <div className="text-2xl font-bold text-blue-400">{calcularWinRate().toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded border border-gray-600">
                <h3 className="font-bold mb-3">Métricas manuales</h3>
                <ManualMetricsPanel calcularCorrelacionSimple={calcularCorrelacionSimple} />
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Configuración (Dev)</h2>

              <div className="bg-gray-700 p-4 rounded border border-gray-600">
                <label className="text-sm text-gray-400">Capital inicial</label>
                <input
                  type="number"
                  value={config.capital}
                  onChange={(e) => actualizarConfig("capital", Math.max(0, parseInt(e.target.value || "0")))}
                  className="w-full bg-gray-900 p-2 rounded mt-2"
                />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div>
                    <label className="text-sm text-gray-400">Riesgo (%)</label>
                    <input type="number" value={config.riesgo} onChange={(e) => actualizarConfig("riesgo", Math.max(0, parseFloat(e.target.value || "1")))} className="w-full bg-gray-900 p-2 rounded mt-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Prob Min (%)</label>
                    <input type="number" value={config.probMin} onChange={(e) => actualizarConfig("probMin", Math.max(0, parseInt(e.target.value || "70")))} className="w-full bg-gray-900 p-2 rounded mt-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">RR Min</label>
                    <input type="number" value={config.rrMin} onChange={(e) => actualizarConfig("rrMin", Math.max(1, parseFloat(e.target.value || "2")))} className="w-full bg-gray-900 p-2 rounded mt-2" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-400">Hora Escaneo</label>
                  <input type="time" value={config.horaEscaneo} onChange={(e) => actualizarConfig("horaEscaneo", e.target.value)} className="bg-gray-900 p-2 rounded w-40 mt-2" />
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-400">Auto Scan</label>
                  <input type="checkbox" checked={config.autoScan} onChange={(e) => actualizarConfig("autoScan", e.target.checked)} className="ml-2" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------
   Panel de métricas manuales (subcomponente)
   --------------------------- */
const ManualMetricsPanel: React.FC<{ calcularCorrelacionSimple: (a: string, b: string) => Promise<number> }> = ({ calcularCorrelacionSimple }) => {
  const [a, setA] = useState("EURUSD");
  const [b, setB] = useState("GBPUSD");
  const [corr, setCorr] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const runCorr = async () => {
    setLoading(true);
    const r = await calcularCorrelacionSimple(a, b);
    setCorr(r);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <input value={a} onChange={(e) => setA(e.target.value.toUpperCase())} className="bg-gray-900 p-2 rounded" />
        <input value={b} onChange={(e) => setB(e.target.value.toUpperCase())} className="bg-gray-900 p-2 rounded" />
        <button onClick={runCorr} className="bg-blue-600 px-3 py-2 rounded">Calcular Correlación</button>
      </div>
      {loading ? <div className="text-sm text-gray-400 mt-2">Calculando...</div> : corr !== null ? <div className="mt-2 text-sm">Correlación ({a} / {b}): <strong>{corr.toFixed(2)}</strong></div> : null}
    </div>
  );
};

export default SentinelaDev;
