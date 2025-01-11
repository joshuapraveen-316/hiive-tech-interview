import { Page } from '@playwright/test';

export class TimezonePage {
  constructor(private page: Page) {}

  // Page Objects
  private addTimezoneButton = 'button:has-text("Add timezone")';
  private labelInput = 'input[name="label"]';
  private timezoneSelect = 'select[name="timezone"]';
  private saveButton = 'button:has-text("Save")';
  private tableRows = 'table tbody tr';
  private deleteButton = 'button:has-text("Delete")'; 

  async clickAddTimezone() {
    await this.page.click(this.addTimezoneButton);
  }

  async fillTimezoneForm(label: string, timezone: string) {
    await this.page.fill(this.labelInput, label);
    await this.page.selectOption(this.timezoneSelect, timezone);
  }

  async clickSave() {
    await this.page.click(this.saveButton);
  }

  async waitForTableToUpdate() {
    await this.page.waitForSelector(this.tableRows);
  }

  async getTableLabels(): Promise<string[]> {
    const tableRows = await this.page.$$eval(this.tableRows, (rows) =>
      rows
        .filter((row) => row instanceof HTMLElement)
        .map((row: HTMLElement) => row.innerText.split('\n')[0].trim()) 
    );
    return tableRows;
  }

  async getTableRows(): Promise<string[]> {
    const rows = await this.page.$$eval(this.tableRows, (rows) =>
      rows
        .filter((row) => row instanceof HTMLElement)
        .map((row: HTMLElement) => row.innerText.trim())
    );
    return rows;
  }

  async getTableLocalTimes(): Promise<string[]> {
    return this.page.$$eval('table tbody tr', (rows) => 
      rows
        .filter((row) => row instanceof HTMLElement)
        .map((row) => {
          const timeCell = row.querySelector('td:nth-child(3)');
          return timeCell ? (timeCell as HTMLElement).innerText.trim() : ''; 
        })
    );
  }
  
  async deleteTimezoneByLabel(label: string) {
    const rows = await this.page.$$(this.tableRows);
    for (const row of rows) {
      const rowText = await row.innerText();
      if (rowText.includes(label) && !rowText.includes("Local(You)")) {
        const deleteButton = await row.$(this.deleteButton);
        if (deleteButton) {
          await deleteButton.click();
          await this.page.waitForTimeout(500);  
          break;
        }
      }
    }
  }

  async isLocalYouPresent() {
    const rows = await this.page.$$eval(this.tableRows, (rows) =>
      rows.some((row) => {
        if (row instanceof HTMLElement) {
          return row.innerText.includes('Local(You)');
        }
        return false;
      })
    );
    return rows;
  }
  
}
