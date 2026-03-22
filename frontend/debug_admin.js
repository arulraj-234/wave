import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.toString()));

  console.log("Navigating to login...");
  await page.goto('http://127.0.0.1:5175/login');
  
  // Login
  await page.type('input[placeholder="you@example.com"]', 'admin@wave.com');
  await page.type('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForNavigation();
  console.log("Navigated to:", page.url());

  // Go to Admin
  await page.goto('http://127.0.0.1:5175/admin');
  await page.waitForSelector('text/System Overview');
  
  console.log("On Admin page. Clicking Manage Songs tab...");
  
  // Click Manage Songs
  const tabs = await page.$$('button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text.includes('Manage Songs')) {
      await tab.click();
      console.log("Clicked Manage Songs tab.");
      break;
    }
  }

  // Wait to see if error happens
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const errorText = await page.evaluate(() => {
    const err = document.querySelector('h1.text-rose-500');
    if (err) return err.parentElement.innerText;
    return "No Error Boundary visible.";
  });
  console.log("ErrorBoundary status:", errorText);

  console.log("Done.");
  await browser.close();
})();
