import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const { SERVER_URL } = process.env;

export const serverUrl = SERVER_URL;
export const serverUri = undefined;
