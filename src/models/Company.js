import { ModelBase } from "@/lib/mongoose";

export class CompanyMd extends ModelBase {}

CompanyMd.init("Company", {
  name: { type: String, required: true },
  tax: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  color: { type: String },
  type: { type: Number },
  location: { type: Object },
  coords: [{ type: String }],
  status: { type: Number },
  deletedAt: { type: Date },
});

export const listCompanyMd = (where, page, limit, populates, attr, sort) => {
  return CompanyMd.find({ where, page, limit, populates, attr, sort });
};

export const countCompanyMd = (where) => {
  return CompanyMd.count({ where });
};

export const detailCompanyMd = (where, populates, attr) => {
  return CompanyMd.findOne({ where, populates, attr });
};

export const createCompanyMd = (attr) => {
  return CompanyMd.create({ attr });
};

export const updateCompanyMd = (where, attr) => {
  return CompanyMd.update({ where, attr });
};

export const updateManyCompanyMd = (where, attr) => {
  return CompanyMd.update({ where, attr });
};

export const deleteCompanyMd = (where) => {
  return CompanyMd.delete({ where });
};

export const aggregateCompanyMd = (aggregate) => {
  return CompanyMd.aggregate({ aggregate });
};
