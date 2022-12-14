const passport = require("passport");
const jwt = require('jsonwebtoken');



exports.isAuthenticate = (req, res, next) => {
    passport.authenticate('jwt', function(err, user, info) {
        if (err) return next(err);

        if (!user) return res.status(401).json({message: "Unauthorized Access - No Token Provided!"});

        req.user = user;

        next();

    })(req, res, next);
};



exports.isAuth = async (req, res, next) => {
  try {
    // 0      1
    // Bearer token
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token Is missing' });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY); 
    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Token expired', error: error.message });
  }
};
