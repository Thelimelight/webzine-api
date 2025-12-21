const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET

const generateToken = (id) => {
    return jwt.sign({ id }, jwtsecret, {
        expiresIn: '1d',
    })
};

module.exports = generateToken;