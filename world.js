import { MiniKit } from 'https://cdn.skypack.dev/@worldcoin/minikit-js'
import { S, addScore } from './state.js'
const mk = new MiniKit()

const $ = s=>document.querySelector(s)
const setPayEnabled = v => { const b=$('#btnPay'); if(b) b.disabled=!v }
const setLoginDone  = ()=>{ const b=$('#btnLogin'); if(b){ b.textContent='已登录'; b.disabled=true; b.classList.remove('ghost') } }

window.worldLogin = async () => {
  try{
    const { finalPayload } = await mk.commands.walletAuth()
    S.addr = finalPayload?.address || 'guest'
    document.dispatchEvent(new CustomEvent('world:login',{detail:{address:S.addr}}))
    setLoginDone(); setPayEnabled(true)
  }catch(e){ console.error(e); alert('登录失败') }
}

let paying=false
window.worldPay = async () => {
  if(paying) return; paying=true; setPayEnabled(false)
  try{
    await mk.commands.pay({ tokens:[{ symbol:'USDC', token_amount:'0.10' }] })
    document.dispatchEvent(new CustomEvent('world:paid',{detail:{reward:50}}))
    if(!S.inGame){                           // 复活路径
      if(S.revive < S.reviveLimit){
        S.revive++; S.inGame=true; addScore(30)
        if(typeof window.resumeGame==='function') window.resumeGame()
      }
    }else{                                   // 局中奖励
      addScore(50)
    }
  }catch(e){ console.error(e); alert('支付取消/失败') }
  finally{ paying=false; setPayEnabled(true) }
}
