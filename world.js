import { MiniKit } from 'https://cdn.skypack.dev/@worldcoin/minikit-js'
const mk = new MiniKit()
let playerAddr = null

async function worldLogin() {
  try {
    const { finalPayload } = await mk.commands.walletAuth()
    playerAddr = finalPayload?.address || 'guest'
    window.playerAddr = playerAddr
    document.getElementById('btnLogin').textContent = '已登录'
    document.getElementById('btnPay').disabled = false
  } catch (e) { console.error(e); alert('登录失败') }
}

async function worldPay() {
  try {
    await mk.commands.pay({ tokens: [{ symbol: 'USDC', token_amount: '0.10' }] })
    // 支付成功给奖励分数
    const add = 50
    if (typeof window.addScore === 'function') { window.addScore(add) }
    else if (typeof window.updateScore === 'function') { window.updateScore((window.score||0)+add) }
    else {
      const el = document.querySelector('#score,.score,.current-score')
      if (el) el.textContent = String((parseInt(el.textContent||'0',10)||0)+add)
    }
    // 将奖励分也写入 Supabase（若有当前分）
    if (window.saveScore) {
      const s = (window.score||0)
      try { await window.saveScore(playerAddr||'guest', s) } catch(e){ console.error(e) }
    }
    alert('支付成功，已加分 +50')
  } catch (e) { console.error(e); alert('支付取消/失败') }
}
window.worldLogin = worldLogin
window.worldPay = worldPay
