import urllib.request
import urllib.parse
import json
import ssl
import sys
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def search_and_download(term, savename):
    # macosicons uses an Algolia index or similar, but let's try a simple back4app api or similar public endpoint if we can
    # Wait, macosicons.com doesn't have a simple public REST API without keys. 
    # Let me use another search API that works, or just write a generic web image scraper if needed.
    pass

apps = {
    'weather': 'weather', 'clock': 'clock', 'camera': 'camera', 
    'activity monitor': 'activity', 'screen recorder': 'recorder', 
    'projects folder': 'projects', 'games': 'games', 
    'chatgpt': 'chat', 'folder': 'downloads', 'trash': 'trash'
}
