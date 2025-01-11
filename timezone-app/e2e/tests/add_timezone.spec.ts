import { test, expect } from '@playwright/test';
import { TimezonePage } from '../pages/TimezonePage';

test('add timezone and verify row is added', async ({ page }) => {
  
  const timezonePage = new TimezonePage(page);

  await page.goto('/');

  const label = 'EST';
  const timezone = 'Eastern Standard Time';
  const tableTimezone = 'America/New_York';

  await timezonePage.clickAddTimezone();
  await timezonePage.fillTimezoneForm(label, timezone);
  await timezonePage.clickSave();

  await timezonePage.waitForTableToUpdate();

  const tableRows = await timezonePage.getTableRows();

  // Assert that the row with the correct label and timezone is added
  expect(tableRows.some(row => row.includes(label))).toBeTruthy();
  expect(tableRows.some(row => row.includes(tableTimezone))).toBeTruthy();
});
