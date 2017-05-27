import io
import csv
import json
import requests

import time

# prepare geocoder
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
geolocator = Nominatim()

url = 'https://docs.google.com/spreadsheets/d/1j_CpObaa3OxJvjfwVfJGfhbK07rmAq8063IMpVV9AFY/pub?output=csv'
response = requests.get(url)
response.encoding = 'utf-8'
reader = csv.DictReader(io.StringIO(response.text))
rows = list(reader)

# dump = [row for row in rows]
dump = []
for row in rows:
    address = row['media_hq_city'] + ',' + row['media_hq_country']
    try:
        loc = geolocator.geocode(address, timeout=10)
    except GeocoderTimedOut:
        print('timeout', address)
    if(loc != None):
        print('success', address, loc.latitude, loc.longitude)
        row['lat'] = loc.latitude
        row['lng'] = loc.longitude
        dump.append(row)
    time.sleep(1)

with open('data.json', 'w+', encoding='utf-8') as f:
    json.dump(dump, f, indent=4, ensure_ascii=False)
