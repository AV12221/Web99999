const SUPABASE_URL = 'https://tgmhvsmcoojxpnrrqgsp.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbWh2c21jb29qeHBucnJxZ3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjU2NTUsImV4cCI6MjA3NjA0MTY1NX0._dPGJGmyr8JUB4sUZjZ7GvAeyUhAjza_vKgJ5LwEEco
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON)

async function refreshRank(){
  const { data } = await sb.from('scores').select('name,score').order('score',{ascending:false}).limit(20)
  const ol = document.querySelector('#rankList'); if(!ol) return
  ol.innerHTML = ''
  ;(data||[]).forEach((r,i)=>{
    const li=document.createElement('li'); li.textContent = `${i+1}. ${r.name} - ${r.score}`; ol.appendChild(li)
  })
}
refreshRank()

window.submitScore = async ()=>{
  const name = document.querySelector('#nick').value.trim() || '玩家'
  const score = Number(document.querySelector('#finalScore').textContent||'0')
  localStorage.setItem('wg_name', name)
  await sb.from('scores').insert({ name, score })
  await refreshRank()
  document.querySelector('#modal').hidden = true
}
