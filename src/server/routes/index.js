const { exec } = require("child_process");
const { version } = require("../../../package.json");

let commit;

_gitCommitHash().then(c => commit = c);

module.exports = {
    "GET /version": async (_, res) => res.send({ version, commit })
};

function _gitCommitHash() {
    return new Promise((resolve, reject) => {
        exec("git rev-parse --short HEAD", (error, stdout, stderr) => {
            if (error) return reject(error);
            if (stderr) return reject(stderr);
            resolve(stdout.slice(0, -1));
        });
    });
}