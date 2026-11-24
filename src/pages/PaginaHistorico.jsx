/** Tela do histórico de medições. */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Bell, Bluetooth, CalendarDays, ChevronLeft, ChevronRight, ChevronDown, CircleHelp, Download, FileBarChart, FileText, Gauge, HeartPulse, History, LayoutDashboard, Menu, Phone, RefreshCw, Settings, ShieldCheck, Smartphone, UserRound, Wifi, BatteryMedium, Thermometer, Droplets, Share2, AlertTriangle, CheckCircle2, Siren, Clock3, X } from 'lucide-react';
import { patient, readings, alerts, history, intervals, downloadFile, downloadCSV, downloadPDF, firstAndSecondName, formatCPF, formatPhone, useSaved, Head, Card, Battery, Pill, Title, Legend, Chart, Calendar, Alerts, Today, Quick, PageIntro, Field } from '../componentesCompartilhados.jsx';
/** Mantém a lógica da tela de histórico. */
export function HistoryPage() {
    const [period, setPeriod] = React.useState('all'), [parameter, setParameter] = React.useState('all'), [search, setSearch] = React.useState(''), [sort, setSort] = React.useState('newest'), [applied, setApplied] = React.useState({ period: 'all', parameter: 'all', search: '', sort: 'newest' }), [notice, setNotice] = React.useState('');
    const info = { temperature: { label: 'Temperatura', index: 1, unit: '°C' }, heart: { label: 'Frequência cardíaca', index: 2, unit: 'bpm' }, spo2: { label: 'SpO₂', index: 3, unit: '%' } };
    let filtered = [...history];
    if (applied.period !== 'all')
        filtered = filtered.slice(0, Number(applied.period));
    if (applied.parameter !== 'all')
        filtered = filtered.filter(r => String(r[info[applied.parameter].index] ?? '').trim() !== '');
    if (applied.search.trim()) {
        const q = applied.search.toLocaleLowerCase('pt-BR');
        filtered = filtered.filter(r => r.some(v => String(v).toLocaleLowerCase('pt-BR').includes(q)));
    }
    if (applied.sort === 'oldest')
        filtered.reverse();
    const visibleRows = filtered.map(r => applied.parameter === 'all' ? [r[0], r[1] + ' °C', r[2] + ' bpm', r[3] + '%', r[4]] : [r[0], String(r[info[applied.parameter].index]) + ' ' + info[applied.parameter].unit, r[5]]);
    const headers = applied.parameter === 'all' ? ['Data', 'Temperatura', 'Frequência cardíaca', 'SpO₂', 'Classificação'] : ['Data', info[applied.parameter].label, 'Classificação'];
    const apply = () => { setApplied({ period, parameter, search, sort }); setNotice('Filtros aplicados.'); setTimeout(() => setNotice(''), 2200); };
    const reset = () => { setPeriod('all'); setParameter('all'); setSearch(''); setSort('newest'); setApplied({ period: 'all', parameter: 'all', search: '', sort: 'newest' }); setNotice('Filtros limpos.'); setTimeout(() => setNotice(''), 2200); };
    const exportHistory = () => downloadCSV(`vita-historico-${new Date().toISOString().slice(0, 10)}.csv`, headers, visibleRows);
    const exportPDF = () => downloadPDF('Histórico de medições', `Filtros: ${applied.period === 'all' ? 'todos os registros' : 'últimos ' + applied.period + ' registros'}; parâmetro: ${applied.parameter === 'all' ? 'todos' : info[applied.parameter].label}; registros: ${visibleRows.length}`, headers, visibleRows, `vita-historico-${new Date().toISOString().slice(0, 10)}.pdf`);
    return <><Head title="Meu Histórico" sub="Consulte, filtre, ordene e exporte as medições registradas pelo seu V.I.T.A." action={<div className="headright"><button className="btn outline" onClick={exportHistory}><Download size={15}/> Exportar CSV</button><button className="btn primary" onClick={exportPDF}><FileText size={15}/> Exportar PDF</button></div>}/>
 <section className="panel history-controls"><div className="filters"><div><label htmlFor="history-period">Período</label><select id="history-period" value={period} onChange={e => setPeriod(e.target.value)}><option value="7">Últimos 7 registros</option><option value="30">Últimos 30 registros</option><option value="all">Todos os registros disponíveis</option></select></div><div><label htmlFor="history-param">Parâmetro</label><select id="history-param" value={parameter} onChange={e => setParameter(e.target.value)}><option value="all">Todos os parâmetros</option><option value="temperature">Temperatura</option><option value="heart">Frequência cardíaca</option><option value="spo2">SpO₂</option></select></div><div><label htmlFor="history-sort">Ordenação</label><select id="history-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Mais recentes primeiro</option><option value="oldest">Mais antigos primeiro</option></select></div><div className="history-search"><label htmlFor="history-search">Buscar</label><input id="history-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Data, valor ou classificação" onKeyDown={e => {
            if (e.key === 'Enter')
                apply();
        }}/></div><button className="btn primary" onClick={apply}>Aplicar filtros</button><button className="btn light" onClick={reset}>Limpar</button></div><div className="history-summary"><b>{filtered.length} registro(s)</b><span>Dados demonstrativos do protótipo</span></div>{notice && <p className="inline-notice" role="status">{notice}</p>}</section>
 <section className="panel table"><div className="table-title-row"><Title text="Medições registradas"/><button className="btn outline" onClick={exportPDF}><Download size={15}/> PDF dos resultados</button></div>{visibleRows.length ? <div className="table-scroll"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{visibleRows.map((r, i) => <tr key={`${r[0]}-${i}`}>{r.map((v, j) => <td key={j}>{j === r.length - 1 && headers[j] === 'Classificação' ? <Pill tone={v === 'Normal' ? 'normal' : v === 'Elevado' ? 'danger' : 'warning'}>{v}</Pill> : v}</td>)}</tr>)}</tbody></table></div> : <div className="empty-state"><History size={28}/><b>Nenhum registro encontrado</b><span>Altere a busca ou limpe os filtros para visualizar medições.</span><button className="btn light" onClick={reset}>Limpar filtros</button></div>}<p className="muted">A exportação respeita os filtros e a ordenação aplicados. CSV pode ser aberto em planilhas; PDF é um documento pronto para compartilhar ou arquivar.</p></section></>;
}
