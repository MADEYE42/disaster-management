import jsonfile from 'jsonfile';
import path from 'path';
import { Database } from './types';

const filePath = path.join(process.cwd(),'public' ,'data', 'users.json');

export const readData = async (): Promise<Database> => {
  try {
    return await jsonfile.readFile(filePath);
  } catch (error) {
    return { users: [], admins: [], volunteers: [], agencies: [] };
  }
};

export const writeData = async (data: Database): Promise<void> => {
  await jsonfile.writeFile(filePath, data, { spaces: 2 });
};