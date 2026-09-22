import {createHash} from 'node:crypto';
export const correctionDigest = patch => createHash('sha256').update(JSON.stringify(patch)).digest('hex');
export function applyLegalCorrection(material, patch) {
 const digest=correctionDigest(patch);
 if(material.legalReview?.correctionDigest===digest)return null;
 if(material.id!==patch.materialId||material.revision!==patch.expectedRevision)throw Error('Изменена исходная версия: '+patch.materialId);
 const fields=structuredClone(patch.fields);
 if(fields.steps)fields.steps=fields.steps.map((s,i)=>{
  const step=typeof s==='string'?{text:s,attachments:[],branches:[]}:s;
  // Изменённый шаг не наследует отметку о выполнении прежней инструкции.
  const previous=material.steps?.find(p=>p.id===step.id);
  if(!previous||previous.text!==step.text)step.id='legal-'+digest.slice(0,12)+'-'+i;
  return step;
 });
 return {...material,...fields,revision:material.revision+1,legalStatus:'unverified',contentOrigin:'edited-source',
  externalLinks:[...new Map([...(material.externalLinks||[]),...patch.sources].map(s=>[s.url,s])).values()],
  legalReview:{date:'2026-09-22',status:'partial',issue:patch.issue,sources:patch.sources,correctionDigest:digest}};
}
