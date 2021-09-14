export type ENVIRONMENT = "PRODUCTION" | "STAGING" | "LOCAL";
export const S3_BUCKET_URL =
  "https://s3.us-east-2.amazonaws.com/assets.appsmith.com";
export const DOCS_BASE_URL = "https://docs.appsmith.com/";
export const TELEMETRY_URL = `${DOCS_BASE_URL}telemetry`;
export const ASSETS_CDN_URL = "https://assets.appsmith.com";
export const GITHUB_RELEASE_URL =
  "https://github.com/appsmithorg/appsmith/releases/tag";
export const GET_RELEASE_NOTES_URL = (tagName: string) =>
  `${GITHUB_RELEASE_URL}/${tagName}`;
export const GOOGLE_MAPS_SETUP_DOC =
  "https://docs.appsmith.com/setup/docker/google-maps";
export const GOOGLE_SIGNUP_SETUP_DOC =
  "https://docs.appsmith.com/setup/docker/google-login";
export const GITHUB_SIGNUP_SETUP_DOC =
  "https://docs.appsmith.com/setup/docker/github-login";
