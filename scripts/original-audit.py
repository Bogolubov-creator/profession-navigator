import json,zipfile,pathlib,xml.etree.ElementTree as ET
root=pathlib.Path(__file__).resolve().parents[1]; bundle=root/'private/handoff'; result=[]
for s in json.loads((bundle/'inventory/manifest.json').read_text()):
 if not s['path'].endswith('.docx'):continue
 with zipfile.ZipFile(bundle/s['path']) as z:
  names=z.namelist(); links=[]
  for n in names:
   if n.endswith('.rels'):
    for e in ET.fromstring(z.read(n)):
     if e.attrib.get('TargetMode')=='External':links.append({'part':n,'target':e.attrib.get('Target')})
  media=[n for n in names if n.startswith('word/media/')]
  comments=[n for n in names if 'comments' in n]
  result.append({'source':s['id'],'links':links,'media':media,'comments':comments,'status':'original_preserved; relationships inspected'})
(root/'private/original-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({'docx':len(result),'external_links':sum(len(x['links']) for x in result),'media':sum(len(x['media']) for x in result),'comments':sum(len(x['comments']) for x in result)}))
