import axios from "axios";

export const handleFileToIpfs = async (file, postID) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "pinataMetadata",
    JSON.stringify({
      name: postID,
    })
  );
  formData.append(
    "pinataOptions",
    JSON.stringify({
      cidVersion: 0,
    })
  );

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
      },
    });
    return res.data.IpfsHash;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const handleJsonToIpfs = async (content, postId) => {
  var data = JSON.stringify({
    "pinataOptions": {
      "cidVersion": 1
    },
    "pinataMetadata": {
      "name": postId,
    },
    "pinataContent": {
      "content": content
    }
  });

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
      },
    });
    return res.data.IpfsHash;
  } catch (err) {
    console.error(err);
  }
};
