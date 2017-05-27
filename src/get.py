import io
import csv
import json
import requests

url = 'https://docs.google.com/spreadsheets/d/1j_CpObaa3OxJvjfwVfJGfhbK07rmAq8063IMpVV9AFY/pub?output=csv'
response = requests.get(url)
response.encoding = 'utf-8'
reader = csv.DictReader(io.StringIO(response.text))
rows = list(reader)

dump = [row for row in rows]
with open('data.json', 'w+', encoding='utf-8') as f:
    json.dump(dump, f, indent=4, ensure_ascii=False)
