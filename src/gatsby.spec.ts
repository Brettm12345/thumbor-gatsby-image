import { Thumbor } from "thumbor-ts";

import { fluid, fixed } from "./gatsby";

jest.mock("./remote");

describe("thumbor gatsby image", () => {
  const serverUrl = "http://localhost";
  const imagePath = "/react-day-picker.png";
  const thumbor = new Thumbor({ serverUrl });
  const image = thumbor.setPath(imagePath);
  test("Fluid", async () => {
    expect(await fluid(image, { maxWidth: 300 })).toMatchSnapshot();
  });
  test("Fixed", async () => {
    expect(await fixed(image, { width: 400, height: 400 })).toMatchSnapshot();
  });
});
