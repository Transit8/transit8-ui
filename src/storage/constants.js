export const CONSTANTS = {
  apiKey: process.env.TOK_BOX_API_KEY,
  environment: process.env.NODE_ENV,
  shapeShiftUrl: process.env.SHAPE_SHIFT_URL,
  ethGatewayUrl: process.env.ETH_GATEWAY_URL,
  searchUrl: process.env.SEARCH_INDEX_URL,
  debugMode: process.env.DEBUG_MODE,
  networkExpected: process.env.ETHEREUM_NETWORK,
  domain: location.origin,
  artworkRootFileName: 'records_v01.json',
  auctionsRootFileName: 'auctions_v01.json',
  gaiaArtworkFileName: 'record_',
}
