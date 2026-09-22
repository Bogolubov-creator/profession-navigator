import {test} from 'node:test';import assert from 'node:assert/strict';
import {applyLegalCorrection} from '../shared/legal-corrections.js';
const m={id:'m',revision:2,steps:[{id:'old',text:'old',attachments:[],branches:[]}],blocks:[{text:'original'}],sourceSha:'original-hash',legalStatus:'verified'};
const p={materialId:'m',expectedRevision:2,issue:'Исправление',sources:[{label:'Закон',url:'https://example.com'}],fields:{steps:[{...m.steps[0],text:'new'}]}};
test('Исправление сохраняет источник и создаёт новую версию шага без ложной полной верификации',()=>{const n=applyLegalCorrection(m,p);assert.notEqual(n.steps[0].id,'old');assert.deepEqual(n.blocks,m.blocks);assert.equal(n.sourceSha,m.sourceSha);assert.equal(n.legalStatus,'unverified');assert.equal(n.revision,3);assert.equal(m.steps[0].text,'old');assert.equal(applyLegalCorrection(n,p),null)});
test('Исправление не перезаписывает последующую редактуру',()=>assert.throws(()=>applyLegalCorrection({...m,revision:3},p),/Изменена исходная версия/));
