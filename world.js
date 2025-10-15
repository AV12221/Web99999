import { MiniKit } from 'https://cdn.skypack.dev/@worldcoin/minikit-js'
const mk = new MiniKit()

const $ = (s)=>document.querySelector(s)
const btnLogin = ()=>$('#btnLogin')
const btnPay   = ()=>$('#btnPay')
const nameEl   = ()=>$('#playerName')
const balEl    = ()=>$('#balance')

function toast(msg){
  let box=$('#toast'); if(!box){ box=document.createElement('div'); box.id='toast'; document.body.appendChild(box) }
  box.textContent=msg; box.className='show'; setTimeout(()=>box.className='',1500)
}
function setLoading(el,on){ if(!el) return; el.disabled=on; on?el.setAttribute('data-loading',''):el.removeAttribute('data-loading') }

window.worldLogin = async () => {
  setLoading(btnLogin(), true)
  try {
    const { finalPayload } = await mk.commands.walletAuth()
    const addr = finalPayload?.address || 'user'
    if (nameEl()) nameEl().textContent = addr.slice(0,6)+'…'+addr.slice(-4)
    document.dispatchEvent(new CustomEvent('world:login',{detail:{address:addr}}))
    toast('登录成功')
  } catch(e){ console.error(e); toast('登录失败') }
  finally{ setLoading(btnLogin(), false) }
}

window.worldPay = async () => {
  setLoading(btnPay(), true)
  try {
    const res = await mk.commands.pay({ tokens:[{ symbol:'USDC', token_amount:'0.10' }] })
    const reward = 50
    document.dispatchEvent(new CustomEvent('world:paid',{detail:{reward,tx:res?.txHash}}))
    if (typeof window.addScore==='function') window.addScore(reward)
    toast('支付已发起')
  } catch(e){ console.error(e); toast('支付取消/失败') }
  finally{ setLoading(btnPay(), false) }
}
