/* src/IADashboard.jsx */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { Brain } from "lucide-react";

export default function IADashboard() {
  const [summary, setSummary] = useState(null);
  const [agents, setAgents] = useState([]);
  const [top10, setTop10] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, a, t, m, h] = await Promise.all([
          axios.get("/api/ia/summary"),
          axios.get("/api/ia/agents"),
          axios.get("/api/ia/top10"),
          axios.get("/api/ia/metrics"),
          axios.get("/api/ia/history")
        ]);
        setSummary(s.data);
        setAgents(a.data);
        setTop10(t.data);
        setMetrics(m.data);
        setHistory(h.data);
      } catch (err) {
        console.error("Error cargando datos IA:", err);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-slate-100 rounded">
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Brain /> Dashboard de Control de IA</h1>
        <p className="text-sm text-slate-400">
          Monitor personal — prueba 10 días hábiles. Última actualización: {summary?.lastUpdated || "—"}
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Top 10 Activos Seleccionados</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-300">
                <tr>
                  <th className="py-2">Símbolo</th>
                  <th>Prob. Éxito</th>
                  <th>RR</th>
                  <th>Señal</th>
                </tr>
              </thead>
              <tbody>
                {top10.length === 0 ? (
                  <tr><td colSpan="4" className="py-6 text-center text-slate-400">Cargando top10...</td></tr>
                ) : (
                  top10.map((row, i) => (
                    <tr key={i} className="border-t border-slate-700">
                      <td className="py-3">{row.symbol}</td>
                      <td>{Math.round(row.prob*100)}%</td>
                      <td>{row.rr}</td>
                      <td>{row.signal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 flex flex-col gap-3">
          <div>
            <h3 className="text-slate-300 text-sm">Tasa de acierto</h3>
            <div className="text-2xl font-bold">{summary ? `${Math.round(summary.accuracy*100)}%` : "—"}</div>
          </div>
          <div>
            <h3 className="text-slate-300 text-sm">Agentes activos</h3>
            <div className="text-xl font-semibold">{agents.length}</div>
          </div>
          <div>
            <h3 className="text-slate-300 text-sm">Peso adaptativo promedio</h3>
            <div className="text-xl font-semibold">{summary ? summary.avgWeight.toFixed(2) : "—"}</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Agentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agents.length === 0 ? (
              <div className="text-slate-400">Cargando agentes...</div>
            ) : agents.map((ag, i) => (
              <div key={i} className="bg-slate-700 rounded p-3">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{ag.name}</div>
                    <div className="text-xs text-slate-300">{ag.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{Math.round(ag.accuracy*100)}%</div>
                    <div className="text-xs text-slate-300">Peso {ag.weight.toFixed(2)}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-slate-300">Observación</div>
                  <div className="text-sm">{ag.note || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Métricas del ecosistema</h2>
          <div className="mb-4">
            <div className="text-sm text-slate-300">Entropía de decisión (últimos días)</div>
            <div style={{ height: 120 }}>
              {metrics?.entropy ? (
                <ResponsiveContainer width="100%" height="100%"><LineChart data={metrics.entropy}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#69b2ff" strokeWidth={2} dot={false}/>
                </LineChart></ResponsiveContainer>
              ) : (
                <div className="text-slate-400 py-8 text-center">Cargando...</div>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-300">Evolución de pesos adaptativos</div>
            <div style={{ height: 120 }}>
              {metrics?.weights ? (
                <ResponsiveContainer width="100%" height="100%"><BarChart data={metrics.weights}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="avg" barSize={12} />
                </BarChart></ResponsiveContainer>
              ) : <div className="text-slate-400 py-8 text-center">Cargando...</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Observaciones y Alertas</h3>
          <ul className="list-disc ml-5 text-slate-300">
            {summary?.alerts?.length ? summary.alerts.map((a, i) => (
              <li key={i} className="mb-2">{a}</li>
            )) : <li className="text-slate-400">Sin alertas</li>}
          </ul>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Histórico (últimos 10)</h3>
          <div className="text-sm text-slate-300">
            {history.length === 0 ? (
              <div className="text-slate-400">Cargando historial...</div>
            ) : (
              <table className="w-full text-left">
                <thead className="text-slate-400 text-xs">
                  <tr>
                    <th>Día</th><th>Acierto</th><th>Top10%</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-t border-slate-700">
                      <td className="py-2">{h.day}</td>
                      <td>{Math.round(h.accuracy*100)}%</td>
                      <td>{h.topMean ? `${Math.round(h.topMean*100)}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
