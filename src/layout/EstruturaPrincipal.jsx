/** Estrutura visual comum: menu lateral, cabeçalho, rotas e modal de SOS. */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Activity, Bell, ChevronDown, CircleHelp, FileText, HeartPulse, History, LayoutDashboard, Menu, Phone, Settings, Smartphone, X, Siren } from 'lucide-react';
import { patient, firstAndSecondName } from '../componentesCompartilhados.jsx';
const nav = [
    ['/', 'Painel de Controle', LayoutDashboard],
    ['/historico', 'Meu Histórico', History],
    ['/graficos', 'Gráficos', Activity],
    ['/relatorios', 'Relatórios', FileText],
    ['/alertas', 'Alertas', Bell],
    ['/dispositivo', 'Dispositivo', Smartphone],
    ['/configuracoes', 'Configurações', Settings],
    ['/ajuda', 'Ajuda e Suporte', CircleHelp],
];
// Cada tela é carregada somente quando é aberta. Um módulo de outra página
// não deve impedir o painel principal de iniciar.
const Dashboard = lazy(() => import('../pages/PaginaInicial.jsx').then(m => ({ default: m.Dashboard })));
const HistoryPage = lazy(() => import('../pages/PaginaHistorico.jsx').then(m => ({ default: m.HistoryPage })));
const ChartsPage = lazy(() => import('../pages/PaginaGraficos.jsx').then(m => ({ default: m.ChartsPage })));
const ReportsPage = lazy(() => import('../pages/PaginaRelatorios.jsx').then(m => ({ default: m.ReportsPage })));
const AlertsPage = lazy(() => import('../pages/PaginaRelatorios.jsx').then(m => ({ default: m.AlertsPage })));
const DevicePage = lazy(() => import('../pages/PaginaRelatorios.jsx').then(m => ({ default: m.DevicePage })));
const SettingsPage = lazy(() => import('../pages/PaginaRelatorios.jsx').then(m => ({ default: m.SettingsPage })));
const AccountSettings = lazy(() => import('../pages/PaginasConfiguracoes.jsx').then(m => ({ default: m.AccountSettings })));
const MonitoringSettings = lazy(() => import('../pages/PaginasConfiguracoes.jsx').then(m => ({ default: m.MonitoringSettings })));
const NotificationSettings = lazy(() => import('../pages/PaginasConfiguracoes.jsx').then(m => ({ default: m.NotificationSettings })));
const PrivacySettings = lazy(() => import('../pages/PaginasConfiguracoes.jsx').then(m => ({ default: m.PrivacySettings })));
const AccessibilitySettings = lazy(() => import('../pages/PaginasConfiguracoes.jsx').then(m => ({ default: m.AccessibilitySettings })));
const HelpPage = lazy(() => import('../pages/PaginaAjuda.jsx').then(m => ({ default: m.HelpPage })));
const PageLoading = () => <div className="panel" role="status">Carregando página...</div>;
/** Shell mantém a lógica da tela correspondente. */
export function Shell({ theme, setTheme, user, saveUser, onLogout }) { const [menu, setMenu] = React.useState(false), [sos, setSos] = React.useState(false), [profileMenu, setProfileMenu] = React.useState(false); const navigate = useNavigate(); const displayName = firstAndSecondName(user?.name || patient.name); return <div className="app"><aside className={'sidebar ' + (menu ? 'open' : '')}><div className="brand"><HeartPulse /><div><b>V.I.T.A.</b><small>Monitoramento<br />de Sinais Vitais</small></div></div><nav>{nav.map(([to, label, I]) => <NavLink to={to} end={to === '/'} key={to}><I size={20}/>{label}{label === 'Alertas' && <em>2</em>}</NavLink>)}</nav><div className="sos"><div className="sos-circle">SOS</div><b>Emergência</b><p>Acione o alerta geral<br />de emergência.</p><button onClick={() => setSos(true)}>Acionar SOS</button></div><footer>V.I.T.A. v1.5.2</footer></aside>{menu && <div className="backdrop" onClick={() => setMenu(false)}/>}<main><header><button className="icon" onClick={() => setMenu(!menu)} aria-label="Abrir menu"><Menu /></button><div className="top"><span className="notif"><Bell /><i>2</i></span><div className="profile profile-menu-wrap"><button type="button" className="profile-trigger" aria-expanded={profileMenu} onClick={() => setProfileMenu(v => !v)} aria-label="Abrir menu do usuário">{user?.photo ? <img src={user.photo} alt=""/> : <span>{displayName.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()}</span>}<div><b>{displayName}</b><small>Minha conta</small></div><ChevronDown size={15}/></button>{profileMenu && <><button className="profile-dismiss" aria-label="Fechar menu do usuário" onClick={() => setProfileMenu(false)}></button><div className="profile-dropdown"><button onClick={() => { setProfileMenu(false); navigate('/configuracoes/conta'); }}>Minha conta</button><button onClick={() => { setProfileMenu(false); navigate('/configuracoes'); }}>Configurações</button><button onClick={() => { setProfileMenu(false); onLogout(); }}>Sair</button></div></>}</div></div></header><div className="content"><Suspense fallback={<PageLoading />}><Routes><Route path="/" element={<Dashboard user={user}/>}/><Route path="/historico" element={<HistoryPage />}/><Route path="/graficos" element={<ChartsPage />}/><Route path="/relatorios" element={<ReportsPage user={user}/>}/><Route path="/alertas" element={<AlertsPage />}/><Route path="/dispositivo" element={<DevicePage user={user}/>}/><Route path="/configuracoes" element={<SettingsPage />}/><Route path="/configuracoes/conta" element={<AccountSettings user={user} saveUser={saveUser}/>}/><Route path="/configuracoes/monitoramento" element={<MonitoringSettings />}/><Route path="/configuracoes/notificacoes" element={<NotificationSettings />}/><Route path="/configuracoes/privacidade" element={<PrivacySettings />}/><Route path="/configuracoes/acessibilidade" element={<AccessibilitySettings theme={theme} setTheme={setTheme}/>}/><Route path="/ajuda" element={<HelpPage />}/></Routes></Suspense></div></main>{sos && <div className="modal-bg"><div className="modal"><div className="modal-head"><b>Acionar emergência</b><button className="icon" onClick={() => setSos(false)}><X /></button></div><div className="modal-body"><div className="big-siren"><Siren /></div><h2>Você deseja acionar o SOS?</h2><p>O V.I.T.A. enviará um alerta de emergência aos responsáveis cadastrados. No protótipo, nenhum alerta real é enviado.</p><div className="modal-actions"><button className="btn light" onClick={() => setSos(false)}>Cancelar</button><button className="btn danger" onClick={() => setSos(false)}>Confirmar SOS</button></div></div></div></div>}</div>; }
