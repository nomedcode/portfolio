import { expect, test } from "@playwright/test";

test("hero role is visible again after reduced motion is toggled off mid-exit", async ({ page }) => {
  await page.goto("/");

  const role = page.locator("[data-hero-role-text]");

  const firstRole = await role.textContent();

  await page.waitForFunction(
    (firstRole) => {
      const el = document.querySelector<HTMLElement>("[data-hero-role-text]");
      return !!el && el.textContent !== firstRole && Number(getComputedStyle(el).opacity) < 1;
    },
    firstRole,
    { polling: 10, timeout: 10_000 },
  );

  expect(await role.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(100);
  expect(await role.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(1_000);

  await expect(role).toHaveCSS("opacity", "1", { timeout: 500 });
});
