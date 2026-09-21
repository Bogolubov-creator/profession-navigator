"""Сохраняет нумерацию шагов DOCX и присоединяет ненумерованные пояснения."""
import json, sys, zipfile, re
import xml.etree.ElementTree as ET
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
root=ET.fromstring(zipfile.ZipFile(sys.argv[1]).read('word/document.xml'))
result={}; code=None; active=False
for p in root.find('w:body',ns):
    text=''.join(t.text or '' for t in p.findall('.//w:t',ns)).strip()
    match=re.match(r'ID карточки:\s*(PED-A-\d{2})',text)
    if match: code=match[1];result[code]=[];active=False
    if not code: continue
    if text.startswith('Шаги:'):active=True;continue
    if text.startswith('Что подготовить:'):active=False
    if not active or not text:continue
    numbered=p.find('w:pPr/w:numPr',ns) is not None
    if numbered or not result[code]:result[code].append(text)
    else:result[code][-1]+='\n'+text
print(json.dumps(result,ensure_ascii=False))
