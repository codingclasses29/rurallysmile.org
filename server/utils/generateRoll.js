import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890", 5);

export const generateRoll = () => {
  return `RTN26${nanoid()}`;
};

export default generateRoll;
