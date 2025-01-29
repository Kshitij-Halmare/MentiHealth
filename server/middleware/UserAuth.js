import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Log incoming cookies and headers for debugging
    console.log("Cookies:", req.cookies);
    console.log("Authorization Header:", req.headers.authorization);

    // Get the token from cookies or authorization header
    const token = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

    // If no token is found, return unauthorized error
    if (!token) {
      return res.status(401).json({
        message: "Token is missing or invalid.",
        success: false,
        error: true,
      });
    }

    // Decode the token
    const decodedToken = jwt.decode(token);
    console.log("Decoded Token:", decodedToken);

    // Extract the user ID from the decoded token
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({
        message: "Invalid token payload.",
        success: false,
        error: true,
      });
    }

    req.userId = decodedToken.id; // Attach userId to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error occurred:", err); // Logs the full stack trace
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

export default auth;
