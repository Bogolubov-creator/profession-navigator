// При перестановке шагов развилка продолжает вести на тот же шаг по его ID.
export function remapSteps(previous,next){return next.map(step=>({...step,branches:(step.branches||[]).flatMap(branch=>{const target=previous[branch.index]?.id,index=next.findIndex(s=>s.id===target);return index<0?[]:[{...branch,index}];})}));}
