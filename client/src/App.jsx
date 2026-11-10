import { useState, useEffect } from "react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ---- Edit these placeholders ----
const FEST = { name: "Infotrek’27", dates: "Dates to be announced", venue: "NIT Trichy, Tiruchirappalli" };
const EVENTS = [
  { name: "Code Sprint", info: "Solo competitive programming round." },
  { name: "Web Quest", info: "Build a working web page from a surprise brief." },
  { name: "Tech Quiz", info: "Teams of two, rapid-fire questions." },
  { name: "Hack Trail", info: "Team hackathon with mentors on site." },
];
const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "Other"];
// ---------------------------------

function Register() {
  const empty = { name: "", email: "", phone: "", college: "", year: "", events: [] };
  const [f, setF] = useState(empty);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (n) =>
    setF({ ...f, events: f.events.includes(n) ? f.events.filter((x) => x !== n) : [...f.events, n] });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus({ type: "", msg: "" });
    try {
      const res = await fetch(`${API}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus({ type: "ok", msg: `You're registered, ${f.name.split(" ")[0]}. See you at ${FEST.name}.` });
      setF(empty);
    } catch (err) {
      setStatus({ type: "err", msg: err.message || "Could not reach the server." });
    }
    setBusy(false);
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>Full name<input value={f.name} onChange={set("name")} required /></label>
      <label>Email<input type="email" value={f.email} onChange={set("email")} required /></label>
      <label>Phone<input inputMode="numeric" maxLength={10} value={f.phone} onChange={set("phone")} required /></label>
      <label>College<input value={f.college} onChange={set("college")} required /></label>
      <label>Year
        <select value={f.year} onChange={set("year")} required>
          <option value="">Select year</option>
          {YEARS.map((y) => <option key={y}>{y}</option>)}
        </select>
      </label>
      <fieldset>
        <legend>Events you want to join</legend>
        {EVENTS.map((ev) => (
          <label key={ev.name} className="check">
            <input type="checkbox" checked={f.events.includes(ev.name)} onChange={() => toggle(ev.name)} />
            {ev.name}
          </label>
        ))}
      </fieldset>
      <button disabled={busy}>{busy ? "Registering…" : "Register now"}</button>
      {status.msg && <p className={`msg ${status.type}`} role="status">{status.msg}</p>}
    </form>
  );
}

function Admin() {
  const [key, setKey] = useState("");
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  async function load(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${API}/api/registrations`, { headers: { "x-admin-key": key } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRows(data);
    } catch (ex) {
      setErr(ex.message);
    }
  }

  function csv() {
    const head = ["Name", "Email", "Phone", "College", "Year", "Events", "Registered at"];
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = rows.map((r) =>
      [r.name, r.email, r.phone, r.college, r.year, r.events.join("; "), r.createdAt].map(q).join(",")
    );
    const blob = new Blob([[head.map(q).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "infotrek27-registrations.csv";
    a.click();
  }

  return (
    <main className="wrap">
      <h1 className="h2">Registrations</h1>
      {!rows ? (
        <form className="form narrow" onSubmit={load}>
          <label>Admin key<input type="password" value={key} onChange={(e) => setKey(e.target.value)} required /></label>
          <button>Open registrations</button>
          {err && <p className="msg err">{err}</p>}
        </form>
      ) : (
        <>
          <p>{rows.length} registered. <button className="link" onClick={csv}>Download CSV</button></p>
          <div className="scroll">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>College</th><th>Year</th><th>Events</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id}><td>{r.name}</td><td>{r.email}</td><td>{r.phone}</td><td>{r.college}</td><td>{r.year}</td><td>{r.events.join(", ")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  if (hash === "#admin") return <Admin />;

  return (
    <>
      <header className="hero">
        <p className="where">{FEST.venue}</p>
        <h1>{FEST.name}</h1>
        <p className="sub">{FEST.dates}. Compete, build and meet people who like making things.</p>
        <a className="cta" href="#register">Register now</a>
      </header>

      <main className="wrap">
        <section>
          <h2 className="h2">Events</h2>
          <ul className="events">
            {EVENTS.map((e) => (
              <li key={e.name}><h3>{e.name}</h3><p>{e.info}</p></li>
            ))}
          </ul>
        </section>
        <section id="register">
          <h2 className="h2">Register</h2>
          <Register />
        </section>
      </main>
      <footer>© {FEST.name} · {FEST.venue}</footer>
    </>
  );
}
