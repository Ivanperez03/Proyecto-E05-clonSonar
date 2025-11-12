import { db } from '../../config/db';

export const plataformaRepo = {
  async getAllPlatforms() {
    const { rows } = await db.query("SELECT * FROM plataforma");
    return rows;
  },
};
