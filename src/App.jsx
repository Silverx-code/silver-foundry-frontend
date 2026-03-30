import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG ────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const T = {
  bg: "#07080F",
  surface: "#0D0F1C",
  card: "#12152A",
  border: "#1C2040",
  muted: "#2A2F5A",
  accent: "#5B8CFF",
  accentGlow: "#5B8CFF33",
  gold: "#F4C430",
  green: "#34D399",
  red: "#F87171",
  yellow: "#FBBF24",
  text: "#E8EAF6",
  dim: "#6B7194",
  silver: "#C0C8E8",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${T.bg};
    color: ${T.text};
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.muted}; border-radius: 99px; }

  ::selection { background: ${T.accentGlow}; color: ${T.accent}; }

  @keyframes float-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 ${T.accent}44; } 60% { box-shadow: 0 0 0 10px ${T.accent}00; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes slide-in { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes glow-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }

  .fade { animation: float-up .4s ease both; }
  .slide { animation: slide-in .3s ease both; }

  .mono { font-family: 'JetBrains Mono', monospace !important; }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; gap:7px; border:none; border-radius:10px; cursor:pointer; font-family:'Syne',sans-serif; font-weight:600; font-size:13px; transition:all .2s; }
  .btn-accent { background:${T.accent}; color:#fff; padding:10px 20px; }
  .btn-accent:hover { background:#7AA4FF; transform:translateY(-1px); box-shadow:0 8px 24px ${T.accentGlow}; }
  .btn-accent:disabled { opacity:.35; cursor:not-allowed; transform:none; box-shadow:none; }
  .btn-ghost { background:transparent; color:${T.dim}; border:1px solid ${T.border}; padding:9px 16px; }
  .btn-ghost:hover { border-color:${T.accent}55; color:${T.text}; }
  .btn-danger { background:${T.red}22; color:${T.red}; border:1px solid ${T.red}33; padding:7px 12px; }
  .btn-danger:hover { background:${T.red}33; }

  /* Cards */
  .card { background:${T.card}; border:1px solid ${T.border}; border-radius:16px; padding:24px; }
  .card-sm { background:${T.card}; border:1px solid ${T.border}; border-radius:12px; padding:16px; }

  /* Nav */
  .nav-link { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; cursor:pointer; font-size:13.5px; font-weight:500; color:${T.dim}; transition:all .15s; position:relative; }
  .nav-link:hover { background:${T.border}; color:${T.text}; }
  .nav-link.active { background:${T.accent}18; color:${T.accent}; }
  .nav-link.active::before { content:''; position:absolute; left:0; top:20%; height:60%; width:3px; background:${T.accent}; border-radius:0 2px 2px 0; }

  /* Tags */
  .tag { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
  .tag-green { background:${T.green}18; color:${T.green}; }
  .tag-blue { background:${T.accent}18; color:${T.accent}; }
  .tag-yellow { background:${T.yellow}18; color:${T.yellow}; }
  .tag-red { background:${T.red}18; color:${T.red}; }

  /* Inputs */
  input[type=text], input[type=number], select, textarea {
    background:${T.surface}; border:1px solid ${T.border}; color:${T.text};
    padding:10px 14px; border-radius:10px; font-family:'Syne',sans-serif; font-size:13px; width:100%; outline:none; transition:border-color .2s;
  }
  input[type=text]:focus, input[type=number]:focus, select:focus, textarea:focus { border-color:${T.accent}66; box-shadow:0 0 0 3px ${T.accentGlow}; }
  input[type=file] { display:none; }
  label.field-label { font-size:11px; color:${T.dim}; font-weight:600; letter-spacing:.08em; display:block; margin-bottom:6px; text-transform:uppercase; }

  /* Progress */
  .prog-track { height:5px; background:${T.muted}33; border-radius:99px; overflow:hidden; }
  .prog-fill { height:100%; background:linear-gradient(90deg,${T.accent},#A78BFA); border-radius:99px; transition:width .5s ease; }

  /* Upload zone */
  .drop-zone { border:2px dashed ${T.muted}; border-radius:14px; padding:44px 24px; text-align:center; cursor:pointer; transition:all .2s; background:${T.surface}; }
  .drop-zone:hover,.drop-zone.over { border-color:${T.accent}; background:${T.accentGlow}; }

  /* Log */
  .log-wrap { background:${T.surface}; border:1px solid ${T.border}; border-radius:12px; padding:14px; max-height:220px; overflow-y:auto; }
  .log-line { font-family:'JetBrains Mono',monospace; font-size:11.5px; color:${T.dim}; padding:2.5px 0; border-bottom:1px solid ${T.border}22; animation:slide-in .25s ease; }
  .log-line.g { color:${T.green}; }
  .log-line.y { color:${T.yellow}; }
  .log-line.r { color:${T.red}; }

  /* Spinner */
  .spin { width:14px;height:14px; border:2px solid ${T.accent}33; border-top-color:${T.accent}; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; flex-shrink:0; }

  /* Grid helpers */
  .g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

  /* Table */
  .cmp-table { width:100%; border-collapse:collapse; }
  .cmp-table th { font-size:11px; color:${T.dim}; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:10px 14px; text-align:left; border-bottom:2px solid ${T.border}; background:${T.surface}; }
  .cmp-table td { padding:12px 14px; font-size:13px; border-bottom:1px solid ${T.border}33; vertical-align:top; }
  .cmp-table tr:hover td { background:${T.border}22; }
  .cmp-table th:first-child { border-radius:10px 0 0 0; }
  .cmp-table th:last-child { border-radius:0 10px 0 0; }

  /* Cursor blink */
  .cursor { display:inline-block; width:7px; height:13px; background:${T.accent}; animation:blink 1s step-end infinite; vertical-align:middle; border-radius:1px; margin-left:3px; }

  /* Metric ring container */
  .ring-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; }

  /* Sidebar badge */
  .badge { background:${T.accent}22; color:${T.accent}; border-radius:999px; padding:1px 8px; font-size:11px; font-weight:700; margin-left:auto; }

  /* Silver brand tag */
  .silver-brand { font-family:'JetBrains Mono',monospace; font-size:10px; color:${T.silver}; letter-spacing:.15em; }
`;

// ─── SVG Icons ──────────────────────────────────────────────
const Ic = ({ n, s = 16, c = "currentColor" }) => {
  const d = {
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
    cpu: "M9 3H7a2 2 0 00-2 2v2M9 3h6M9 3v2M15 3h2a2 2 0 012 2v2M21 9v6M21 15v2a2 2 0 01-2 2h-2M15 21H9M9 21H7a2 2 0 01-2-2v-2M3 15V9",
    chart: "M18 20V10M12 20V4M6 20v-6",
    rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z",
    clock: "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    trash: "M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2",
    copy: "M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2v-2M16 4h2a2 2 0 012 2v8M11 14l5-5M16 9h-5v5",
    file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6",
    vs: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
    link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    db: "M4 6c0 1.66 3.58 3 8 3s8-1.34 8-3-3.58-3-8-3-8 1.34-8 3zM4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d[n]}/></svg>;
};

// ─── Mini ring chart ────────────────────────────────────────
const Ring = ({ pct, label, color = T.accent, size = 80 }) => {
  const r = size / 2 - 8, cx = size / 2, circ = 2 * Math.PI * r;
  return (
    <div className="ring-wrap">
      <svg width={size} height={size}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={T.muted + "44"} strokeWidth="6"/>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
          strokeLinecap="round" transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: "stroke-dasharray 1.2s ease" }}/>
        <text x={cx} y={cx + 5} textAnchor="middle" fill={color}
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: size * 0.18, fontWeight: 700 }}>
          {pct}%
        </text>
      </svg>
      {label && <div style={{ fontSize: 11, color: T.dim, marginTop: 4, textAlign: "center" }}>{label}</div>}
    </div>
  );
};

// ─── Bar sparkline ──────────────────────────────────────────
const Spark = ({ data, color = T.accent, h = 44 }) => {
  const mx = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: h }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: `${(v / mx) * 100}%`,
          background: i === data.length - 1 ? color : color + "44",
          borderRadius: "3px 3px 0 0",
          transition: `height .6s ease ${i * 40}ms`,
        }}/>
      ))}
    </div>
  );
};

// ─── Comparison Table Data ──────────────────────────────────
const CMP_DATA = [
  {
    feature: "Platform Name",
    silver: "Silver AI Foundry Lite",
    azure: "Azure Machine Learning Studio",
    winner: "tie",
    note: "Silver is purpose-built; Azure is enterprise-grade.",
  },
  {
    feature: "Cost",
    silver: "100% Free (Render + Supabase + Vercel free tiers)",
    azure: "Pay-as-you-go — compute clusters from $0.10–$3/hr",
    winner: "silver",
    note: "Silver wins on zero cost for prototyping.",
  },
  {
    feature: "ML Training",
    silver: "scikit-learn (Random Forest, Logistic Reg, K-Means) via Python on Render",
    azure: "AutoML, custom scripts, PyTorch, TensorFlow, HuggingFace",
    winner: "azure",
    note: "Azure supports GPU, deep learning, and AutoML at scale.",
  },
  {
    feature: "Dataset Storage",
    silver: "Supabase Storage (free 1GB) + PostgreSQL metadata",
    azure: "Azure Blob Storage — scales to petabytes, $0.02/GB",
    winner: "azure",
    note: "Azure scales to enterprise workloads.",
  },
  {
    feature: "Model Deployment",
    silver: "REST endpoint via Express on Render (cold-starts apply)",
    azure: "Managed endpoints with AKS, auto-scaling, SLA guarantees",
    winner: "azure",
    note: "Azure has production-grade SLAs.",
  },
  {
    feature: "Experiment Tracking",
    silver: "Supabase DB — stores name, model, accuracy, timestamp",
    azure: "MLflow integration, full run history, artifact versioning",
    winner: "azure",
    note: "Azure MLflow is significantly more powerful.",
  },
  {
    feature: "Setup Time",
    silver: "~30 min (clone repo → deploy to Render/Vercel/Supabase)",
    azure: "1–3 hrs (workspace setup, IAM, compute cluster config)",
    winner: "silver",
    note: "Silver is dramatically faster to get running.",
  },
  {
    feature: "Auth / Security",
    silver: "Supabase Auth (JWT, email, OAuth)",
    azure: "Azure AD, RBAC, private networks, compliance certs",
    winner: "azure",
    note: "Azure has enterprise-grade compliance (SOC2, HIPAA).",
  },
  {
    feature: "GPU Support",
    silver: "None (CPU only on Render free tier)",
    azure: "Full GPU cluster support (NVIDIA A100, V100, etc.)",
    winner: "azure",
    note: "Required for deep learning; Silver is CPU-only.",
  },
  {
    feature: "Real-time Training Logs",
    silver: "Simulated poll via /status endpoint (5s interval)",
    azure: "Live streaming logs, Azure Monitor integration",
    winner: "azure",
    note: "Azure streams real logs; Silver polls.",
  },
  {
    feature: "CI/CD Integration",
    silver: "Render auto-deploys from GitHub",
    azure: "Azure DevOps, GitHub Actions, MLOps pipelines",
    winner: "azure",
    note: "Azure has full MLOps lifecycle support.",
  },
  {
    feature: "Supported File Types",
    silver: "CSV, JSON",
    azure: "CSV, JSON, Parquet, Avro, images, DICOM, and more",
    winner: "azure",
    note: "Azure handles complex multi-modal data.",
  },
  {
    feature: "Best For",
    silver: "Students, indie devs, prototyping, learning ML pipelines",
    azure: "Enterprise, production ML, regulated industries",
    winner: "tie",
    note: "Different audiences entirely.",
  },
];

// ─── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [expName, setExpName] = useState("");
  const [modelType, setModelType] = useState("classification");
  const [trainState, setTrainState] = useState("idle"); // idle|running|done|error
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [experiments, setExperiments] = useState([
    { id: "exp-001", name: "iris-v1", model: "classification", accuracy: 96.7, loss: 0.072, f1: 95.4, date: "Mar 28 2026", status: "done" },
    { id: "exp-002", name: "churn-baseline", model: "regression", accuracy: 88.3, loss: 0.142, f1: 87.1, date: "Mar 25 2026", status: "done" },
  ]);
  const [cmpFilter, setCmpFilter] = useState("all");

  const fileRef = useRef();
  const logRef = useRef();

  const addLog = (msg, type = "") =>
    setLogs(p => [...p.slice(-60), { msg, type, id: Date.now() + Math.random() }]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  // Simulate full training pipeline (real version polls GET /status/:jobId)
  const runTraining = useCallback(() => {
    if (!file) return;
    const name = expName || file.name.replace(/\.\w+$/, "");
    setTrainState("running"); setProgress(0); setLogs([]); setMetrics(null);
    setTab("train");

    const steps = [
      [300,  "default", "→ Booting Silver AI Foundry runtime v1.0…", 5],
      [800,  "default", `→ Loading dataset: ${file.name} (${(file.size/1024).toFixed(1)} KB)`, 14],
      [1400, "default", "→ Validating schema & detecting feature types…", 22],
      [2000, "default", "→ Splitting dataset: 80% train / 20% test", 31],
      [2700, "y",       `→ Instantiating ${modelType === "classification" ? "RandomForestClassifier(n_estimators=100)" : modelType === "regression" ? "LinearRegression()" : "KMeans(n_clusters=3)"}`, 42],
      [3500, "y",       "→ Fitting model on training set…", 56],
      [4400, "y",       "→ Running 5-fold cross-validation…", 68],
      [5200, "default", "→ Evaluating on held-out test set…", 78],
      [5900, "default", "→ Computing confusion matrix…", 87],
      [6500, "default", "→ Serialising model artefact to Supabase…", 93],
    ];

    steps.forEach(([ms, type, msg, pct]) =>
      setTimeout(() => { addLog(msg, type); setProgress(pct); }, ms)
    );

    setTimeout(() => {
      const acc = parseFloat((87 + Math.random() * 11).toFixed(1));
      const loss = parseFloat((0.04 + Math.random() * 0.16).toFixed(4));
      const f1 = parseFloat((acc - 1.4 - Math.random()).toFixed(1));
      const precision = parseFloat((acc - 0.8).toFixed(1));
      const recall = parseFloat((acc - 1.9).toFixed(1));
      const history = Array.from({ length: 8 }, (_, i) =>
        parseFloat((acc * (0.72 + i * 0.033)).toFixed(1))
      );
      history[history.length - 1] = acc;

      addLog(`✓ Training complete — Accuracy: ${acc}%`, "g");
      addLog(`✓ F1: ${f1}%  Precision: ${precision}%  Recall: ${recall}%`, "g");
      addLog(`✓ Model saved — Job ID: silver-${Date.now().toString(36).toUpperCase()}`, "g");
      setProgress(100);
      setTrainState("done");
      const newId = "exp-" + Date.now();
      setJobId(newId);
      const m = { accuracy: acc, loss, f1, precision, recall, history };
      setMetrics(m);
      setExperiments(p => [{ id: newId, name, model: modelType, accuracy: acc, loss, f1, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), status: "done" }, ...p]);
      setTimeout(() => setTab("results"), 700);
    }, 7200);
  }, [file, expName, modelType]);

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f) setFile(f);
  };

  const endpointUrl = jobId ? `${API_BASE}/predict/${jobId}` : null;

  const copyUrl = () => { navigator.clipboard.writeText(endpointUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const deleteExp = (id) => {
    setExperiments(p => p.filter(e => e.id !== id));
    setDeleteConfirm(null);
  };

  const steps = [
    { key: "upload", label: "Upload", icon: "upload" },
    { key: "train",  label: "Train",  icon: "cpu"    },
    { key: "results",label: "Results",icon: "chart"  },
    { key: "deploy", label: "Deploy", icon: "rocket" },
  ];
  const activeStep = steps.findIndex(s => s.key === tab);

  const filteredCmp = cmpFilter === "all" ? CMP_DATA
    : cmpFilter === "silver" ? CMP_DATA.filter(r => r.winner === "silver")
    : cmpFilter === "azure"  ? CMP_DATA.filter(r => r.winner === "azure")
    : CMP_DATA.filter(r => r.winner === "tie");

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* ══ SIDEBAR ══════════════════════════════════════ */}
        <aside style={{ width: 230, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "22px 12px", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ paddingLeft: 6, marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="zap" s={18} c="#fff"/>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-.03em", lineHeight: 1 }}>Silver AI</div>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-.03em", color: T.accent, lineHeight: 1 }}>Foundry</div>
              </div>
            </div>
            <div className="silver-brand" style={{ marginTop: 6, paddingLeft: 2 }}>BY SILVER · FREE TIER</div>
          </div>

          {/* Pipeline steps */}
          <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: ".12em", marginBottom: 8, paddingLeft: 6 }}>ML PIPELINE</div>
          {steps.map((s, i) => {
            const done = i < activeStep || (trainState === "done" && s.key !== "deploy");
            const active = s.key === tab;
            const locked = i > activeStep && !(trainState === "done");
            return (
              <div key={s.key} className={`nav-link ${active ? "active" : ""}`}
                style={{ opacity: locked ? .35 : 1 }}
                onClick={() => !locked && setTab(s.key)}>
                <div style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? T.green + "22" : active ? T.accent + "22" : T.border,
                  color: done ? T.green : active ? T.accent : T.dim, flexShrink: 0 }}>
                  {done ? <Ic n="check" s={13} c={T.green}/> : <Ic n={s.icon} s={13}/>}
                </div>
                <span>{s.label}</span>
                {active && trainState === "running" && <div className="spin" style={{ marginLeft: "auto" }}/>}
              </div>
            );
          })}

          <hr style={{ border: "none", borderTop: `1px solid ${T.border}`, margin: "16px 0" }}/>

          <div className={`nav-link ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
            <div style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: T.border }}><Ic n="clock" s={13}/></div>
            Experiments
            <span className="badge">{experiments.length}</span>
          </div>

          <div className={`nav-link ${tab === "compare" ? "active" : ""}`} onClick={() => setTab("compare")}>
            <div style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: T.border }}><Ic n="vs" s={13}/></div>
            vs Azure
          </div>

          {/* Quota */}
          <div style={{ marginTop: "auto", padding: "14px 6px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.dim, marginBottom: 6 }}>
              <span>Free tier</span>
              <span className="mono" style={{ color: T.accent }}>{experiments.length}/10</span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${experiments.length * 10}%` }}/>
            </div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>Experiments used this month</div>
          </div>
        </aside>

        {/* ══ MAIN ══════════════════════════════════════════ */}
        <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxWidth: "calc(100vw - 230px)" }}>

          {/* Page header */}
          <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.04em" }}>
                {tab === "upload"  && "Upload Dataset"}
                {tab === "train"   && "Training Console"}
                {tab === "results" && "Model Results"}
                {tab === "deploy"  && "Deploy API"}
                {tab === "history" && "Experiment History"}
                {tab === "compare" && "Silver AI Foundry vs Azure ML"}
              </h1>
              <p style={{ color: T.dim, fontSize: 13, marginTop: 4 }}>
                {tab === "upload"  && "Drop a CSV or JSON file — Silver handles the rest"}
                {tab === "train"   && "Real-time training via scikit-learn on Render"}
                {tab === "results" && "Full performance breakdown for your trained model"}
                {tab === "deploy"  && "One-click REST API deployment with Render"}
                {tab === "history" && "All your past experiments, searchable and deletable"}
                {tab === "compare" && "Feature-by-feature comparison against Azure Machine Learning"}
              </p>
            </div>
            {trainState === "done" && (
              <span className="tag tag-green fade"><Ic n="check" s={11} c={T.green}/> Model Ready</span>
            )}
          </div>

          {/* ─── UPLOAD ─────────────────────────────────── */}
          {tab === "upload" && (
            <div className="fade" style={{ maxWidth: 560 }}>
              <div className={`drop-zone ${drag ? "over" : ""}`}
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}>
                <input type="file" ref={fileRef} accept=".csv,.json" onChange={handleDrop}/>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                {file ? (
                  <>
                    <div style={{ color: T.accent, fontWeight: 700, fontSize: 15 }}>{file.name}</div>
                    <div style={{ color: T.dim, fontSize: 12, marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB · Click to replace</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Drop CSV or JSON here</div>
                    <div style={{ color: T.dim, fontSize: 13, marginTop: 6 }}>or click to browse — max 5MB on free tier</div>
                  </>
                )}
              </div>

              {file && (
                <div className="card fade" style={{ marginTop: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <Ic n="settings" s={17} c={T.accent}/>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Configure Experiment</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label className="field-label">Experiment Name</label>
                      <input type="text"
                        placeholder={file.name.replace(/\.\w+$/, "") + "-run-1"}
                        value={expName} onChange={e => setExpName(e.target.value)}/>
                    </div>
                    <div>
                      <label className="field-label">Algorithm</label>
                      <select value={modelType} onChange={e => setModelType(e.target.value)}>
                        <option value="classification">Classification — Random Forest</option>
                        <option value="regression">Regression — Linear Regression</option>
                        <option value="clustering">Clustering — K-Means (k=3)</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                    <button className="btn btn-accent" onClick={runTraining}>
                      <Ic n="cpu" s={15} c="#fff"/> Start Training
                    </button>
                    <button className="btn btn-ghost" onClick={() => { setFile(null); setExpName(""); }}>
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── TRAIN ─────────────────────────────────── */}
          {tab === "train" && (
            <div className="fade" style={{ maxWidth: 640 }}>
              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Training Job</span>
                  {trainState === "running" && <div style={{ display: "flex", alignItems: "center", gap: 7 }}><div className="spin"/><span style={{ fontSize: 12, color: T.dim }}>Running…</span></div>}
                  {trainState === "done"    && <span className="tag tag-green"><Ic n="check" s={11} c={T.green}/> Done</span>}
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${progress}%` }}/>
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: T.dim }}>{file?.name} · {modelType}</span>
                  <span className="mono" style={{ fontSize: 12, color: T.accent }}>{progress}%</span>
                </div>
              </div>

              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: T.dim, fontWeight: 600, letterSpacing: ".06em" }}>LIVE LOG</span>
                  <span className="mono" style={{ fontSize: 11, color: T.muted }}>{logs.length} lines</span>
                </div>
                <div className="log-wrap" ref={logRef}>
                  {logs.length === 0 && <div className="log-line">Waiting for job to start…</div>}
                  {logs.map(l => <div key={l.id} className={`log-line ${l.type}`}>{l.msg}</div>)}
                  {trainState === "running" && <div className="log-line"><span className="cursor"/></div>}
                </div>
              </div>

              {trainState === "done" && (
                <button className="btn btn-accent fade" style={{ marginTop: 14 }} onClick={() => setTab("results")}>
                  View Results <Ic n="chart" s={14} c="#fff"/>
                </button>
              )}
            </div>
          )}

          {/* ─── RESULTS ─────────────────────────────────── */}
          {tab === "results" && (
            <div className="fade">
              {metrics ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, marginBottom: 16 }}>
                    <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: 10, color: T.dim, marginBottom: 12, letterSpacing: ".1em" }}>ACCURACY</div>
                      <Ring pct={Math.round(metrics.accuracy)} color={T.accent}/>
                      <div style={{ marginTop: 10, fontSize: 11, color: T.dim, textAlign: "center" }}>
                        {expName || file?.name?.replace(/\.\w+$/, "") || "Model"}
                      </div>
                    </div>
                    <div className="g2" style={{ alignContent: "start" }}>
                      {[
                        { k: "Loss",      v: metrics.loss,      fmt: x => x,         color: T.yellow },
                        { k: "F1 Score",  v: metrics.f1,        fmt: x => x + "%",   color: T.green  },
                        { k: "Precision", v: metrics.precision, fmt: x => x + "%",   color: T.accent },
                        { k: "Recall",    v: metrics.recall,    fmt: x => x + "%",   color: "#A78BFA" },
                      ].map(m => (
                        <div key={m.k} className="card-sm" style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: T.dim, marginBottom: 8, letterSpacing: ".08em" }}>{m.k}</div>
                          <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.fmt(m.v)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card fade">
                    <div style={{ fontSize: 11, color: T.dim, marginBottom: 14, letterSpacing: ".08em" }}>ACCURACY OVER EPOCHS</div>
                    <Spark data={metrics.history}/>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      {metrics.history.map((_, i) => (
                        <span key={i} className="mono" style={{ fontSize: 9, color: T.muted }}>E{i+1}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                    <button className="btn btn-accent" onClick={() => setTab("deploy")}>
                      Deploy API <Ic n="rocket" s={14} c="#fff"/>
                    </button>
                    <button className="btn btn-ghost" onClick={() => setTab("history")}>
                      View History
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ color: T.dim, textAlign: "center", padding: "60px 0" }}>
                  No results yet.
                  <br/><br/>
                  <button className="btn btn-accent" onClick={() => setTab("upload")}>Upload Data</button>
                </div>
              )}
            </div>
          )}

          {/* ─── DEPLOY ──────────────────────────────────── */}
          {tab === "deploy" && (
            <div className="fade" style={{ maxWidth: 600 }}>
              {metrics ? (
                <>
                  <div className="card" style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Ic n="link" s={16} c={T.accent}/>
                        <span style={{ fontWeight: 700 }}>Live REST Endpoint</span>
                      </div>
                      <span className="tag tag-green" style={{ animation: "glow-pulse 2s infinite" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }}/>
                        LIVE
                      </span>
                    </div>
                    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <code className="mono" style={{ fontSize: 12, color: T.accent, wordBreak: "break-all" }}>{endpointUrl}</code>
                      <button className="btn btn-ghost" style={{ padding: "6px 10px", flexShrink: 0 }} onClick={copyUrl}>
                        <Ic n="copy" s={13} c={copied ? T.green : T.dim}/>
                      </button>
                    </div>
                    {copied && <div style={{ fontSize: 11, color: T.green, marginTop: 6 }}>✓ Endpoint copied!</div>}
                  </div>

                  <div className="card" style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: T.dim, marginBottom: 12, letterSpacing: ".08em" }}>EXAMPLE — POST REQUEST</div>
                    <pre className="mono" style={{ fontSize: 11.5, color: "#A8B5C8", background: T.bg, padding: 16, borderRadius: 10, overflowX: "auto", lineHeight: 1.75 }}>
{`POST ${endpointUrl}
Content-Type: application/json

{ "features": [5.1, 3.5, 1.4, 0.2] }

───── Response ─────
{
  "prediction": "Class_A",
  "confidence": ${metrics.accuracy}%,
  "job_id": "${jobId}",
  "model": "${expName || "model"}",
  "latency_ms": 42
}`}
                    </pre>
                  </div>

                  <div className="card">
                    <div style={{ fontSize: 11, color: T.dim, marginBottom: 12, letterSpacing: ".08em" }}>DEPLOYMENT INFO</div>
                    <div className="g2">
                      {[
                        { label: "Platform",  val: "Render (free)" },
                        { label: "Runtime",   val: "Python 3.11 + scikit-learn" },
                        { label: "Cold Start",val: "~15s (free tier)" },
                        { label: "Uptime",    val: "99.0% SLA" },
                      ].map(r => (
                        <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <div style={{ fontSize: 11, color: T.dim }}>{r.label}</div>
                          <div className="mono" style={{ fontSize: 12, color: T.text }}>{r.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ color: T.dim, textAlign: "center", padding: "60px 0" }}>
                  Train a model first.
                  <br/><br/>
                  <button className="btn btn-accent" onClick={() => setTab("upload")}>Start Pipeline</button>
                </div>
              )}
            </div>
          )}

          {/* ─── HISTORY ─────────────────────────────────── */}
          {tab === "history" && (
            <div className="fade">
              {experiments.length === 0 ? (
                <div style={{ color: T.dim, textAlign: "center", padding: "60px 0" }}>
                  No experiments yet.
                  <br/><br/>
                  <button className="btn btn-accent" onClick={() => setTab("upload")}>Run First Experiment</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {experiments.map((exp, i) => (
                    <div key={exp.id} className="card fade" style={{ display: "flex", alignItems: "center", gap: 16, animationDelay: `${i * 50}ms` }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: T.accent + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Ic n="cpu" s={20} c={T.accent}/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{exp.name}</div>
                        <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>
                          {exp.model} · {exp.date} · Loss: {exp.loss}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: T.accent }}>{exp.accuracy}%</div>
                        <div style={{ fontSize: 10, color: T.dim }}>accuracy</div>
                      </div>
                      <span className="tag tag-green"><Ic n="check" s={10} c={T.green}/> done</span>
                      {deleteConfirm === exp.id ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-danger" onClick={() => deleteExp(exp.id)}>Confirm</button>
                          <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button className="btn btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setDeleteConfirm(exp.id)}>
                          <Ic n="trash" s={13} c={T.dim}/>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── COMPARE ─────────────────────────────────── */}
          {tab === "compare" && (
            <div className="fade">
              {/* Summary cards */}
              <div className="g3" style={{ marginBottom: 24 }}>
                <div className="card" style={{ borderTop: `3px solid ${T.accent}` }}>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 10, letterSpacing: ".08em" }}>SILVER AI FOUNDRY WINS</div>
                  <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: T.accent }}>
                    {CMP_DATA.filter(r => r.winner === "silver").length}
                  </div>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 4 }}>categories</div>
                </div>
                <div className="card" style={{ borderTop: `3px solid ${T.yellow}` }}>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 10, letterSpacing: ".08em" }}>TIE</div>
                  <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: T.yellow }}>
                    {CMP_DATA.filter(r => r.winner === "tie").length}
                  </div>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 4 }}>categories</div>
                </div>
                <div className="card" style={{ borderTop: `3px solid #5B9AFF` }}>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 10, letterSpacing: ".08em" }}>AZURE ML WINS</div>
                  <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: "#5B9AFF" }}>
                    {CMP_DATA.filter(r => r.winner === "azure").length}
                  </div>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 4 }}>categories</div>
                </div>
              </div>

              {/* Filter buttons */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["all", "silver", "azure", "tie"].map(f => (
                  <button key={f} className="btn btn-ghost" onClick={() => setCmpFilter(f)}
                    style={{ borderColor: cmpFilter === f ? T.accent + "88" : T.border, color: cmpFilter === f ? T.accent : T.dim, fontSize: 12 }}>
                    {f === "all" ? "All Features" : f === "silver" ? "✦ Silver Wins" : f === "azure" ? "☁ Azure Wins" : "⚖ Ties"}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th style={{ width: "18%" }}>Feature</th>
                      <th style={{ width: "35%" }}>
                        <span style={{ color: T.accent }}>✦ Silver AI Foundry</span>
                      </th>
                      <th style={{ width: "35%" }}>
                        <span style={{ color: "#5B9AFF" }}>☁ Azure ML Studio</span>
                      </th>
                      <th style={{ width: "12%", textAlign: "center" }}>Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCmp.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{row.feature}</td>
                        <td style={{ fontSize: 12.5, color: T.silver, lineHeight: 1.5 }}>{row.silver}</td>
                        <td style={{ fontSize: 12.5, color: T.dim,    lineHeight: 1.5 }}>{row.azure}</td>
                        <td style={{ textAlign: "center" }}>
                          {row.winner === "silver" && <span className="tag tag-blue">✦ Silver</span>}
                          {row.winner === "azure"  && <span className="tag" style={{ background: "#5B9AFF22", color: "#5B9AFF" }}>☁ Azure</span>}
                          {row.winner === "tie"    && <span className="tag tag-yellow">⚖ Tie</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card-sm fade" style={{ marginTop: 20, borderLeft: `3px solid ${T.accent}` }}>
                <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.6 }}>
                  <strong style={{ color: T.text }}>Bottom line:</strong> Silver AI Foundry is the fastest way to learn ML pipelines — zero cost, zero config, deploys in 30 minutes. Azure Machine Learning is a production powerhouse with GPU clusters, AutoML, compliance certs, and enterprise SLAs. Use Silver to learn; use Azure to scale.
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
