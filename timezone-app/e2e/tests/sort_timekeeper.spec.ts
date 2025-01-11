import { test, expect } from '@playwright/test';
import { TimezonePage } from '../pages/TimezonePage';

test('add timezones with labels and validate sorting', async ({ page }) => {
  const timezonePage = new TimezonePage(page);

  await page.goto('/');  


  const timezones = [
    { label: 'HAST', timezone: 'Pacific/Honolulu' },  
    { label: 'PST', timezone: 'America/Los_Angeles' },  
    { label: 'EST', timezone: 'America/New_York' }
  ];

  for (const { label, timezone } of timezones) {
    await timezonePage.clickAddTimezone();  
    await timezonePage.fillTimezoneForm(label, timezone); 
    await timezonePage.clickSave();
    await timezonePage.waitForTableToUpdate();
  }

  const actualLocalTimes = await timezonePage.getTableLocalTimes();  
  
  const expectedTimes = [...actualLocalTimes].sort((a, b) => {
    const parseTime = (time: string) => {
      const [hourMinute, meridiem] = time.split(' ');
      let [hour, minute] = hourMinute.split(':').map(Number);
      if (meridiem === 'PM' && hour !== 12) hour += 12;
      if (meridiem === 'AM' && hour === 12) hour = 0; 
      return hour * 60 + minute; 
    };
    return parseTime(a) - parseTime(b);
  });

  // Assert that the actual local times are sorted
  expect(actualLocalTimes).toEqual(expectedTimes);
});
