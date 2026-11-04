import React,{useState,useEffect,useMemo} from 'react';
import{createRoot}from'react-dom/client';
import{Home,Leaf,Droplets,Zap,LayoutDashboard,Calculator,LogOut,Plus,UserRound,Mail,Lock,Eye,EyeOff,Save,ChevronRight,ArrowLeft,CheckCircle2,AlertCircle,CalendarDays,Trash2,TrendingDown,TrendingUp,BookOpen,Menu,X,ShieldCheck,ChartNoAxesCombined}from'lucide-react';
import{LineChart,Line,CartesianGrid,XAxis,YAxis,Tooltip,ResponsiveContainer,Legend}from'recharts';
import{api,refreshCsrf,demoRecords}from'./api';
import './style.css';
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const n=(v,d=1)=>Number(v||0).toLocaleString('pt-BR',{maximumFractionDigits:d,minimumFractionDigits:d});
const monthLabel=v=>new Date(`${v.slice(0,7)}-15T12:00:00`).toLocaleDateString('pt-BR',{month:'short',year:'2-digit'}).replace('.','');
const monthFull=v=>new Date(`${v.slice(0,7)}-15T12:00:00`).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
const percent=(current,old)=>old>0?((current-old)/old)*100:null;
function App(){
 const [demo,setDemo]=useState(false),[user,setUser]=useState(null),[page,setPage]=useState('login'),[records,setRecords]=useState([]);
 const [contents,setContents]=useState([]),[busy,setBusy]=useState(true),[toast,setToast]=useState(null),[mobile,setMobile]=useState(false);
 const [form,setForm]=useState({month:new Date().toISOString().slice(0,7),waterM3:'',waterCost:'',energyKwh:'',energyCost:''});
 const [editId,setEditId]=useState(null);
 const alert=(message,type='success')=>{setToast({message,type});window.setTimeout(()=>setToast(null),4800)};
 useEffect(()=>{(async()=>{try{await refreshCsrf();const me=await api('/auth/me');setUser(me);setPage('register-consumption');await loadRecords();}catch{}finally{setBusy(false)}})()},[]);
 const loadRecords=async()=>{try{setRecords(await api('/consumptions'))}catch(e){console.warn(e)}};
 const go=v=>{setPage(v);setMobile(false);window.scrollTo(0,0)};
 const enterDemo=()=>{setDemo(true);setUser({name:'Morador Exemplo',email:'morador.exemplo@consumoeco.test'});setRecords(demoRecords());go('register-consumption');alert('Modo demonstração: os dados ficam apenas nesta página')};
 const exit=async()=>{if(!demo){try{await api('/auth/logout',{method:'POST'})}catch{}}setUser(null);setDemo(false);setRecords([]);go('login');try{await refreshCsrf()}catch{}};
 const save=async payload=>{try{
  let result;if(demo){result={...payload,id:editId||Date.now()};setRecords(old=>[...old.filter(x=>x.id!==editId),result].sort((a,b)=>a.month.localeCompare(b.month)))}
  else {result=await api(`/consumptions${editId?'/'+editId:''}`,{method:editId?'PUT':'POST',body:payload});await loadRecords()}
  setEditId(null);setForm({month:new Date().toISOString().slice(0,7),waterM3:'',waterCost:'',energyKwh:'',energyCost:''});alert('Registro salvo com sucesso!');go('results');
 }catch(e){alert(e.message,'error')}};
 const deleteRecord=async id=>{if(!window.confirm('Excluir este registro de consumo?'))return;try{if(demo)setRecords(old=>old.filter(x=>x.id!==id));else{await api('/consumptions/'+id,{method:'DELETE'});await loadRecords()}alert('Registro excluído')}catch(e){alert(e.message,'error')}};
 const editRecord=x=>{setForm({month:x.month.slice(0,7),waterM3:String(x.waterM3),waterCost:String(x.waterCost),energyKwh:String(x.energyKwh),energyCost:String(x.energyCost)});setEditId(x.id);go('register-consumption')};
 if(busy)return <div className="splash"><Brand/><p>Preparando sua experiência...</p></div>;
 if(!user)return <Login onDemo={enterDemo} onLogin={async()=>{setUser(await api('/auth/me'));await loadRecords();go('register-consumption')}} onError={v=>alert(v,'error')} />;
 const links=[['register-consumption',Plus,'Registrar consumo'],['results',LayoutDashboard,'Resultados'],['calculator',Calculator,'Calculadora'],['tips',BookOpen,'Dicas sustentáveis']];
 return <div className="app-shell">
  <aside className={'sidebar '+(mobile?'open':'')}><div className="sidebar-top"><Brand small/><button className="icon-button close-mobile" aria-label="Fechar menu" onClick={()=>setMobile(false)}><X/></button></div>
  <nav aria-label="Menu principal">{links.map(([id,I,label])=><button key={id} className={'nav-link '+(page===id?'active':'')} onClick={()=>go(id)}><I size={21}/>{label}</button>)}</nav>
  <div className="nav-bottom"><button className="nav-link" onClick={exit}><LogOut size={21}/> Sair</button><span>ConsumoEco • MVP 1.0</span></div></aside>
  {mobile&&<button className="mobile-overlay" aria-label="Fechar menu" onClick={()=>setMobile(false)}/>}
  <main className="workspace"><header className="topbar"><button className="icon-button menu-mobile" onClick={()=>setMobile(true)} aria-label="Abrir menu"><Menu/></button><div className="top-logo"><Leaf size={23}/> ConsumoEco</div><div className="account"><span className="avatar"><UserRound size={22}/></span><span>{user.name}</span>{demo&&<span className="demo-label">Demo</span>}</div></header>
  <div className="workspace-content">
  {page==='register-consumption'&&<Entry form={form} setForm={setForm} editId={editId} onSubmit={save} onCancel={()=>go('results')} />}
  {page==='results'&&<Results records={records} onNew={()=>{setEditId(null);setForm({month:new Date().toISOString().slice(0,7),waterM3:'',waterCost:'',energyKwh:'',energyCost:''});go('register-consumption')}} onEdit={editRecord} onDelete={deleteRecord} onCalculator={()=>go('calculator')}/>}
  {page==='calculator'&&<CalculatorPage records={records}/>}
  {page==='tips'&&<Tips contents={contents} setContents={setContents} demo={demo}/>}
  </div></main>{toast&&<div role="status" className={'toast '+toast.type}>{toast.type==='success'?<CheckCircle2/>:<AlertCircle/>}{toast.message}</div>}
 </div>
}
function Brand({small=false}){return <div className={'brand '+(small?'brand-small':'')}><span className="brand-icon"><Home size={36}/><Leaf className="brand-leaf" size={26}/></span><span>Consumo<span className="accent">Eco</span></span></div>}
function Login({onDemo,onLogin,onError}){
 const[signup,setSignup]=useState(false),[show,setShow]=useState(false),[loading,setLoading]=useState(false),[values,setValues]=useState({name:'',email:'',password:''});
 async function submit(e){e.preventDefault();setLoading(true);try{if(signup){await api('/auth/register',{method:'POST',body:values});setSignup(false);onError('Conta criada! Entre com seu e-mail e senha.');}else{await api('/auth/login',{method:'POST',body:values});await refreshCsrf();await onLogin();}}catch(e){onError(e.message)}finally{setLoading(false)}}
 return <div className="login-page"><div className="login-brand"><Brand/><p>Consumo consciente no Condomínio Vila Alpina</p></div><div className="login-layout"><div className="login-aside"><div className="round-icon water"><Droplets/></div><h3>Água</h3><p>Controle e economia</p></div>
 <div className="login-card"><h1>{signup?'Crie sua conta':'Bem-vindo ao ConsumoEco'}</h1><p className="login-subtitle">Acompanhe o consumo de água e energia da sua residência, identifique oportunidades de economia e adote hábitos mais sustentáveis.</p>
 <form onSubmit={submit}>{signup&&<label>Nome completo <b>*</b><span className="input-icon"><UserRound/><input required maxLength={120} value={values.name} onChange={e=>setValues({...values,name:e.target.value})} placeholder="Seu nome"/></span></label>}
 <label>E-mail <b>*</b><span className="input-icon"><Mail/><input required type="email" autoComplete="email" value={values.email} onChange={e=>setValues({...values,email:e.target.value})} placeholder="Ex.: morador@exemplo.com"/></span></label>
 <label>Senha <b>*</b><span className="input-icon"><Lock/><input required minLength={signup?10:1} type={show?'text':'password'} autoComplete={signup?'new-password':'current-password'} value={values.password} onChange={e=>setValues({...values,password:e.target.value})} placeholder={signup?'Mínimo de 10 caracteres':'Digite sua senha'}/><button className="eye-btn" type="button" aria-label={show?'Ocultar senha':'Mostrar senha'} onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></span></label>
 <button className="primary-btn full" disabled={loading}>{loading?'Processando...':signup?'Criar conta':'Entrar'} <ChevronRight size={20}/></button></form>
 <p className="change-auth">{signup?'Já tem uma conta?':'Não tem uma conta?'} <button onClick={()=>setSignup(!signup)}>{signup?'Entrar':'Criar conta'}</button></p>
 <div className="login-separator">ou</div><button className="demo-btn" onClick={onDemo}><Leaf size={19}/> Explorar demonstração sem cadastro</button><p className="login-footnote"><ShieldCheck size={15}/> Seus registros ficam associados à sua conta.</p>
 </div><div className="login-aside"><div className="round-icon energy"><Zap/></div><h3>Energia</h3><p>Acompanhamento e redução de gastos</p></div></div><div className="eco-hills"/></div>
}
function Entry({form,setForm,onSubmit,onCancel,editId}){
 const change=(key,val)=>setForm(old=>({...old,[key]:val}));
 const submit=e=>{e.preventDefault();onSubmit({month:form.month+'-01',waterM3:Number(form.waterM3),waterCost:Number(form.waterCost),energyKwh:Number(form.energyKwh),energyCost:Number(form.energyCost)})};
 return <><div className="page-heading"><div><h1>{editId?'Editar consumo mensal':'Registrar consumo mensal'}</h1><p>Informe o consumo de água e energia da sua residência.</p></div><span className="heading-chip"><Leaf size={17}/> Consumo consciente</span></div>
 <form className="surface entry-card" onSubmit={submit}><div className="section-heading"><span className="section-icon"><CalendarDays/></span><div><h2>Dados do consumo</h2><p>Preencha os campos abaixo para registrar o consumo do mês.</p></div></div>
 <div className="entry-fields"><label className="field full-width">Mês de referência <i>*</i><input type="month" max={new Date().toISOString().slice(0,7)} required value={form.month} onChange={e=>change('month',e.target.value)}/></label>
 <label className="field">Consumo de água (m³) <i>*</i><span className="field-with-icon"><Droplets className="blue"/><input type="number" required min="0" step="0.01" placeholder="Ex.: 12,50" value={form.waterM3} onChange={e=>change('waterM3',e.target.value)}/></span></label>
 <label className="field">Valor da água (R$) <i>*</i><span className="field-with-icon"><span className="cash-icon">R$</span><input type="number" required min="0" step="0.01" placeholder="Ex.: 85,00" value={form.waterCost} onChange={e=>change('waterCost',e.target.value)}/></span></label>
 <label className="field">Consumo de energia (kWh) <i>*</i><span className="field-with-icon"><Zap className="orange"/><input type="number" required min="0" step="0.01" placeholder="Ex.: 180" value={form.energyKwh} onChange={e=>change('energyKwh',e.target.value)}/></span></label>
 <label className="field">Valor da energia (R$) <i>*</i><span className="field-with-icon"><span className="cash-icon">R$</span><input type="number" required min="0" step="0.01" placeholder="Ex.: 162,00" value={form.energyCost} onChange={e=>change('energyCost',e.target.value)}/></span></label></div>
 <div className="info"><AlertCircle size={19}/> Os campos marcados com * são obrigatórios. Valores devem ser maiores ou iguais a zero.</div>
 <div className="form-actions"><button type="button" className="outline-btn" onClick={onCancel}><ArrowLeft size={20}/> Voltar</button><button className="primary-btn"><Save size={20}/> Salvar registro</button></div>
 </form></>;
}
function Kpi({type,title,value,change,detail}){const positive=change!==null&&change<=0;return <div className={'kpi '+type}><div className="kpi-top"><span className="round-icon small">{type==='water'?<Droplets/>:type==='energy'?<Zap/>:<ChartNoAxesCombined/>}</span><div><strong>{title}</strong><div className="kpi-value">{value}</div></div></div><div className={'kpi-change '+(positive?'good':change===null?'neutral':'bad')}>{change===null?'Sem comparação':<>{positive?<TrendingDown size={19}/>:<TrendingUp size={19}/>} {n(Math.abs(change))}%</>}{change!==null&&<small> em relação ao mês anterior</small>}</div></div>}
function Results({records,onNew,onEdit,onDelete,onCalculator}){
 const sorted=[...records].sort((a,b)=>a.month.localeCompare(b.month));
 const[cur,previous]=[sorted.at(-1),sorted.at(-2)];
 const [filter,setFilter]=useState('6');
 const selected=filter==='all'?sorted:sorted.slice(-Number(filter));
 const chart=selected.map(r=>({name:monthLabel(r.month),water:Number(r.waterM3),energy:Number(r.energyKwh)}));
 const changes=cur&&previous?{w:percent(cur.waterM3,previous.waterM3),e:percent(cur.energyKwh,previous.energyKwh),t:percent(Number(cur.waterCost)+Number(cur.energyCost),Number(previous.waterCost)+Number(previous.energyCost))}:{w:null,e:null,t:null};
 return <><div className="page-heading"><div><h1>Resultados do consumo</h1><p>Acompanhe a evolução, compare períodos e identifique oportunidades de economia.</p></div></div>
 <div className="filter-row"><label>Período <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="6">Últimos 6 meses</option><option value="12">Últimos 12 meses</option><option value="all">Todo o histórico</option></select></label><span>{sorted.length} registro(s) cadastrado(s)</span></div>
 {cur?<><div className="kpi-grid"><Kpi type="water" title="Água" value={`${n(cur.waterM3,2)} m³`} change={changes.w}/><Kpi type="energy" title="Energia" value={`${n(cur.energyKwh,0)} kWh`} change={changes.e}/><Kpi type="total" title="Gasto total" value={money(Number(cur.waterCost)+Number(cur.energyCost))} change={changes.t}/></div>
 <div className="charts-grid"><ChartCard title="Evolução do consumo de água" data={chart} dataKey="water" unit="m³" stroke="#168ccc"/><ChartCard title="Evolução do consumo de energia" data={chart} dataKey="energy" unit="kWh" stroke="#f6a11e"/></div>
 <div className="insights-grid"><div className="surface insight"><div className="insight-title"><Leaf/><h2>{changes.w!==null&&changes.w<0?'Boa evolução!':'Acompanhe seus hábitos'}</h2></div><p>{changes.w!==null?`Sua variação de água foi ${n(changes.w)}% e de energia ${n(changes.e)}% em relação ao mês anterior. Continue acompanhando seus hábitos.`:'Cadastre outro mês para visualizar comparações e identificar oportunidades de economia.'}</p></div><MiniCalc record={cur}/></div>
 <div className="surface history"><div className="history-heading"><h2>Histórico de registros</h2><p>Edite ou exclua informações do seu próprio consumo.</p></div><div className="table-scroll"><table><thead><tr><th>Mês</th><th>Água (m³)</th><th>Energia (kWh)</th><th>Total (R$)</th><th>Ações</th></tr></thead><tbody>{[...sorted].reverse().map(r=><tr key={r.id}><td>{monthFull(r.month)}</td><td>{n(r.waterM3,2)}</td><td>{n(r.energyKwh,0)}</td><td>{money(Number(r.waterCost)+Number(r.energyCost))}</td><td><button className="text-link" onClick={()=>onEdit(r)}>Editar</button> <button className="text-link danger" aria-label={'Excluir '+r.month} onClick={()=>onDelete(r)}><Trash2 size={17}/></button></td></tr>)}</tbody></table></div></div>
 </>:<div className="surface empty-state"><Droplets size={44}/><h2>Seu histórico começa aqui</h2><p>Registre água e energia do primeiro mês para acompanhar a evolução.</p><button className="primary-btn" onClick={onNew}><Plus/> Registrar primeiro mês</button></div>}
 <div className="results-actions"><button className="outline-btn" onClick={onNew}><Plus size={20}/> Novo registro</button><button className="primary-btn" onClick={onCalculator}><Calculator size={20}/> Abrir calculadora</button></div>
 </>
}
function ChartCard({title,data,dataKey,unit,stroke}){return <div className="surface chart-card"><h2>{title}</h2><div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{top:12,right:20,left:0,bottom:10}}><CartesianGrid stroke="#e8eeea" strokeDasharray="4 4"/><XAxis dataKey="name" tick={{fontSize:12,fill:'#62716e'}}/><YAxis width={40} tick={{fontSize:12,fill:'#62716e'}}/><Tooltip formatter={v=>[`${n(v,1)} ${unit}`,title]}/><Line type="monotone" dataKey={dataKey} name={unit} stroke={stroke} strokeWidth={3} dot={{r:4,fill:'#fff',strokeWidth:2}}/></LineChart></ResponsiveContainer></div><p className="chart-access">Valores: {data.map(r=>`${r.name} ${n(r[dataKey],1)} ${unit}`).join(' · ')||'Nenhum registro'}</p></div>}
function MiniCalc({record}){const[goal,setGoal]=useState(10),[water,setWater]=useState(false);
 const quantity=water?Number(record.waterM3):Number(record.energyKwh),cost=water?Number(record.waterCost):Number(record.energyCost);
 return <div className="surface mini-calc"><div className="section-heading"><span className="section-icon"><Calculator/></span><div><h2>Calculadora de economia</h2><p>Simule uma redução e veja o resultado estimado.</p></div></div>
 <div className="mini-form"><label>Recurso<select value={water?'water':'energy'} onChange={e=>setWater(e.target.value==='water')}><option value="energy">Energia</option><option value="water">Água</option></select></label><label>Redução desejada (%)<input type="number" min="0" max="100" value={goal} onChange={e=>setGoal(Math.max(0,Math.min(100,Number(e.target.value))))}/></label></div>
 <div className="calc-result"><CheckCircle2/> Economia estimada de <strong>{n(quantity*goal/100,2)} {water?'m³':'kWh'}</strong> e <strong>{money(cost*goal/100)}</strong> ao mês.</div><p className="fineprint">Estimativa proporcional; a fatura real pode variar devido a tarifas e impostos.</p></div>}
function CalculatorPage({records}){const[r,setR]=useState('energy'),[quantity,setQuantity]=useState('180'),[cost,setCost]=useState('162'),[goal,setGoal]=useState('10');
 const last=[...records].sort((a,b)=>a.month.localeCompare(b.month)).at(-1);
 const onResource=v=>{setR(v);if(last){setQuantity(String(v==='water'?last.waterM3:last.energyKwh));setCost(String(v==='water'?last.waterCost:last.energyCost))}};
 const valid=Number(quantity)>=0&&Number(cost)>=0&&Number(goal)>=0&&Number(goal)<=100;
 return <><div className="page-heading"><div><h1>Calculadora de economia</h1><p>Descubra o impacto estimado de pequenas mudanças.</p></div></div><div className="surface calc-page"><div className="section-heading"><span className="section-icon"><Calculator/></span><div><h2>Simule sua economia</h2><p>Use seus valores mensais e escolha uma meta de redução.</p></div></div><div className="entry-fields"><label className="field">Recurso<select value={r} onChange={e=>onResource(e.target.value)}><option value="energy">Energia elétrica</option><option value="water">Água</option></select></label><label className="field">Consumo atual ({r==='water'?'m³':'kWh'})<input type="number" min="0" step="0.01" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label><label className="field">Despesa mensal (R$)<input type="number" min="0" step="0.01" value={cost} onChange={e=>setCost(e.target.value)}/></label><label className="field">Redução desejada (%)<input type="number" min="0" max="100" value={goal} onChange={e=>setGoal(e.target.value)}/></label></div>{valid?<div className="calc-big-result"><Leaf size={35}/><div><h3>Seu potencial de economia</h3><strong>{n(Number(quantity)*Number(goal)/100,2)} {r==='water'?'m³':'kWh'} e {money(Number(cost)*Number(goal)/100)} / mês</strong><p>Se o consumo diminuir {goal}%, a economia financeira proporcional estimada será {money(Number(cost)*Number(goal)/100)}.</p></div></div>:<div className="info error">Informe valores não negativos e um percentual de 0 a 100.</div>}<p className="fineprint">As estimativas são aproximadas e não representam previsão de fatura. Tarifas, cobranças fixas e impostos podem alterar a economia real.</p></div></>
}
const defaultTips=[{id:1,title:'Banhos mais curtos',category:'Água',description:'Reduzir o tempo no chuveiro pode economizar água e energia.'},{id:2,title:'Verifique vazamentos',category:'Água',description:'Acompanhe torneiras e descargas para evitar perdas.'},{id:3,title:'Use iluminação LED',category:'Energia',description:'Lâmpadas LED utilizam menos energia para a mesma iluminação.'},{id:4,title:'Evite o desperdício',category:'Consumo consciente',description:'Planeje compras e aproveite melhor os alimentos.'},{id:5,title:'Separe resíduos',category:'Reciclagem',description:'Faça a separação dos resíduos conforme a coleta disponível.'}];
function Tips({contents,setContents,demo}){useEffect(()=>{if(demo){setContents(defaultTips);return}api('/content').then(setContents).catch(()=>setContents(defaultTips))},[demo]);const[category,setCategory]=useState('Todas');const categories=['Todas',...new Set(contents.map(t=>t.category))];return <><div className="page-heading"><div><h1>Dicas sustentáveis</h1><p>Pequenas ações que fazem diferença no seu dia a dia.</p></div></div><div className="tip-filters">{categories.map(c=><button className={category===c?'active':''} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="tip-grid">{contents.filter(c=>category==='Todas'||c.category===category).map(c=><article key={c.id} className="surface tip-card"><span><Leaf/></span><small>{c.category}</small><h2>{c.title}</h2><p>{c.description}</p></article>)}</div></>}

createRoot(document.getElementById('root')).render(<App/>);
