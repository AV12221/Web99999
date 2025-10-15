import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/** 保存分数 */
export async function saveScore(player, score){
  const p = String(player||'guest').slice(0,24)
  const s = Math.max(0, Number(score)||0)
  const { error } = await sb.from('scores').insert({ player:p, score:s })
  if(error) console.error('saveScore error:', error)
}

/** 取前 n 名 */
export async function getTop(n=10){
  const { data, error } = await sb
    .from('scores')
    .select('player,score,created_at')
    .order('score', { ascending:false })
    .limit(n)
  if(error){ console.error(error); return [] }
  return data||[]
}
