/* ============================================================
   panel-app.jsx — estado global (tema, view) e composição
   view: "dashboard" | "wizard"
   ============================================================ */
const { useState: useStateA, useEffect: useEffectA } = React;

function PanelFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-bar" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
          <span>© 2026 Universidade Federal Rural do Rio de Janeiro · DataRural</span>
          <span className="colors" aria-hidden="true">
            <i style={{ background: "var(--brand-blue)" }}></i>
            <i style={{ background: "var(--brand-green)" }}></i>
            <i style={{ background: "var(--brand-yellow)" }}></i>
            <i style={{ background: "var(--brand-orange)" }}></i>
            <i style={{ background: "var(--brand-sky)" }}></i>
          </span>
        </div>
      </div>
    </footer>
  );
}

function PanelApp() {
  const [theme, setTheme] = useStateA(() => localStorage.getItem("dr-theme") || "light");
  const [view, setView] = useStateA(() => {
    if (location.hash === "#publicar") return "wizard";
    return localStorage.getItem("dr-panel-view") || "dashboard";
  });

  useEffectA(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("dr-theme", theme);
  }, [theme]);

  useEffectA(() => { localStorage.setItem("dr-panel-view", view); }, [view]);

  const goWizard = () => { setView("wizard"); window.scrollTo({ top: 0 }); };
  const goDashboard = () => { setView("dashboard"); window.scrollTo({ top: 0 }); };

  return (
    <div className="app">
      <PanelNav
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onPublish={goWizard}
        active={view === "dashboard" ? "dashboard" : ""}
      />
      {view === "dashboard"
        ? <Dashboard onPublish={goWizard} onEdit={goWizard} />
        : <UploadWizard onExit={goDashboard} onDashboard={goDashboard} />}
      <PanelFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PanelApp />);
