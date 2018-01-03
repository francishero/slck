import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id','username']),
    },
    secret,
    {
      expiresIn: '2h',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [createToken, createRefreshToken]
};

export const refreshTokens = async (token, refreshToken, models, SECRET,SECRET2) => {
  let userId = -1;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }
  const refreshTokenSecret = user.password + SECRET2
  try {
    jwt.verify(refreshToken, refreshTokenSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshTokenSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    // user with provided email not found
    return {
      ok: false,
      errors: [{path: 'email', message: 'Invalid login check email or password'}]
    }
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
   return {
    ok: false,
    errors: [{path: 'password', message: 'Invalid login check email or password'}]
   }
  }

  // when user chnages password the hash changes and invalids the SECRET2 
  // this way when user has invlaid password we dont give them a token 
  const refreshTokenSecret = user.password+SECRET2
  
  const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

  return {
    ok: true,
    token,
    refreshToken,
  };
};