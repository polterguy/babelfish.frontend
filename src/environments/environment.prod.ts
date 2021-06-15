/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

// This little trick makes pipeline transformations slightly simpler in Azure at least.
import prod_url from "./environment.prod.json";

export const environment = {
  production: true,

  // The URL to your backend API.
  apiUrl: prod_url.url,

  // The domain for your backend API. Needed for "oauth0".
  apiDomain: prod_url.api_domain,
};
