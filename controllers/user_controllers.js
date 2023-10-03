const { User, Sequelize } = require("../models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// token akses
function generateAccessToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '20s' }); 
}

// refresh token
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET); 
}

const validRefreshTokens = [];

let self = {}

self.get = async (req, res) => {
  const userId = req.params.id
  let user = await User.findByPk(userId)
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: `user with id ${userId} not found`
    })
  } else {
    return res.status(200).json({
      status: 200,
      message: 'ok',
      data: user
    })
  }
}

self.getAll = async (req, res) => {
  try {
    let data = await User.findAll();
    return res.status(200).json({
      status: 200,
      message: "ok",
      data: data
    })
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: "bad request"
    })
  }
}

self.update = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  const { firstName, lastName, email, password } = req.body;
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: `User with id ${userId} not found`
    });
  } else {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await user.update({ firstName, lastName, email, password: hashedPassword });
    } else {
      await user.update({ firstName, lastName, email });
    }

    return res.status(200).json({
      status: 200,
      message: `User with id ${userId} has been updated`,
      data: user
    });
  }
};

self.destroy = async (req, res) => {
  const userId = req.params.id
  const user = await User.findByPk(userId)
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: `user with id ${userId} not found`
    })
  } else {
    await user.destroy()
    return res.status(200).json({
      status: 200,
      message: `user with id ${userId} was deleted`,
      data: []
    })
  }

}

self.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ status: 401, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ status: 401, message: 'Invalid password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      status: 200,
      message: 'Login successful',
      data: [
        {accessToken: accessToken},
        {refreshToken: refreshToken}
      ]
    });

  } catch (error) {
    console.error(error);
  }
};

self.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    // Periksa apakah refreshToken ada dalam daftar valid
    if (!validRefreshTokens.includes(refreshToken)) {
      return res.status(403).json({ status: 403, message: 'Invalid refreshToken' });
    }

    // Verifikasi refreshToken yang diterima
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ status: 403, message: 'Invalid refreshToken' });
      }

      // Hapus refreshToken yang lama dari daftar valid
      const index = validRefreshTokens.indexOf(refreshToken);
      if (index !== -1) {
        validRefreshTokens.splice(index, 1);
      }

      // Jika refreshToken valid, kita dapat menghasilkan access token yang baru
      const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '20s' });
      const newRefreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      // Simpan refreshToken yang baru ke daftar valid
      validRefreshTokens.push(newRefreshToken);

      return res.status(200).json({
        status: 200,
        message: 'Access token refreshed successfully',
        accessToken: accessToken,
        refreshToken: newRefreshToken
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Refresh token failed' });
  }
};

self.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(422).json({
        status: 422,
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });

    return res.status(201).json({ status: 201, message: 'User registered successfully', data: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({status: 500, message: 'Registration failed' });
  }
};

self.currentUser = async (req, res) => {
  try {
    const id = req.user.id
    const me = await User.findByPk(id)
    return res.status(200).json({
      status: 200,
      message: "Current user information",
      data: me
    })
  } catch (error) {
    console.error(error);
  }
}


module.exports = self;
