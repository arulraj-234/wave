import requests

url_500 = "https://c.saavncdn.com/editorial/logo/artist_hits-931810639_20220311150517_500x500.jpg"
url_150 = "https://c.saavncdn.com/editorial/logo/artist_hits-931810639_20220311150517_150x150.jpg"
url_300 = "https://c.saavncdn.com/editorial/logo/artist_hits-931810639_20220311150517_300x300.jpg"
url_1000 = "https://c.saavncdn.com/editorial/logo/artist_hits-931810639_20220311150517_1000x1000.jpg"

for url in [url_500, url_1000, url_300, url_150]:
    r = requests.head(url)
    print(f"{url.split('_')[-1]}: {r.status_code}")
