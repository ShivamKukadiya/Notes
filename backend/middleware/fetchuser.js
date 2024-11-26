var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Thisisimportantandweneedtosecureit'; //save this and other codes like this in .env.local file

const fetchuser = (req, res, next) => {
    // Get the user from user jwt and id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}

module.exports = fetchuser;