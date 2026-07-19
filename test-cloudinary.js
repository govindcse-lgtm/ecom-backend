require("dotenv").config();
const { cloudinary } = require("./config/cloudinary");

// A universal 1x1 pixel transparent dummy image string
const base64DummyImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

async function verifyCloudinaryConnection() {
  console.log(
    "🔄 Re-initializing connection check with a local memory asset...",
  );
  console.log(`Cloud Name Target: ${process.env.CLOUDINARY_NAME}`);

  try {
    // Sending raw pixel memory bypasses external URL domain scrapers completely
    const uploadResult = await cloudinary.uploader.upload(base64DummyImage, {
      folder: "ecom_test_connection",
      public_id: `b64_test_${Date.now()}`,
    });

    console.log("\n=======================================================");
    console.log("🎉 SUCCESS! Cloudinary connection is fully operational.");
    console.log("=======================================================");
    console.log(`🖼️ Secure Image Asset URL: ${uploadResult.secure_url}`);
    console.log(`📦 Storage Public ID:      ${uploadResult.public_id}`);
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n=======================================================");
    console.error("🚨 CLOUDINARY CREDENTIAL FAIL!");
    console.error("=======================================================");
    console.error(`Reason/Error Message: ${error.message}`);
    console.error("=======================================================\n");
    process.exit(1);
  }
}

verifyCloudinaryConnection();
