import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY START:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));
console.log("KEY END:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10));
console.log("KEY LENGTH:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length);