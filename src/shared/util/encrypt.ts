import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const encryptPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};

/**
 * Compare password for login
 * @param password - user input password
 * @param hash - password hash from database
 * @returns {Promise<boolean>} - return true if password match, otherwise return false
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const result = await bcrypt.compare(password, hash);
  return result;
};
