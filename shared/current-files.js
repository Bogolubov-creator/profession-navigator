export function currentFileNames(material){
 return [material.formReview?.currentFile,...(material.supportingTemplates||[]).map(f=>f.currentFile)].filter(name=>typeof name==='string'&&/^[a-zA-Z0-9-]+\.(pdf|docx)$/.test(name));
}
export function publishedCurrentFiles(materials){return new Set(materials.filter(m=>m.status==='published'&&!m.locked).flatMap(currentFileNames))}
