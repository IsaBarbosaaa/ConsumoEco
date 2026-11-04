let csrf=null;
export async function refreshCsrf(){const r=await fetch('/api/auth/csrf',{credentials:'include'});if(!r.ok)throw Error('Falha ao iniciar sessão');csrf=(await r.json()).token;}
export async function api(path,{method='GET',body,...options}={}){
 if(!csrf && method!=='GET')await refreshCsrf();
 const send=()=>fetch(`/api${path}`,{...options,credentials:'include',method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(method!=='GET'?{'X-XSRF-TOKEN':csrf}:{}),...options.headers},body:body?JSON.stringify(body):undefined});
 let response=await send();
 if(response.status===403 && method!=='GET'){
  await refreshCsrf();response=await send();
 }
 if(!response.ok){let error={};try{error=await response.json();}catch{}throw Error(error.message||({401:'É necessário entrar na sua conta',403:'Acesso negado',409:'Registro já existente'}[response.status])||'Erro ao processar solicitação');}
 if(response.status===204)return null;
 return response.json();
}
export function demoRecords(){
 return [
 ['2026-05-01',16,105,220,198],['2026-06-01',15.5,102,210,189],['2026-07-01',15,98,205,184.5],
 ['2026-08-01',14.5,95,200,180],['2026-09-01',14,92,200,180],['2026-10-01',12.5,85,180,162]
 ].map(([month,waterM3,waterCost,energyKwh,energyCost],i)=>({id:i+1,month,waterM3,waterCost,energyKwh,energyCost}));
}
