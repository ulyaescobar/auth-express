function validateLoginInput(req, res, next) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ status: 400, message: 'Email and password are required' });
  }
  
  next();
}

module.exports = validateLoginInput