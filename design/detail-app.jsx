/* ============================================================
   detail-app.jsx — estado (tema, aba ativa) e composição
   ============================================================ */
const { useState, useEffect } = React;

function DetailApp() {
  const [theme, setTheme] = useState(() => localStorage.getItem("dr-theme") || "light");
  const [tab, setTab] = useState(() => localStorage.getItem("dr-detail-tab") || "overview");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("dr-theme", theme);
  }, [theme]);

  useEffect(() => {localStorage.setItem("dr-detail-tab", tab);}, [tab]);

  return (
    <div className="app">
      <DetailNav theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <DatasetHeader />
      <TabBar tab={tab} onTab={setTab} />

      <main className="ds-page">
        <div className="container">
          <div className="ds-layout">
            <div className="ds-main">
              {tab === "overview" && <OverviewTab data-comment-anchor="c85611885b-span-68-21" />}
              {tab === "viewer" && <Viewer />}
              {tab === "files" && <FilesTab />}
              {tab === "notebooks" && <NotebooksTab />}
              {tab === "discussion" && <DiscussionTab />}
            </div>
            <Rail />
          </div>
        </div>
      </main>

      <RelatedSection />
      <DetailFooter />
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<DetailApp />);