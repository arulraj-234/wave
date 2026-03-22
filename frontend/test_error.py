from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument('--headless')
options.add_argument('--log-level=3')
driver = webdriver.Chrome(options=options)

try:
    print('Loading page...')
    driver.get('http://localhost:5173/dashboard')
    time.sleep(3)
    logs = driver.get_log('browser')
    for log in logs:
        if log['level'] == 'SEVERE':
            print(log['message'])
except Exception as e:
    print('Error:', e)
finally:
    driver.quit()
