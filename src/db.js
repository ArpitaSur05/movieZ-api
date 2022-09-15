const { PrismaClient } = require("@prisma/client");

module.exports = new PrismaClient();

// makes connection to db and provides us methods of all the models i.e. movie here.
