import { Thumbor } from "thumbor-ts";
import { fixed, fluid } from ".";

describe("thumbor gatsby image", () => {
  const serverUrl = "http://localhost:8000";
  const imagePath = "i.ytimg.com/vi/MPV2METPeJU/maxresdefault.jpg";
  const thumbor = new Thumbor({ serverUrl });
  const image = thumbor.setPath(imagePath);

  test("Fixed", async () => {
    expect(await fixed(image, { height: 20, width: 30 })).toBeTruthy();
  });
  test("Fluid", async () => {
    expect(await fluid(image, { maxWidth: 400 })).toBeTruthy();
  });
});
