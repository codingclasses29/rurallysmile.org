import QRCode from "qrcode";

export const generateQR = async (text) => {
  return QRCode.toDataURL(String(text), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 200,
  });
};

export const generateQRBuffer = async (text) => {
  return QRCode.toBuffer(String(text), {
    errorCorrectionLevel: "M",
    type: "png",
    width: 200,
  });
};

export default { generateQR, generateQRBuffer };
