window.$S={inGame:false,score:0,revive:0,reviveLimit:2,addr:null}
export const S=window.$S
export const addScore=n=>{ S.score+=+n||0; (window.renderScore||(()=>{}))(S.score) }
export const resetGame=()=>Object.assign(S,{inGame:true,score:0,revive:0})
export const gameOver=()=>{ S.inGame=false }
window.addScore=addScore
