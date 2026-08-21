import React, { useState, useEffect, useRef } from 'react';

const IconDocument = () => <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconAlert = () => <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconCritical = () => <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconEdit = () => <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconUpload = () => <svg className="w-4 h-4 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const IconFilter = () => <svg className="w-4 h-4 mr-2 inline-block text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;
const IconSort = () => <svg className="w-4 h-4 mr-2 inline-block text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>;

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 border border-slate-200 shadow-sm rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1.5">{value}</h3>
    </div>
    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
      {icon}
    </div>
  </div>
);

const StatusBadge = ({ status, daysLeft }) => {
  if (status === 'Crítico') return <span className="px-2 py-1 inline-flex text-[9px] uppercase font-bold rounded-full bg-red-50 text-red-700 border border-red-200 tracking-wider">Crítico ({daysLeft} d)</span>;
  if (status === 'Atenção') return <span className="px-2 py-1 inline-flex text-[9px] uppercase font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 tracking-wider">Atenção ({daysLeft} d)</span>;
  if (status === 'Encerrado') return <span className="px-2 py-1 inline-flex text-[9px] uppercase font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200 tracking-wider line-through">Encerrado</span>;
  return <span className="px-2 py-1 inline-flex text-[9px] uppercase font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-wider">No Prazo ({daysLeft} d)</span>;
};

export default function App() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(null);
  const [kpis, setKpis] = useState({ ativos: 0, atencao: 0, critico: 0 });
  
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Ativos'); 
  const [ordenacao, setOrdenacao] = useState('vencimento_asc'); 
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 50;
  const fileInputRef = useRef(null);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, filtroStatus, ordenacao]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      // Apontando para o Render
      const response = await fetch('https://tce-contratos-api.onrender.com/api/contratos');
      const data = await response.json();
      
      const listaContratos = Array.isArray(data) ? data : [];
      setContratos(listaContratos);
      
      setKpis({
        ativos: listaContratos.filter(c => c.status !== 'Encerrado').length,
        atencao: listaContratos.filter(c => c.status === 'Atenção').length,
        critico: listaContratos.filter(c => c.status === 'Crítico').length
      });
      setLoading(false);
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      setContratos([]);
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Apontando para o Render
      const response = await fetch('https://tce-contratos-api.onrender.com/api/importar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Planilha importada com sucesso!');
        await carregarDados(); 
      } else {
        alert('Erro ao importar. Verifique o servidor.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setUploading(false);
      event.target.value = ''; 
    }
  };

  const handleGerarMemo = (processo) => {
    // Apontando para o Render
    const url = `https://tce-contratos-api.onrender.com/api/gerar-memorando/${processo}`;
    window.open(url, '_blank');
  };

  const handleNotificar = async (processo) => {
    setEnviandoEmail(processo); 
    try {
      // Apontando para o Render
      const response = await fetch(`https://tce-contratos-api.onrender.com/api/enviar-notificacao/${processo}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.status === 'sucesso') {
        alert('✅ ' + data.mensagem);
      } else {
        alert('❌ Erro: ' + data.mensagem);
      }
    } catch (error) {
      alert('❌ Erro de conexão com o servidor.');
    } finally {
      setEnviandoEmail(null);
    }
  };

  const contratosFiltrados = Array.isArray(contratos) ? contratos.filter(c => {
    if (filtroStatus === 'Ativos' && c.status === 'Encerrado') return false;
    if (filtroStatus !== 'Todos' && filtroStatus !== 'Ativos' && c.status !== filtroStatus) return false;
    
    if (busca) {
      const termo = busca.toLowerCase();
      return (
        String(c.processo || '').toLowerCase().includes(termo) || 
        String(c.objeto || '').toLowerCase().includes(termo) || 
        String(c.fornecedor || '').toLowerCase().includes(termo)
      );
    }
    return true;
  }) : [];

  const contratosOrdenados = [...contratosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case 'vencimento_asc': return (a.dias || 0) - (b.dias || 0);
      case 'vencimento_desc': return (b.dias || 0) - (a.dias || 0);
      case 'valor_desc': return (b.valor_bruto || 0) - (a.valor_bruto || 0);
      case 'valor_asc': return (a.valor_bruto || 0) - (b.valor_bruto || 0);
      default: return 0;
    }
  });

  const totalPaginas = Math.ceil(contratosOrdenados.length / itensPorPagina);
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = paginaAtual * itensPorPagina;
  const contratosExibidos = contratosOrdenados.slice(indexInicio, indexFim);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans antialiased text-slate-800 overflow-hidden flex-col">
      
      {/* CABEÇALHO LIMPO E OFICIAL */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center z-10 shadow-sm shrink-0">
        <img src="/logo-tce.webp" alt="Logo TCE-GO" className="h-8 w-auto object-contain mr-4" />
        <div className="border-l border-slate-200 pl-4">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Sistema de Gestão de Contratos</h1>
          <p className="text-[11px] text-slate-500 font-medium">Serviço de Contratações</p>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="p-6 w-full flex flex-col gap-5 flex-1 overflow-hidden">
        
        {/* CARDS (Fixos) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-5 shrink-0">
          <StatCard title="Contratos Ativos" value={loading ? "..." : kpis.ativos} icon={<IconDocument />} />
          <StatCard title="Alerta Prorrogação" value={loading ? "..." : kpis.atencao} icon={<IconAlert />} />
          <StatCard title="Fase Crítica" value={loading ? "..." : kpis.critico} icon={<IconCritical />} />
          <StatCard title="Aguardando Aditivo" value="0" icon={<IconEdit />} />
        </section>

        {/* CONTAINER DA TABELA */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col w-full flex-1 overflow-hidden min-h-[400px]">
          
          {/* BARRA DE FERRAMENTAS DA TABELA */}
          <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0 flex-wrap gap-4">
            
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Mural de Acompanhamento</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Visão unificada de prazos (Lei 14.133/2021)</p>
              </div>
              
              <div className="relative border-l border-slate-200 pl-6">
                <input 
                  type="text" 
                  placeholder="Buscar fornecedor, objeto..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none w-64 transition-all placeholder-slate-400 text-slate-800" 
                />
              </div>

              <div className="flex items-center gap-5 border-l border-slate-200 pl-6">
                <div className="flex items-center">
                  <IconFilter />
                  <select 
                    value={filtroStatus} 
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="bg-transparent border-none text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-0"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Ativos">Somente Ativos</option>
                    <option value="No Prazo">Status: No Prazo</option>
                    <option value="Atenção">Status: Atenção</option>
                    <option value="Crítico">Status: Crítico</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <IconSort />
                  <select 
                    value={ordenacao} 
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="bg-transparent border-none text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-0"
                  >
                    <option value="vencimento_asc">Vencimento (Próximos)</option>
                    <option value="vencimento_desc">Vencimento (Distantes)</option>
                    <option value="valor_desc">Valor (Maior)</option>
                  </select>
                </div>
              </div>
            </div>

            <input 
              type="file" 
              accept=".xlsx" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
            />
            
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[11px] font-bold tracking-wide hover:bg-slate-800 transition-colors flex items-center disabled:opacity-50 shadow-sm shrink-0"
            >
              <IconUpload /> {uploading ? "Sincronizando..." : "Sincronizar Lote"}
            </button>
          </div>
          
          {/* TABELA COM ROLAGEM EXCLUSIVAMENTE VERTICAL */}
          <div className="w-full flex-1 overflow-y-auto overflow-x-hidden bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-slate-50 shadow-[0_1px_0_0_#e2e8f0]">
                <tr className="text-slate-500">
                  <th className="px-4 py-3 font-semibold w-[20%]">Fornecedor</th>
                  <th className="px-4 py-3 font-semibold w-[25%]">Objeto do Contrato</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Processo</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Início</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Término</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Valor Anual</th>
                  <th className="px-4 py-3 font-semibold w-[12%]">Gestor</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {loading && (
                  <tr>
                    <td colSpan="9" className="px-4 py-16 text-center text-slate-400 font-medium animate-pulse">
                      Sincronizando dados com o servidor...
                    </td>
                  </tr>
                )}

                {!loading && contratosExibidos.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-16 text-center text-slate-500 font-medium">
                      Nenhum contrato encontrado.
                    </td>
                  </tr>
                )}

                {!loading && contratosExibidos.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 break-words leading-relaxed">
                      {c.fornecedor}
                    </td>
                    <td className="px-4 py-3 text-slate-600 break-words leading-relaxed">
                      {c.objeto}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-800 whitespace-nowrap">{c.processo}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.vigencia_inicio}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">{c.vigencia_fim}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900 whitespace-nowrap">{c.valor_formatado}</td>
                    <td className="px-4 py-3 text-slate-600 break-words leading-relaxed">
                      {c.gestor}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                       <StatusBadge status={c.status} daysLeft={c.dias} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {(c.status === 'Crítico' || c.status === 'Atenção') && (
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => handleGerarMemo(c.processo)}
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-200 px-2 py-1.5 rounded-md font-semibold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                            title="Visualizar PDF"
                          >
                            Memo
                          </button>
                          <button 
                            onClick={() => handleNotificar(c.processo)}
                            disabled={enviandoEmail === c.processo}
                            className="bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 font-semibold text-[10px] uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
                          >
                            {enviandoEmail === c.processo ? 'Enviando...' : 'Notificar'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
              </tbody>
            </table>
          </div>

          {/* RODAPÉ COM PAGINAÇÃO */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex justify-between items-center shrink-0">
            <span className="font-medium">
              Mostrando de {Math.min(indexInicio + 1, contratosOrdenados.length)} até {Math.min(indexFim, contratosOrdenados.length)} de {contratosOrdenados.length} registros
            </span>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1 || loading || contratosOrdenados.length === 0}
                className="px-3 py-1.5 border border-slate-300 rounded-md bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors"
              >
                Anterior
              </button>
              
              <span className="font-semibold text-slate-700">
                Página {totalPaginas === 0 ? 0 : paginaAtual} de {totalPaginas}
              </span>
              
              <button 
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas || totalPaginas === 0 || loading}
                className="px-3 py-1.5 border border-slate-300 rounded-md bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}