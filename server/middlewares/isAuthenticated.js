import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource'
      })
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if(!decode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'failed to authenticate'
    })
  }
}

export default isAuthenticated;
