const { Client, Databases, Storage } = require('node-appwrite');
require('dotenv').config();

const { Client, Databases, Storage, ID } = require('node-appwrite');
require('dotenv').config();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_VEHICLES_ID;

module.exports = { client, databases, storage, DATABASE_ID, COLLECTION_ID, ID };