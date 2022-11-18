import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "ddrfwpd5r",
  api_key: "276654363992187",
  api_secret: "twvRy3syLOC_VIU2-NA9ffg-pUk",
});

module.exports = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file);
    return res.secure_url;
  } catch (error) {
    return error;
  }
};