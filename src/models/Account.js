import { ModelBase } from "@/lib/mongoose";

export class AccountMd extends ModelBase {}

AccountMd.init("Account", {
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  lastLogin: { type: Date },
  otp: { type: String },
  timeSendOtp: { type: Date },
  deletedAt: { type: Date },
});

export const listAccountMd = (where, page, limit, populates, attr, sort) => {
  return AccountMd.find({ where, page, limit, populates, attr, sort });
};

export const countAccountMd = (where) => {
  return AccountMd.count({ where });
};

export const detailAccountMd = (where, populates, attr) => {
  return AccountMd.findOne({ where, populates, attr });
};

export const createAccountMd = (attr) => {
  return AccountMd.create({ attr });
};

export const updateAccountMd = (where, attr) => {
  return AccountMd.update({ where, attr });
};

export const updateManyAccountMd = (where, attr) => {
  return AccountMd.update({ where, attr });
};

export const deleteAccountMd = (where) => {
  return AccountMd.delete({ where });
};

export const aggregateAccountMd = (aggregate) => {
  return AccountMd.aggregate({ aggregate });
};
