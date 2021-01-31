module.exports = ({ env }) => ({
  upload: {
    provider: "spaces",
    providerOptions: {
      key: env('SPACES_ACCESS_KEY'),
      secret: env('SPACES_SECRET_KEY'),
      region: env('SPACES_REGION'),
      name: env('SPACES_NAME'),
      cdn: env('SPACES_CDN'),
      directory: env('SPACES_DIRECTORY')
    }
  }
});