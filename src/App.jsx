/** Define as rotas de cadastro, login e área autenticada. */
import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoginPage, RegisterPage } from './pages/PaginasAutenticacao.jsx';

// Carrega a área autenticada somente quando necessário. Assim, um erro em outra
// página não impede a tela de login de aparecer.
const Shell = lazy(() => import('./layout/EstruturaPrincipal.jsx').then((module) => ({ default: module.Shell })));
const LoadingScreen = () => <div className="authpage" role="status">Carregando o V.I.T.A...</div>;

// Evita que falhas em módulos da área interna deixem a aplicação totalmente em branco.
class AppErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error) {
        // Limpa a sessão demonstrativa se a área autenticada falhar, para que
        // a pessoa consiga voltar ao login sem ficar presa no mesmo erro.
        localStorage.removeItem('vita-auth');
        console.error('Erro ao renderizar uma tela do V.I.T.A.:', error);
    }
    render() {
        if (this.state.hasError) return <div className="authpage"><div className="authcard"><h1>Não foi possível abrir esta página</h1><p>O V.I.T.A. encontrou um erro em uma das telas. Você pode voltar ao login e continuar usando a autenticação.</p><a href="/login">Voltar ao login</a></div></div>;
        return this.props.children;
    }
}
/** Componente principal da aplicação. */
export function App() {
    const navigate = useNavigate();
    const [theme, setTheme] = React.useState(() => localStorage.getItem('vita-theme') || 'system');
    React.useEffect(() => { localStorage.setItem('vita-theme', theme); const root = document.documentElement; root.dataset.theme = theme; const mq = window.matchMedia('(prefers-color-scheme: dark)'); const apply = () => root.dataset.resolvedTheme = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme; apply(); mq.addEventListener?.('change', apply); return () => mq.removeEventListener?.('change', apply); }, [theme]);
    React.useEffect(() => { const root = document.documentElement; const font = localStorage.getItem('vita-font-size') || 'normal'; root.dataset.fontSize = font; root.style.setProperty('--font-scale', font === 'large' ? '1.125' : font === 'xlarge' ? '1.25' : '1'); root.dataset.highContrast = localStorage.getItem('vita-high-contrast') === 'true' ? 'true' : 'false'; root.dataset.reduceMotion = localStorage.getItem('vita-reduce-motion') === 'true' ? 'true' : 'false'; root.dataset.focusHighlight = localStorage.getItem('vita-focus-highlight') !== 'false' ? 'true' : 'false'; }, []);
    const [user, setUser] = React.useState(() => {
        try {
            return JSON.parse(localStorage.getItem('vita-user') || 'null');
        }
        catch {
            return null;
        }
    });
    const [authenticated, setAuthenticated] = React.useState(() => localStorage.getItem('vita-auth') === 'true');
    const saveUser = (next) => { setUser(next); localStorage.setItem('vita-user', JSON.stringify(next)); };
    const registerUser = (next) => {
        const normalized = { ...next, emergency: Array.isArray(next.emergency) ? next.emergency : [{}, {}, {}] };
        setUser(normalized);
        localStorage.setItem('vita-user', JSON.stringify(normalized));
        localStorage.setItem('vita-account-form', JSON.stringify(normalized));
        localStorage.setItem('vita-emergency-contacts', JSON.stringify(normalized.emergency));
        setAuthenticated(false);
        localStorage.removeItem('vita-auth');
        localStorage.setItem('vita-register-success', 'true');
        navigate('/login');
    };
    const login = () => { setAuthenticated(true); localStorage.setItem('vita-auth', 'true'); navigate('/'); };
    const logout = () => { setAuthenticated(false); localStorage.removeItem('vita-auth'); navigate('/login'); };
    return <AppErrorBoundary><Suspense fallback={<LoadingScreen />}><Routes><Route path="/login" element={<LoginPage user={user} onLogin={login}/>}/><Route path="/cadastro" element={<RegisterPage onRegister={registerUser}/>}/><Route path="/*" element={authenticated ? <Shell theme={theme} setTheme={setTheme} user={user} saveUser={saveUser} onLogout={logout}/> : <LoginPage user={user} onLogin={login}/>}/></Routes></Suspense></AppErrorBoundary>;
}
