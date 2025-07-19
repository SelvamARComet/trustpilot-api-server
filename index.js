const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Trigger OTP to email
app.post('/trigger-login', async (req, res) => {
  const { email } = req.body;
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://www.trustpilot.com/users/login');
    await page.type('input[name="email"]', email);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    res.json({ status: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

// Verify OTP (email + OTP form)
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://www.trustpilot.com/users/verify');
    await page.type('input[name="email"]', email);
    await page.type('input[name="otp"]', otp);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    res.json({ status: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

// Submit OTP (input on same login page)
app.post('/submit-otp', async (req, res) => {
  const { email, otp } = req.body;
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://www.trustpilot.com/users/login');
    await page.type('input[name="email"]', email);
    await page.click('button[type="submit"]');
    await page.waitForSelector('input[name="code"]', { timeout: 10000 });
    await page.type('input[name="code"]', otp);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    res.json({ status: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

// Post a review
app.post('/post-review', async (req, res) => {
  const { email, businessURL, review } = req.body;
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto(businessURL);
    await page.waitForSelector('a[href*="write-review"]');
    await page.click('a[href*="write-review"]');
    await page.waitForSelector('textarea');
    await page.type('textarea', review);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    res.json({ status: 'Review posted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

// Home endpoint
app.get('/', (req, res) => {
  res.send('Trustpilot Puppeteer API is running.');
});

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
