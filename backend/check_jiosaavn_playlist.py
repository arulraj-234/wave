import requests
import json

try:
    url = "http://localhost:3001/api/search/playlists?query=Nikhil Paul George"
    resp = requests.get(url)
    data = resp.json()
    
    with open('playlist_debug.txt', 'w') as f:
        if data.get('success') and data.get('data'):
            results = data['data'].get('results', [])
            for p in results[:3]:
                title = p.get('title', '')
                image = p.get('image', [])
                f.write(f"Playlist: {title}\n")
                f.write(json.dumps(image, indent=2) + "\n")
                f.write("---\n")
except Exception as e:
    with open('playlist_debug.txt', 'w') as f:
        f.write(f"Error: {e}")
