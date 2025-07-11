import express from 'express';
import { isValidId } from '../middlewares/validateObjectId.js';

import {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

router.post(
  '/',
  upload.single('photo'),
  ctrlWrapper(createContactController)
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  ctrlWrapper(updateContactController)
);

export default router;
