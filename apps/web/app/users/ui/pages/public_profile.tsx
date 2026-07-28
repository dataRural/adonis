import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import * as Ic from '#common/ui/components/datarural/icons'
import type { InertiaProps } from '#core/ui/types'

interface DatasetItem {
  id: number
  title: string
  description: string
  area: string
  tags: string[]
  isPublic: boolean
  downloadsCount: number
  likesCount: number
  updatedAt: string
  version: string
  fileCount: number
  format: string
  size: string
}

interface GroupItem {
  id: number
  name: string
  description: string | null
  role: string
  avatarUrl: string | null
}

interface UserProfile {
  id: number
  fullName: string | null
  email: string
  avatarUrl: string | null
  createdAt: string
}

type PageProps = InertiaProps<{
  userProfile: UserProfile
  isOwnProfile: boolean
  datasets: DatasetItem[]
  groups: GroupItem[]
  stats: {
    datasetCount: number
    likeCount: number
    groupCount: number
    downloadCount: number
  }
}>

export default function PublicProfilePage({
  userProfile,
  isOwnProfile,
  datasets,
  groups,
  stats,
}: PageProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'datasets' | 'groups' | 'activity'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const name = userProfile.fullName || 'Usuário DataRural'
  const emailPrefix = userProfile.email ? userProfile.email.split('@')[0] : 'usuario'
  const initials = name
    .split(' ')
    .filter((w) => w.length > 0)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const formattedJoinDate = new Date(userProfile.createdAt).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  // Generate 52-week mock/calculated contribution matrix (364 days)
  const contributionData = Array.from({ length: 52 * 7 }, (_, i) => {
    // Generate deterministic green activity levels for demonstration
    const seed = (i * 17 + (userProfile.id || 1) * 31) % 100
    let level = 0
    if (seed > 85) level = 4
    else if (seed > 70) level = 3
    else if (seed > 55) level = 2
    else if (seed > 40) level = 1
    return level
  })

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  const filteredDatasets = datasets.filter((ds) =>
    ds.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ds.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ds.area.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="dr-app dr-panel-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PanelNav
        theme={theme}
        onToggleTheme={handleToggleTheme}
        active="profile"
      />

      {/* GitHub-style Header Navigation Subbar */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--card)',
          marginTop: 0,
          paddingTop: 12,
        }}
      >
        <div className="dr-container">
          <div style={{ display: 'flex', gap: 24, fontSize: 14.5, fontWeight: 500 }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 4px 14px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === 'overview' ? 'var(--brand-green)' : 'var(--muted-foreground)',
                borderBottom: activeTab === 'overview' ? '2.5px solid var(--brand-green)' : '2.5px solid transparent',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                transition: 'all 0.15s ease',
              }}
            >
              <Ic.Grid size={17} /> Visão Geral
            </button>

            <button
              onClick={() => setActiveTab('datasets')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 4px 14px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === 'datasets' ? 'var(--brand-green)' : 'var(--muted-foreground)',
                borderBottom: activeTab === 'datasets' ? '2.5px solid var(--brand-green)' : '2.5px solid transparent',
                fontWeight: activeTab === 'datasets' ? 700 : 500,
                transition: 'all 0.15s ease',
              }}
            >
              <Ic.Database size={17} /> Datasets
              <span
                style={{
                  background: 'color-mix(in srgb, var(--brand-green) 12%, transparent)',
                  color: 'var(--brand-green)',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '1px 8px',
                  borderRadius: 12
                }}
              >
                {stats.datasetCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('groups')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 4px 14px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === 'groups' ? 'var(--brand-green)' : 'var(--muted-foreground)',
                borderBottom: activeTab === 'groups' ? '2.5px solid var(--brand-green)' : '2.5px solid transparent',
                fontWeight: activeTab === 'groups' ? 700 : 500,
                transition: 'all 0.15s ease',
              }}
            >
              <Ic.Users size={17} /> Grupos
              <span
                style={{
                  background: 'color-mix(in srgb, var(--brand-green) 12%, transparent)',
                  color: 'var(--brand-green)',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '1px 8px',
                  borderRadius: 12
                }}
              >
                {stats.groupCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 4px 14px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === 'activity' ? 'var(--brand-green)' : 'var(--muted-foreground)',
                borderBottom: activeTab === 'activity' ? '2.5px solid var(--brand-green)' : '2.5px solid transparent',
                fontWeight: activeTab === 'activity' ? 700 : 500,
                transition: 'all 0.15s ease',
              }}
            >
              <Ic.History size={17} /> Atividades
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dr-container" style={{ flex: 1, marginTop: 32, marginBottom: 64 }}>
        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start' }} className="dr-profile-layout">

          {/* GitHub-style Left Profile Sidebar */}
          <aside style={{ width: 280, flexShrink: 0 }} className="dr-profile-sidebar">
            <div style={{ position: 'relative', marginBottom: 20 }}>
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={name}
                  style={{
                    width: 260,
                    height: 260,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid var(--card)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 260,
                    height: 260,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--brand-green), #059669)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 72,
                    fontWeight: 800,
                    border: '4px solid var(--card)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{name}</h1>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 16, margin: '4px 0 0', fontWeight: 500 }}>
                @{emailPrefix}
              </p>
            </div>

            <p style={{ fontSize: 14, color: 'var(--foreground)', lineHeight: 1.5, marginBottom: 20 }}>
              Pesquisador(a) no ecossistema DataRural UFRRJ. Especialista em inteligência de dados agrícolas, sensoriamento remoto e preservação ambiental.
            </p>

            {isOwnProfile && (
              <Link
                href="/settings/profile"
                className="dr-btn dr-btn-outline"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 24,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                <Ic.Edit size={16} /> Editar perfil
              </Link>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--muted-foreground)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ic.Building size={16} style={{ flexShrink: 0 }} />
                <span>Instituto de Ciências Exatas — UFRRJ</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ic.Pin size={16} style={{ flexShrink: 0 }} />
                <span>Seropédica, Rio de Janeiro</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ic.Globe size={16} style={{ flexShrink: 0 }} />
                <a href={`mailto:${userProfile.email}`} style={{ color: 'var(--brand-green)', textDecoration: 'none' }}>
                  {userProfile.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ic.Calendar size={16} style={{ flexShrink: 0 }} />
                <span>Membro desde {formattedJoinDate}</span>
              </div>
            </div>


            {/* Groups Section (Only visible on own profile) */}
            {isOwnProfile && (
              <div>
                <hr style={{ margin: '24px 0', borderColor: 'var(--border)' }} />
                <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', margin: '0 0 12px' }}>
                  Grupos ({groups.length})
                </h3>
                {groups.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                    Nenhum grupo participante.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {groups.map((grp) => (
                      <Link
                        key={grp.id}
                        href={`/groups/${grp.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 10px',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          background: 'var(--surface-1)',
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'background 0.15s ease',
                        }}
                        title={`Ver grupo ${grp.name}`}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: 'color-mix(in srgb, var(--brand-purple) 20%, transparent)',
                            color: 'var(--brand-purple)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          <Ic.Users size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {grp.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
                            {grp.role === 'owner' ? 'Dono' : grp.role === 'admin' ? 'Admin' : 'Membro'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* GitHub-style Right Content Area */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {activeTab === 'overview' && (
              <div>
                {/* Pinned Datasets Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Datasets em Destaque</h2>
                </div>

                {datasets.length === 0 ? (
                  <div className="dr-panel" style={{ padding: 40, textAlign: 'center', marginBottom: 32 }}>
                    <Ic.Database size={40} style={{ color: 'var(--muted-foreground)', marginBottom: 12 }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>Nenhum dataset publicado ainda</h3>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 14, margin: '0 0 16px' }}>
                      Este usuário ainda não publicou datasets no ecossistema.
                    </p>
                    {isOwnProfile && (
                      <Link href="/dashboard/publish" className="dr-btn dr-btn-primary">
                        <Ic.Plus size={16} /> Publicar meu primeiro dataset
                      </Link>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginBottom: 32 }}>
                    {[...datasets]
                      .sort((a, b) => b.likesCount - a.likesCount)
                      .slice(0, 4)
                      .map((ds) => (
                        <div
                          key={ds.id}
                          className="dr-panel"
                          style={{
                            margin: 0,
                            marginTop: 0,
                            padding: '18px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: 154,
                            boxSizing: 'border-box',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            transition: 'border-color 0.2s ease, transform 0.2s ease',
                          }}
                        >
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                              <Link
                                href={`/datasets/${ds.id}`}
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: 'var(--brand-green)',
                                  textDecoration: 'none',
                                  lineHeight: 1.2,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {ds.title}
                              </Link>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '2px 8px',
                                  borderRadius: 12,
                                  border: '1px solid var(--border)',
                                  color: ds.isPublic ? 'var(--brand-green)' : 'var(--muted-foreground)',
                                  background: ds.isPublic ? 'color-mix(in srgb, var(--brand-green) 10%, transparent)' : 'transparent',
                                  flexShrink: 0,
                                }}
                              >
                                {ds.isPublic ? 'Público' : 'Privado'}
                              </span>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {ds.description || 'Sem descrição cadastrada para este conjunto de dados.'}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted-foreground)', paddingTop: 10, borderTop: '1px solid var(--border)', marginTop: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-green)', display: 'inline-block' }} />
                                {ds.area}
                              </span>
                              <span style={{ fontWeight: 600 }}>{ds.format}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Ic.Heart size={14} /> {ds.likesCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Recent Activity Stream */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Atividade Recente</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {datasets.slice(0, 3).map((ds) => (
                      <div key={ds.id} className="dr-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ background: 'color-mix(in srgb, var(--brand-green) 12%, transparent)', color: 'var(--brand-green)', padding: 10, borderRadius: '50%' }}>
                          <Ic.Plus size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>
                            Publicou nova versão <span style={{ color: 'var(--brand-green)' }}>{ds.version}</span> do dataset{' '}
                            <Link href={`/datasets/${ds.id}`} style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 700 }}>
                              {ds.title}
                            </Link>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
                            {ds.area} • {ds.size} • {ds.fileCount} arquivo(s)
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                          {new Date(ds.updatedAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'datasets' && (
              <div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Ic.Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                    <input
                      type="text"
                      placeholder="Pesquisar datasets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="dr-input"
                      style={{ paddingLeft: 40, width: '100%' }}
                    />
                  </div>
                  {isOwnProfile && (
                    <Link href="/dashboard/publish" className="dr-btn dr-btn-primary">
                      <Ic.Plus size={16} /> Novo Dataset
                    </Link>
                  )}
                </div>

                {filteredDatasets.length === 0 ? (
                  <div className="dr-panel" style={{ padding: 40, textAlign: 'center' }}>
                    <Ic.Database size={36} style={{ color: 'var(--muted-foreground)', marginBottom: 8 }} />
                    <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>Nenhum dataset encontrado para a busca especificada.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredDatasets.map((ds) => (
                      <div key={ds.id} className="dr-panel" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <Link href={`/datasets/${ds.id}`} style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-green)', textDecoration: 'none' }}>
                            {ds.title}
                          </Link>
                          <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }}>
                            {ds.version}
                          </span>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: '0 0 16px', lineHeight: 1.4 }}>
                          {ds.description}
                        </p>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted-foreground)' }}>
                          <span>Área: <strong>{ds.area}</strong></span>
                          <span>Formato: <strong>{ds.format}</strong></span>
                          <span>Tamanho: <strong>{ds.size}</strong></span>
                          <span>Curtidas: <strong>{ds.likesCount}</strong></span>
                          <span>Downloads: <strong>{ds.downloadsCount}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'groups' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Grupos de Pesquisa e Laboratórios</h2>
                {groups.length === 0 ? (
                  <div className="dr-panel" style={{ padding: 40, textAlign: 'center' }}>
                    <Ic.Users size={36} style={{ color: 'var(--muted-foreground)', marginBottom: 8 }} />
                    <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>O usuário não participa de nenhum grupo público no momento.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {groups.map((grp) => (
                      <div key={grp.id} className="dr-panel" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--brand-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                            {grp.name[0]}
                          </div>
                          <div>
                            <Link href={`/groups/${grp.id}`} style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)', textDecoration: 'none' }}>
                              {grp.name}
                            </Link>
                            <div style={{ fontSize: 12, color: 'var(--brand-green)', fontWeight: 600 }}>
                              {grp.role === 'owner' ? 'Proprietário' : 'Membro'}
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.4 }}>
                          {grp.description || 'Grupo de pesquisa dedicado à ciência aplicada no ecossistema UFRRJ.'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Histórico de Atividade</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {datasets.map((ds) => (
                    <div key={ds.id} className="dr-panel" style={{ padding: 20, display: 'flex', gap: 16 }}>
                      <Ic.History size={20} style={{ color: 'var(--brand-green)', marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                          Publicou dataset: <Link href={`/datasets/${ds.id}`} style={{ color: 'var(--brand-green)', textDecoration: 'none' }}>{ds.title}</Link>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                          Área: {ds.area} • Versão {ds.version} • {ds.fileCount} arquivo(s)
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 8 }}>
                          {new Date(ds.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <PanelFooter />
    </div>
  )
}
