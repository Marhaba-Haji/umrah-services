const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load .env
const envPath = path.resolve(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.error(".env file not found!");
  process.exit(1);
}
const env = fs
  .readFileSync(envPath, "utf-8")
  .split("\n")
  .filter(Boolean)
  .reduce((acc, line) => {
    const [key, ...rest] = line.split("=");
    acc[key.trim()] = rest.join("=").trim();
    return acc;
  }, {});

const { AMADEUS_API_KEY, AMADEUS_API_SECRET } = env;
if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
  console.error("AMADEUS_API_KEY or AMADEUS_API_SECRET missing in .env!");
  process.exit(1);
}

// Set env vars in Supabase (requires supabase CLI v1.137+)
console.log("Setting Supabase Edge Function secrets...");
execSync(
  `supabase secrets set AMADEUS_API_KEY=${AMADEUS_API_KEY} AMADEUS_API_SECRET=${AMADEUS_API_SECRET}`,
  { stdio: "inherit" },
);

// Deploy the function
console.log("Deploying amadeus-airport-suggest function...");
execSync("supabase functions deploy amadeus-airport-suggest", {
  stdio: "inherit",
});

console.log("✅ Deployment complete!");
