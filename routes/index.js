const { UserRoutes } = require('./user.routes');
const { googleAuth } = require('./Social.auth.routes');
const { GenerateNfts } = require('./generate-nft.routes');

module.exports = [UserRoutes, googleAuth, GenerateNfts];