/** Telas de cadastro e autenticação. */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { formatCPF, formatPhone, Field } from '../componentesCompartilhados.jsx';
/** LoginPage mantém a lógica da tela correspondente. */
export function LoginPage({ user, onLogin }) {
    const [email, setEmail] = React.useState(''), [password, setPassword] = React.useState(''), [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(() => localStorage.getItem('vita-register-success') === 'true');
    React.useEffect(() => {
        if (success) localStorage.removeItem('vita-register-success');
    }, [success]);
    return <div className="authpage"><form className="authcard" onSubmit={e => {
            e.preventDefault();
            if (!user) {
                setError('Cadastre sua conta antes de entrar.');
                return;
            }
            if (email.trim().toLowerCase() !== String(user.email || '').trim().toLowerCase() || password !== String(user.password || '')) {
                setError('E-mail ou senha incorretos.');
                return;
            }
            onLogin();
        }}><div className="authbrand"><HeartPulse /><div><b>V.I.T.A.</b><small>Monitoramento de Sinais Vitais</small></div></div><h1>Bem-vindo de volta</h1><p>Acesse sua conta para acompanhar seu monitoramento.</p>{success && <div className="successmsg" role="status">Cadastro concluído! Entre com o e-mail e a senha que você acabou de criar.</div>}{error && <div className="formerror">{error}</div>}<Field label="E-mail" value={email} onChange={setEmail} type="email" required placeholder="voce@exemplo.com"/><Field label="Senha" value={password} onChange={setPassword} type="password" required placeholder="Sua senha"/><button className="btn primary full" type="submit">Entrar</button><div className="authdivider"><span>ou</span></div><p className="authbottom">Ainda não tem uma conta? <NavLink to="/cadastro">Criar cadastro</NavLink></p><small className="demo-note">Protótipo acadêmico: os dados ficam salvos apenas neste navegador.</small></form></div>;
}
/** RegisterPage mantém a lógica da tela correspondente. */
export function RegisterPage({ onRegister }) {
    const [data, setData] = React.useState({ name: '', cpf: '', address: '', deviceId: '', email: '', phone: '', password: '', confirm: '' }), [error, setError] = React.useState('');
    const update = (k, v) => setData(p => ({ ...p, [k]: v }));
    return <div className="authpage registerpage"><form className="authcard registercard" onSubmit={e => {
            e.preventDefault();
            if (!data.name.trim()) {
                setError('Informe seu nome completo.');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
                setError('Informe um endereço de e-mail válido.');
                return;
            }
            if (data.cpf.replace(/\D/g, '').length !== 11) {
                setError('Informe um CPF com 11 dígitos.');
                return;
            }
            if (data.password.length < 6) {
                setError('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            if (data.password !== data.confirm) {
                setError('As senhas não coincidem.');
                return;
            }
            const { confirm, ...account } = data;
            // O ID do aparelho é opcional enquanto o protótipo ainda não possui um código definitivo.
            onRegister({ ...account, name: account.name.trim(), email: account.email.trim().toLowerCase(), deviceId: account.deviceId.trim(), age: '', sex: '', emergency: [{}, {}, {}] });
        }}><div className="authbrand"><HeartPulse /><div><b>V.I.T.A.</b><small>Criação de conta</small></div></div><h1>Crie sua conta</h1><p>Preencha seus dados para começar a configurar o V.I.T.A.</p>{error && <div className="formerror">{error}</div>}<div className="formgrid"><Field label="Nome completo" value={data.name} onChange={v => update('name', v)} required placeholder="Seu nome"/><Field label="CPF" value={data.cpf} onChange={v => update('cpf', formatCPF(v))} required placeholder="000.000.000-00"/><Field label="Endereço" value={data.address} onChange={v => update('address', v)} required placeholder="Rua, número, cidade"/><Field label="Código de identificação do aparelho (opcional)" value={data.deviceId} onChange={v => update('deviceId', v)} placeholder="Você poderá preencher depois"/><Field label="E-mail" value={data.email} onChange={v => update('email', v)} type="email" required placeholder="voce@exemplo.com"/><Field label="Número de telefone" value={data.phone} onChange={v => update('phone', formatPhone(v))} required placeholder="(00) 00000-0000"/><Field label="Senha" value={data.password} onChange={v => update('password', v)} type="password" required placeholder="Mínimo de 6 caracteres"/><Field label="Confirmar senha" value={data.confirm} onChange={v => update('confirm', v)} type="password" required placeholder="Repita a senha"/></div><button className="btn primary full" type="submit">Criar conta</button><p className="authbottom">Já tem uma conta? <NavLink to="/login">Voltar ao login</NavLink></p><small className="demo-note">O código do aparelho é provisório e ainda será definido no projeto.</small></form></div>;
}
