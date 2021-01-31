const AWS = require("aws-sdk");

module.exports = {
  init: config => {
    const spaces = new AWS.S3({
      accessKeyId: config.key,
      secretAccessKey: config.secret,
      sslEnabled: true,
      endpoint: `${config.region}.digitaloceanspaces.com`,
      params: {
        Bucket: config.name
      }
    });

    return {
      upload: file => {
        return new Promise((resolve, reject) => {

          const cdn = config.cdn ? `${config.cdn}/` : `https://${config.region}.cdn.digitaloceanspaces.com/`;
          const directory = config.directory ? `${config.directory}/` : '';
          const path = file.path ? `${file.path}/` : '';
          const filename = `${file.hash}${file.ext}`;

          // Upload it.
          spaces.upload(
            {
              Key: `${directory}${path}${filename}`,
              Body: new Buffer(file.buffer, "binary"),
              ACL: "public-read",
              ContentType: file.mime
            },
            (error, data) => {
              if (error) return reject(error);
              file.url = `${cdn}${directory}${path}${filename}`;
              resolve();
            }
          );
        });
      },
      delete: file => {
        return new Promise((resolve, reject) => {

          const directory = config.directory ? `${config.directory}/` : '';
          const path = file.path ? `${file.path}/` : '';
          const filename = `${file.hash}${file.ext}`;

          // Delete it.
          spaces.deleteObject(
            {
              Key: `${directory}${path}${filename}`
            },
            (error, data) => {
              if (error) return reject(error);
              resolve();
            }
          );
        });
      }
    };
  }
};