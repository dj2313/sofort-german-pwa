import { db } from './db';
import a1 from '../data/a1_vocab.json';
import a2 from '../data/a2_vocab.json';

export async function seedDatabase() {
  try {
    const count = await db.vocab.count();
    if (count === 0) {
      console.log('Seeding initial database...');
      const defaultData = [...a1, ...a2].map(item => ({
        ...item,
        source: `builtin_${item.level.toLowerCase()}`,
        addedAt: new Date()
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.vocab.bulkAdd(defaultData as any);
      console.log('Database seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
