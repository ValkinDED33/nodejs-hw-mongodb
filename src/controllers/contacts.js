import * as fs from 'node:fs/promises';
import path from 'node:path';

import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export async function getContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const contactId = req.params.contactId;

  const contact = await getContactById(contactId, req.user._id);

  if (contact === null) {
    throw createHttpError.NotFound('Contact not found');
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function deleteContactController(req, res) {
  const contactId = req.params.contactId;

  const result = await deleteContact(contactId, req.user._id);

  if (result === null) {
    throw createHttpError.NotFound('Contact not found');
  }

  res.status(204).end();
}

export async function createContactController(req, res) {
  let photo = null;

  if (req.file) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'uploads', 'photos', req.file.filename),
      );
      photo = `http://localhost:3000/photos/${req.file.filename}`;
    }
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    ...(photo && { photo }),
  });

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  const contactId = req.params.contactId;

  let photo = null;

  if (req.file) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'uploads', 'photos', req.file.filename),
      );
      photo = `http://localhost:3000/photos/${req.file.filename}`;
    }
  }

  const updatedData = {
    ...req.body,
    isFavourite: req.body.isFavourite === 'true',
    ...(photo !== null && { photo }),
  };

  const result = await updateContact(contactId, updatedData, req.user._id);

  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.json({
    status: 200,
    message: 'Contact updated successfully',
    data: result,
  });
}
