import { connection } from './connection.js';
import DataLoader from 'dataloader';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export const companyLoader = new DataLoader(async (ids) => {
  console.log("companyLoader ids: ",ids)
  const companies = await getCompanyTable().select().whereIn('id', ids);
  // Attention notre BatchingLoading Function attend de nous de retourner les items dans meme ordre de nos ids 
  return ids.map((id) => companies.find((company) => company.id === id));
})