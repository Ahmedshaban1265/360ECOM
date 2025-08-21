import puppeteer from 'puppeteer';

const DEV_URL = process.env.DEV_URL || 'http://localhost:5173';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error') {
      errors.push(msg.text());
    }
  });

  // Prime auth in localStorage
  await page.goto(`${DEV_URL}/`);
  await page.evaluate(() => {
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('adminLoginTime', Date.now().toString());
  });

  // Navigate to editor
  await page.goto(`${DEV_URL}/admin/editor`);
  await page.waitForSelector('div.border-b');

  // Wait for PreviewCanvas toolbar with device buttons
  await page.waitForSelector('button[title^="Reset Zoom"]');

  // Open Responsive Testing Panel
  const testBtn = await page.$x("//button[contains(., 'Test')]");
  if (testBtn[0]) {
    await testBtn[0].click();
    await page.waitForSelector('.fixed.inset-0');
    // Close panel
    const closeBtn = await page.$x("//button[.='✕']");
    if (closeBtn[0]) await closeBtn[0].click();
  }

  // Toggle to mobile device in PreviewCanvas
  const deviceButtons = await page.$$('[title*="sm:"]');
  if (deviceButtons[0]) {
    await deviceButtons[0].click();
  }

  // Check that live website rendered
  await page.waitForSelector('.live-website-renderer');

  // Ensure no hard console errors
  if (errors.length) {
    throw new Error('Console errors detected:\n' + errors.join('\n'));
  }

  await browser.close();
  console.log('Editor smoke test passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

