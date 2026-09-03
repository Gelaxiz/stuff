import re

with open('/home/niilo/.gemini/antigravity/brain/1128c809-f9fa-474f-934f-0696f9eb2e75/.system_generated/logs/overview.txt') as f:
    logs = f.read()

for match in re.finditer(r'"CodeContent":"(.*?)"', logs):
    script = match.group(1).replace('\\n', '\n').replace('\\"', '"')
    match2 = re.search(r'papas_games = \[(.*?)\]', script, re.DOTALL)
    if match2:
        print("Found games:")
        print(match2.group(1))
