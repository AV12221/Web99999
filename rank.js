import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js'
const url  = window.SUPABASE_URL
const key  = window.SUPABASE_ANON_KEY
export const sb = createClient(url, key)

// 登录后把地址保存到全局
window.playerAddr = ''

// 支持：saveScore(addr,score)
export async function saveScore(address, score){
  try{
    const { error } = await sb.from('scores').insert({ address, score })
    if(error) { console.error('saveScore error', error); alert('分数保存失败'); return false }
    console.log('score saved', {address,score}); return true
  }catch(e){ console.error(e); return false }
}

// 监听“支付成功”给奖励分
window.addEventListener('world:paid', async ev=>{
  const add = ev.detail?.reward || 50
  if(typeof window.updateScore === 'function'){
    window.updateScore((window.score||0)+add)
  }
})
