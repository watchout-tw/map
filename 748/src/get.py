import io
import csv
import json
import requests

# prepare google maps
import config
import googlemaps
gmaps = googlemaps.Client(key=config.key)

url = 'https://docs.google.com/spreadsheets/d/1j_CpObaa3OxJvjfwVfJGfhbK07rmAq8063IMpVV9AFY/pub?output=csv'
response = requests.get(url)
response.encoding = 'utf-8'
reader = csv.DictReader(io.StringIO(response.text))
rows = list(reader)

# dump = [row for row in rows]
dump = []
for row in rows:
    gmaps_results = gmaps.geocode(row['media_hq_city'] + ' ' + row['media_hq_country'])
    if(len(gmaps_results) > 0):
        latlng = gmaps_results.pop(0)['geometry']['location']
        row['lat'] = latlng['lat']
        row['lng'] = latlng['lng']
        dump.append(row)

with open('data.json', 'w+', encoding='utf-8') as f:
    json.dump(dump, f, indent=4, ensure_ascii=False)
