const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/trigger-login', async (req, res) => {
  const { email } = req.body;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://www.trustpilot.com/users/login', { waitUntil: 'domcontentloaded' });

    // Wait for iframe to load
    const frame = await page.frame(({ url }) => url.includes('authentication.trustpilot.com'));
    if (!frame) throw new Error('Login iframe not found');

    // Interact inside the iframe
    await frame.fill('input[name="email"]', email);
    await frame.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    await browser.close();
    res.json({ status: 'OTP sent to email' });

  } catch (err) {
    await browser.close();
    res.status(500).json({ error: err.message });
  }
});

app.post('/submit-otp', async (req, res) => {
  const { email, otp } = req.body;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://www.trustpilot.com/users/login', { waitUntil: 'domcontentloaded' });

    const frame = await page.frame(({ url }) => url.includes('authentication.trustpilot.com'));
    if (!frame) throw new Error('Login iframe not found');

    await frame.fill('input[name="email"]', email);
    await frame.click('button[type="submit"]');

    await frame.waitForSelector('input[name="code"]', { timeout: 10000 });
    await frame.fill('input[name="code"]', otp);
    await frame.click('button[type="submit"]');

    await page.waitForTimeout(3000);
    await browser.close();
    res.json({ status: 'Logged in successfully' });

  } catch (err) {
    await browser.close();
    res.status(500).json({ error: err.message });
  }
});

app.post('/post-review', async (req, res) => {
  const { businessURL, review } = req.body;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(businessURL);
    await page.click('a[href*="write-review"]');
    await page.waitForSelector('textarea');
    await page.fill('textarea', review);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await browser.close();
    res.json({ status: 'Review posted' });

  } catch (err) {
    await browser.close();
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Trustpilot Playwright Automation API is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
