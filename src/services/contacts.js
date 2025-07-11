import { Contact } from '../models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const filterObject = { userId };

  if (typeof filter.type !== 'undefined') {
    filterObject.contactType = filter.type;
  }

  const [totalItems, contacts] = await Promise.all([
    Contact.countDocuments(filterObject),
    Contact.find(filterObject)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};

export const updateContact = async (contactId, payload, userId) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
  });
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};
