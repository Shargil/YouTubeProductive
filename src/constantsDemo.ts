// TODO: Need to combine constants.js and constantsDemo.ts, right now constantsDemo.ts
// is being used successfully in tsx code, and constants.js in js code like background.js
// Can I convert constant.js to TS and still use it in the other js files,
// or I have to make them TS as well? If I make every thing together will webpack combine background.js to bundled options.js, will it cause problem? 
export const LIST_TYPE = {
    WHITE_LIST: "white_list",
    BLACK_LIST: "black_list",
  }