import { MongoClient } from "mongodb";
import fs from "fs";
import { Parser } from "json2csv";

const uri = 'mongodb+srv://mshsun20:msh150@vendsolapp.ovu9v.mongodb.net/?retryWrites=true&w=majority&appName=vendsolapp'; // Replace with your MongoDB URI
const dbName = 'vendsoldb'; // Replace with your DB name

async function exportCollectionsToCSV() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    for (const { name: collectionName } of collections) {
      const data = await db.collection(collectionName).find({}).toArray();

      if (data.length === 0) {
        console.log(`Skipping empty collection: ${collectionName}`);
        continue;
      }

      // Convert to CSV
      const parser = new Parser();
      const csv = parser.parse(data);

      // Write to file
      fs.writeFileSync(`./datasets/${collectionName}.csv`, csv);
      console.log(`Exported ${collectionName}.csv`);
    }

    console.log('All collections exported.');
  } catch (error) {
    console.error('Error exporting:', error);
  } finally {
    await client.close();
  }
}

exportCollectionsToCSV();