const { createHmac } = require('node:crypto');

function get_hash(string: String, hashcode: String): String {
    const hash = createHmac(hashcode, string)
                    .digest('hex');
    return hash;
}

const secret = 'abcdefg';
const hash = get_hash(secret, 'sha256');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e

