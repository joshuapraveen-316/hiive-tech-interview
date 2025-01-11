import { test, expect } from '@playwright/test';
import { TimezonePage } from '../pages/TimezonePage';

test('add and delete one timezone', async ({ page }) => {
  const timezonePage = new TimezonePage(page);

  await page.goto('/');

  const label = 'PST';
  const timezone = 'Pacific Standard Time';

  await timezonePage.clickAddTimezone();
  await timezonePage.fillTimezoneForm(label, timezone);
  await timezonePage.clickSave();
  await timezonePage.waitForTableToUpdate();

  const tableRows = await timezonePage.getTableLabels();
  expect(tableRows).toContain(label);

  await timezonePage.deleteTimezoneByLabel(label);

  await page.waitForTimeout(2000);

  // Assert that the timezone is deleted and "Local(You)" still exists
  const updatedTableRows = await timezonePage.getTableRows();
  expect(updatedTableRows).not.toContain(label);

  await page.waitForTimeout(2000);

  // Assert that Local(You) is not deleted
  const isLocalYouPresent = await timezonePage.isLocalYouPresent();
  expect(isLocalYouPresent).toBeTruthy();
});

test('delete button for Local(You) timezone should not be enabled', async ({ page }) => {
  const timezonePage = new TimezonePage(page);

  await page.goto('/');

  const row = await page.locator('text=Local(You)');
  await row.waitFor();

  const deleteButton = row.locator('button:has-text("Delete")');
  
  // Assert that delete button for "Local(You)" should not be enabled
  const isDeleteButtonEnabled = await deleteButton.isEnabled();
  expect(isDeleteButtonEnabled).toBe(false);
});
