import express from 'express';

import { validateBody } from '../middlewares/validateBody.js';

import {
  registerSchema,
  loginSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
  confirmOAuthSchema,
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  sendResetEmailController,
  resetPasswordController,
  getOAuthController,
  confirmOAuthController
} from '../controllers/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-oauth-url', ctrlWrapper(getOAuthController));

router.post('/confirm-oauth', jsonParser, validateBody(confirmOAuthSchema), ctrlWrapper(confirmOAuthController));
export default router;
