import { useEffect, useState } from "react";
import { fixed as getFixed, fluid as getFluid } from "./gatsby";
import { FixedObject, FluidObject } from "gatsby-image";

export { getFixed, getFluid };

export const useFixed = (...args: Parameters<typeof getFixed>) => {
  const [fixed, setFixed] = useState<FixedObject>();
  useEffect(() => {
    getFixed(...args).then(setFixed);
  }, []);
  return fixed;
};

export const useFluid = (...args: Parameters<typeof getFluid>) => {
  const [fluid, setFluid] = useState<FluidObject>();
  useEffect(() => {
    getFluid(...args).then(setFluid);
  }, []);
  return fluid;
};
