const app = require('./api/index');

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Base: http://localhost:${PORT}/api`);
  });
}

module.exports = app;
