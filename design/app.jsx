/* ============================================================
   app.jsx — estado global (tema, busca, filtros) e composição
   ============================================================ */
const { useState, useMemo, useEffect } = React;

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("dr-theme") || "light");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const [tab, setTab] = useState("featured");
  const [view, setView] = useState("grid");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("dr-theme", theme);
  }, [theme]);

  const list = useMemo(() => {
    let arr = DATASETS.slice();
    if (activeCat) arr = arr.filter((d) => d.cat === activeCat);
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((d) =>
      (d.title + " " + d.unit + " " + d.desc + " " + d.tags.join(" ")).toLowerCase().includes(q)
      );
    }
    if (tab === "downloads") arr.sort((a, b) => b.downloads - a.downloads);else
    if (tab === "recent") arr = arr.filter((d) => d.recent).concat(arr.filter((d) => !d.recent));else
    arr.sort((a, b) => b.featured === a.featured ? a.order - b.order : b.featured ? 1 : -1);
    return arr;
  }, [query, activeCat, tab]);

  return (
    <div className="app">
      <Navbar theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <Hero query={query} onQuery={setQuery} onChip={(t) => {setQuery(t);const el = document.getElementById("datasets");if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });}} />
      <StatsStrip data-comment-anchor="1e5b9531f8-span-84-13" />
      <Categories active={activeCat} onPick={setActiveCat} data-comment-anchor="f166ebf0cf-span-119-19" />
      <DatasetsSection
        list={list} tab={tab} onTab={setTab} view={view} onView={setView} activeCat={activeCat} />
      
      <PublishCTA />
      <Footer />
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);