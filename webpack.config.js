module.exports = function (webpackEnv) {
  console.log(webpackEnv)
  return {
    resolve: {
      fallback: {
        // Here paste
        // "path": require.resolve("path-browserify"),
        // But in mi case I paste
        // "crypto": require.resolve("crypto-browserify"),
        util: false
      }
    }
  }
}