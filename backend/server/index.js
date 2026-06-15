const config    = require('./config');
const createApp = require('./app');

const app = createApp();

app.listen(config.PORT, () => console.log(`🚀  Server on http://localhost:${config.PORT}`));
