export default async function run(page, ui) {
  // Let the hero intro finish so the layout is stable.
  await page.waitForTimeout(7000);
  await page.screenshot({ path: "/tmp/nika-hero.png" });
  await page.evaluate(() => {
    const el = document.getElementById("furniture");
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/nika-signature-mid.png" });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: "/tmp/nika-signature-settled.png" });
  return await page.evaluate(() => {
    const canvas = document.querySelector("#furniture canvas");
    let inkPixels = 0;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 20) inkPixels += 1;
    }
    const sec = document.getElementById("furniture");
    return {
      canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
      cssCanvas: canvas ? `${canvas.clientWidth}x${canvas.clientHeight}` : null,
      drawnPixels: inkPixels,
      removedCopyStillPresent: document.body.innerText.includes(
        "Furniture shaped by natural materials",
      ),
      sectionBg: sec ? getComputedStyle(sec).backgroundColor : null,
    };
  });
}
