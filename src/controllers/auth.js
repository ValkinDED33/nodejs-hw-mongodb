import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  sendResetEmail,
  resetPassword,
  loginOrRegister,
} from '../services/auth.js';

import { getOAuthURL, validateCode } from '../utils/google-oauth.js';

export async function registerController(req, res) {
  const user = await registerUser(req.body);

  res
    .status(201)
    .json({ status: 201, message: 'User created successfully', data: user });
}

export async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId, refreshToken);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function sendResetEmailController(req, res) {
  const { email } = req.body;

  await sendResetEmail(email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}

export function getOAuthController(req, res) {
  const url = getOAuthURL();

  res.json({
    status: 200,
    message: 'Successfully get OAuth url',
    data: {
      oauth_url: url,
    },
  });
}

export async function confirmOAuthController(req, res) {
  const ticket = await validateCode(req.body.code);
  const session = await loginOrRegister(
    ticket.payload.email,
    ticket.payload.name,
  );

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  res.json({
    status: 200,
    message: 'Login with Google succsessfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}

