/**
 * Componentes reutilizáveis, dados de demonstração e funções auxiliares do V.I.T.A.
 * Mantenha aqui apenas itens usados por mais de uma página.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Bell, Bluetooth, CalendarDays, ChevronLeft, ChevronRight, ChevronDown, CircleHelp, Download, FileBarChart, FileText, Gauge, HeartPulse, History, LayoutDashboard, Menu, Phone, RefreshCw, Settings, ShieldCheck, Smartphone, UserRound, Wifi, BatteryMedium, Thermometer, Droplets, Share2, AlertTriangle, CheckCircle2, Siren, Clock3, X } from 'lucide-react';
// Dados fictícios usados apenas para demonstrar a interface.
export const patient = { name: 'João da Silva', age: 68, device: 'Pulseira #0123', battery: 78, lastSync: '18/05/2025 10:45' };
// Série demonstrativa do gráfico principal.
export const readings = [68, 72, 75, 71, 74, 78, 73, 70, 72, 76, 69, 72, 72];
// Alertas fictícios exibidos no protótipo.
export const alerts = [['Temperatura Elevada', '18/05/2025 08:21', '37.9 °C', 'Média', 'warning'], ['Frequência cardíaca normal', '18/05/2025 07:15', '72 bpm', 'Normal', 'normal'], ['Frequência cardíaca elevada', '17/05/2025 21:42', '112 bpm', 'Alta', 'danger'], ['Temperatura Normal', '17/05/2025 07:31', '36.6 °C', 'Normal', 'normal']];
// Histórico de exemplo; não são medições reais.
export const history = [['18/05/2025', '36.8', '72', '98', 'Normal'], ['17/05/2025', '36.6', '78', '97', 'Normal'], ['16/05/2025', '36.7', '70', '98', 'Normal'], ['15/05/2025', '36.5', '69', '99', 'Normal'], ['14/05/2025', '37.2', '75', '97', 'Atenção'], ['13/05/2025', '36.4', '68', '99', 'Normal']];
/** Utilitário de exportação: downloadFile. */
export function downloadFile(filename, content, mime = 'text/plain;charset=utf-8') { const blob = new Blob(['\ufeff', content], { type: mime }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
/** Componente/utilitário compartilhado: csvCell. */
export function csvCell(value) { const text = String(value ?? ''); return '"' + text.replace(/"/g, '""') + '"'; }
/** Utilitário de exportação: downloadCSV. */
export function downloadCSV(filename, headers, rows) { downloadFile(filename, [headers, ...rows].map(row => row.map(csvCell).join(';')).join('\r\n'), 'text/csv;charset=utf-8'); }
/** Utilitário de exportação: downloadReport. */
export function downloadReport(title, subtitle, headers, rows, filename) { const tableHead = headers.map(h => `<th>${escapeHTML(h)}</th>`).join(''); const body = rows.map(row => '<tr>' + row.map(v => `<td>${escapeHTML(v)}</td>`).join('') + '</tr>').join(''); const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>${escapeHTML(title)}</title><style>body{font:14px Arial,sans-serif;color:#18283d;margin:40px}h1{color:#1769c2}p{color:#52647a}table{border-collapse:collapse;width:100%;margin-top:24px}th,td{border:1px solid #dce4ed;padding:10px;text-align:left}th{background:#edf4fb}footer{margin-top:28px;color:#718096;font-size:11px}@media print{button{display:none}}</style><h1>V.I.T.A. · ${escapeHTML(title)}</h1><p>${escapeHTML(subtitle)}</p><table><thead><tr>${tableHead}</tr></thead><tbody>${body}</tbody></table><footer>Relatório demonstrativo gerado localmente pelo protótipo V.I.T.A. · Não substitui avaliação profissional.</footer><script>window.onload=()=>window.print()</script></html>`; downloadFile(filename, html, 'text/html;charset=utf-8'); }
/** Componente/utilitário compartilhado: pdfSafe. */
export function pdfSafe(value) { return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, ' ').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
/** Utilitário de exportação: downloadPDF. */
export function downloadPDF(title, subtitle, headers, rows, filename) {
    const clean = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, ' ').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    const wrap = (value, max) => {
        const words = String(value ?? '').split(/\s+/), out = [];
        let line = '';
        for (const word of words) {
            if ((line + ' ' + word).trim().length > max && line) {
                out.push(line);
                line = word;
            }
            else
                line = (line + ' ' + word).trim();
        }
        if (line)
            out.push(line);
        return out.length ? out : [''];
    };
    const contentLines = [{ text: 'V.I.T.A. | ' + title, size: 18, bold: true, color: [0.08, 0.31, 0.57] }, { text: subtitle, size: 10, color: [0.3, 0.36, 0.43] }, { text: 'Gerado em ' + new Date().toLocaleString('pt-BR'), size: 9, color: [0.38, 0.42, 0.48] }, { text: '', size: 7 }, { text: headers.join('   |   '), size: 10, bold: true, color: [0.08, 0.31, 0.57] }, { text: '─'.repeat(76), size: 8, color: [0.75, 0.8, 0.86] }];
    rows.forEach(row => {
        const chunks = row.map(v => wrap(v, Math.max(10, Math.floor(76 / row.length))));
        const n = Math.max(...chunks.map(c => c.length));
        for (let i = 0; i < n; i++)
            contentLines.push({ text: chunks.map(c => c[i] || '').join('   |   '), size: 9, color: [0.12, 0.17, 0.23], rowEnd: i === n - 1 });
    });
    contentLines.push({ text: '', size: 8 }, { text: 'Relatorio demonstrativo gerado pelo prototipo V.I.T.A.', size: 8, color: [0.42, 0.46, 0.52] }, { text: 'Os dados nao substituem avaliacao profissional.', size: 8, color: [0.42, 0.46, 0.52] });
    const pages = [];
    let page = [], used = 0;
    for (const line of contentLines) {
        const h = line.size > 15 ? 28 : line.text === '' ? 9 : 17;
        if (used + h > 690) {
            pages.push(page);
            page = [];
            used = 0;
        }
        page.push(line);
        used += h;
    }
    if (page.length)
        pages.push(page);
    const objs = [], add = o => (objs.push(o), objs.length), catalog = add(''), pagesId = add(''), font = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'), pageIds = [];
    pages.forEach((items, idx) => {
        let stream = '';
        let y = 790;
        stream += `0.94 0.96 0.98 rg 32 804 531 24 re f\n`;
        items.forEach((line, i) => {
            const [r, g, b] = line.color || [0.12, 0.17, 0.23];
            if (line.bold)
                stream += `0.08 0.31 0.57 rg 32 ${y - 5} 531 18 re f\n1 1 1 rg\n`;
            else
                stream += `${r} ${g} ${b} rg\n`;
            stream += `BT /F1 ${line.size} Tf 42 ${y} Td (${clean(line.text)}) Tj ET\n`;
            y -= line.size > 15 ? 28 : line.text === '' ? 9 : 17;
        });
        stream += `0.55 0.59 0.64 rg BT /F1 8 Tf 500 22 Td (${idx + 1} / ${pages.length}) Tj ET\n`;
        const sid = add(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
        pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${sid} 0 R >>`));
    });
    objs[catalog - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objs[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map(i => `${i} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
    let pdf = '%PDF-1.4\n', offsets = [0];
    objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i < offsets.length; i++)
        pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    pdf += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const bytes = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++)
        bytes[i] = pdf.charCodeAt(i) & 255;
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\.[^.]+$/, '') + '.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
}
/** Escapa caracteres especiais para conteúdo HTML. */
export function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
/** Retorna o primeiro e o segundo nome para exibição. */
export function firstAndSecondName(name) { return String(name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join(' ') || 'Usuário'; }
/** Cabeçalho reutilizável de página. */
export function Head({ title, sub, action }) { return <div className="head"><div><h1>{title}</h1><p>{sub}</p></div>{action}</div>; }
/** Cartão reutilizável de indicador. */
export function Card({ title, icon: I, tone = 'blue', children }) { return <section className="stat"><div className="cardhead"><h3>{title}</h3><span className={'circle ' + tone}><I size={20}/></span></div>{children}</section>; }
/** Indicador visual de bateria. */
export function Battery({ value }) { return <div className="battery"><span><i style={{ width: value + '%' }}/></span><small></small></div>; }
/** Etiqueta visual de classificação. */
export function Pill({ children, tone = 'normal' }) { return <b className={'pill ' + tone}>{children}</b>; }
/** Título de seção com link opcional. */
export function Title({ text, link, to = '/alertas' }) { return <div className="title"><h2>{text}</h2>{link && <NavLink to={to}>{link}</NavLink>}</div>; }
/** Legenda do gráfico do painel. */
export function Legend() { return <div className="legend"><span>● Frequência cardíaca</span><span>● Temperatura</span><span>● SpO₂</span></div>; }
/** Gráfico demonstrativo do painel. */
export function Chart() { return <div className="chartbox"><svg viewBox="0 0 700 220" preserveAspectRatio="none">{[30, 70, 110, 150, 190].map(y => <line key={y} x1="0" x2="700" y1={y} y2={y} className="gridline"/>)}<polyline points={readings.map((v, i) => `${i * 58},${190 - (v - 55) * 2.2}`).join(' ')} className="line blue"/><polyline points={readings.map((v, i) => `${i * 58},${190 - (v - 60) * 1.8}`).join(' ')} className="line purple"/><polyline points={readings.map((v, i) => `${i * 58},${190 - (97 + ((i % 3) * .5) - 94) * 18}`).join(' ')} className="line green"/></svg><div className="xaxis"><span>09:45</span><span>10:00</span><span>10:15</span><span>10:30</span><span>10:45</span></div></div>; }
/** Calendário mensal baseado nas regras reais do calendário gregoriano. */
export function Calendar() {
    const hojeLocal = () => {
        const agora = new Date();
        return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    };
    const chaveData = data => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    const [hoje] = React.useState(hojeLocal);
    const [mesVisivel, setMesVisivel] = React.useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    const [dataSelecionada, setDataSelecionada] = React.useState(() => chaveData(hoje));
    const ano = mesVisivel.getFullYear();
    const mes = mesVisivel.getMonth();
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // Domingo = 0, como no cabeçalho.
    const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
    const hojeChave = chaveData(hoje);
    const datasDemonstrativas = new Set(['2025-05-13', '2025-05-14', '2025-05-17', '2025-05-18', '2025-05-22', '2025-05-24', '2025-05-26']);
    const estadoDaData = data => {
        const chave = chaveData(data);
        if (chave === hojeChave) return 'hoje';
        if (['2025-05-22', '2025-05-26'].includes(chave)) return 'alteracao-elevada';
        if (['2025-05-13', '2025-05-14'].includes(chave)) return 'alteracao-moderada';
        if (datasDemonstrativas.has(chave)) return 'utilizado';
        return 'sem-registro';
    };
    // Seis semanas fixas (42 células) mantêm cabeçalho, dias e linhas perfeitamente alinhados.
    const celulas = Array.from({ length: 42 }, (_, indice) => {
        const numeroDia = indice - primeiroDiaSemana + 1;
        return numeroDia >= 1 && numeroDia <= quantidadeDias ? new Date(ano, mes, numeroDia) : null;
    });
    const dataEscolhida = new Date(`${dataSelecionada}T12:00:00`);
    const dataEscolhidaNoMes = dataEscolhida.getFullYear() === ano && dataEscolhida.getMonth() === mes;
    const estadoEscolhido = dataEscolhidaNoMes ? estadoDaData(dataEscolhida) : 'sem-registro';
    const mudarMes = quantidade => setMesVisivel(new Date(ano, mes + quantidade, 1));
    const nomeMes = mesVisivel.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const nomeDataEscolhida = dataEscolhida.toLocaleDateString('pt-BR', { dateStyle: 'long' });
    const descricaoEstado = estado => ({
        'sem-registro': 'Nenhum registro demonstrativo nesta data.',
        'utilizado': 'Há registros demonstrativos nesta data.',
        'alteracao-moderada': 'Há uma alteração moderada demonstrativa nesta data.',
        'alteracao-elevada': 'Há uma alteração elevada demonstrativa nesta data.',
        'hoje': datasDemonstrativas.has(hojeChave) ? 'Hoje há registro demonstrativo.' : 'Hoje; nenhum registro demonstrativo cadastrado.'
    }[estado] || 'Nenhum registro demonstrativo nesta data.');
    return <>
        <div className="calnav">
            <button type="button" className="icon" onClick={() => mudarMes(-1)} aria-label="Mês anterior"><ChevronLeft /></button>
            <b aria-live="polite">{nomeMes}</b>
            <button type="button" className="icon" onClick={() => mudarMes(1)} aria-label="Próximo mês"><ChevronRight /></button>
        </div>
        <div className="week" role="row" aria-label="Dias da semana">{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => <span role="columnheader" key={dia}>{dia}</span>)}</div>
        <div className="calgrid" role="grid" aria-label={`Calendário de ${nomeMes}`}>
            {celulas.map((data, indice) => {
                if (!data) return <div className="cal-cell cal-cell-empty" role="gridcell" aria-hidden="true" key={`vazia-${ano}-${mes}-${indice}`}><span /></div>;
                const chave = chaveData(data);
                const estado = estadoDaData(data);
                const selecionada = dataSelecionada === chave;
                const hojeAtual = chave === hojeChave;
                return <div className="cal-cell" role="gridcell" key={chave}>
                    <button type="button" className={`dia-calendario ${estado}${selecionada ? ' selecionado' : ''}`} onClick={() => setDataSelecionada(chave)} aria-pressed={selecionada} aria-current={hojeAtual ? 'date' : undefined} aria-label={`${data.toLocaleDateString('pt-BR', { dateStyle: 'full' })}. ${descricaoEstado(estado)}`} title={descricaoEstado(estado)}>
                        <span>{data.getDate()}</span>
                        {['alteracao-moderada', 'alteracao-elevada'].includes(estado) && <i aria-hidden="true" />}
                    </button>
                </div>;
            })}
        </div>
        <div className="callegend" aria-label="Legenda do calendário"><span><i className="legenda-utilizado" /> Dia utilizado</span><span><i className="legenda-moderada" /> Alteração moderada</span><span><i className="legenda-elevada" /> Alteração elevada</span></div>
        <p className="calendar-detail" aria-live="polite"><b>{nomeDataEscolhida}</b><span>{descricaoEstado(estadoEscolhido)}</span></p>
    </>;
}
export function Alerts() { return <>{alerts.map((a, i) => <div className="alertrow" key={i}>{a[4] === 'normal' ? <CheckCircle2 /> : <AlertTriangle />}<div><b>{a[0]}</b><small>{a[1]}</small></div><strong>{a[2]}</strong><Pill tone={a[4]}>{a[3]}</Pill></div>)}</>; }
/** Indicador de resumo diário. */
export function Today({ icon: I, tone, name, val }) { return <div className="todayitem"><span className={'mini ' + tone}><I /></span><div><b>{name}</b><small>{val}</small></div><Pill>Normal</Pill></div>; }
/** Botão reutilizável de ação rápida. */
export function Quick({ icon: I, text, onClick }) { return <button className="quickbtn" onClick={onClick} type="button"><I /><span>{text}</span></button>; }
/** Cabeçalho de uma subseção de configurações. */
export function PageIntro({ title, sub }) { return <><Head title={title} sub={sub}/><p><NavLink className="backlink" to="/configuracoes">← Voltar para Configurações</NavLink></p></>; }
/** Campo reutilizável de formulário. */
export function Field({ label, value, onChange, type = 'text', placeholder = '', required = false, readOnly = false }) { return <label className="formfield"><span>{label}</span><input type={type} value={value ?? ''} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} required={required} readOnly={readOnly}/></label>; }
/** Aplica a máscara de CPF. */
export function formatCPF(v) { return v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); }
/** Aplica a máscara de telefone. */
export function formatPhone(v) {
    let d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2)
        return d.length ? '(' + d : '';
    if (d.length <= 6)
        return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10)
        return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
/** Lê e persiste preferências no armazenamento local do navegador. */
export function useSaved(key, initial) {
    const [value, setValue] = React.useState(() => {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? initial;
        }
        catch {
            return initial;
        }
    });
    React.useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
    return [value, setValue];
}
// Opções disponíveis para agendar medições no protótipo.
export const intervals = [['15', '15 minutos'], ['30', '30 minutos'], ['45', '45 minutos'], ['60', '1 hora'], ['90', '1 hora e 30 minutos'], ['120', '2 horas'], ['150', '2 horas e 30 minutos'], ['180', '3 horas'], ['240', '4 horas'], ['300', '5 horas'], ['360', '6 horas']];
