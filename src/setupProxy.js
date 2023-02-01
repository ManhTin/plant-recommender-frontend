const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://plants.kempen.xyz/api',
      changeOrigin: true,
    })
  );
};
