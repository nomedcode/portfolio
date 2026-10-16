import { expect, test } from "@playwright/test";

test("skills dialog: page inert, scroll locked, Escape restores", async ({ page }) => {
  await page.goto("/");

  const opener = page.getByRole("button", { name: "View all skills" });
  await opener.scrollIntoViewIfNeeded();
  await opener.click();

  const dialog = page.getByRole("dialog", { name: "Skills" });
  await expect(dialog).toBeVisible();

  // Inert lands on the dialog's ancestors' siblings, so assert subtree membership, not attribute ownership.
  expect(await opener.evaluate((el) => el.closest("[inert]") !== null)).toBe(true);
  expect(await dialog.evaluate((el) => el.closest("[inert]"))).toBeNull();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  // Tab stays inside the dialog.
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement?.closest("[role='dialog']") !== null)).toBe(true);

  // Escape closes, restores the page, and returns focus to the opener.
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  expect(await opener.evaluate((el) => el.closest("[inert]"))).toBeNull();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await expect(opener).toBeFocused();
});
