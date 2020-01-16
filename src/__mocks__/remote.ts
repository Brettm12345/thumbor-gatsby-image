import { Dimensions } from "../remote";

export const getDimensions = async (): Promise<Dimensions> =>
  Promise.resolve({
    width: 2000,
    height: 3000
  });

export const getBase64 = (): Promise<string> => Promise.resolve("");
