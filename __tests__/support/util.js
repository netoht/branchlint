import path from 'path';
import fs from 'fs-extra';
import { appDir } from '../../src/util.js';

function populateFixtures(targetDir) {
  fs.copySync(path.resolve(appDir(), '__tests__', 'fixtures'), targetDir);
}

module.exports = { populateFixtures };
