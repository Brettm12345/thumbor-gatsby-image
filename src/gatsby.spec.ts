import thumbor from "thumbor-ts";

import { fluid, fixed } from "./gatsby";

jest.mock("./remote");

describe("thumbor gatsby image", () => {
  const image = thumbor({
    serverUrl: "http://thumbor",
    imagePath: "example.png",
  });
  test("Fluid", async () => {
    expect(await fluid(image, { maxWidth: 300 })).toMatchSnapshot();
  });
  test("Fixed", async () => {
    expect(await fixed(image, { width: 400, height: 400 })).toMatchSnapshot();
  });
});
