import config
import googlemaps
gmaps = googlemaps.Client(key=config.key)

address = 'New York City, NY, US'
loc = gmaps.geocode(address)
if(loc != None):
    latlng = loc.pop(0)['geometry']['location']
    lat = latlng['lat']
    lng = latlng['lng']
