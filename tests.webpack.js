// require.context(directory, useSubdirectories = false, regExp = /^\.\//)
var context = require.context('./test', true, /-test.js$/);
context.keys().forEach(context);
