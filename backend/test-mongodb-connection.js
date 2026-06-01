import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dns from "node:dns";

// Fix DNS resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const sanitizeUri = (uri) => {
  try {
    const url = new URL(uri);
    if (url.password) {
      url.password = "****";
    }
    return url.toString();
  } catch (e) {
    return uri;
  }
};

console.log("=== MongoDB Connection Diagnostic ===");
console.log("Node.js version:", process.version);
console.log("Mongoose version:", mongoose.version);
console.log("MongoDB URI (sanitized):", sanitizeUri(process.env.MONGO_URI));

// Test SRV resolution
console.log("\n1. Testing DNS/SRV resolution...");
try {
  const dnsPromises = (await import('node:dns')).promises;
  
  try {
    const srvRecords = await dnsPromises.resolveSrv('_mongodb._tcp.cluster0.fxlsi2l.mongodb.net');
    console.log("✅ SRV records found:", srvRecords);
  } catch (srvErr) {
    console.log("❌ SRV resolution failed:", srvErr.message);
  }

  // Test direct host resolution
  try {
    const addresses = await dnsPromises.resolve4('cluster0.fxlsi2l.mongodb.net');
    console.log("✅ Direct A records found:", addresses);
  } catch (aErr) {
    console.log("❌ Direct A record resolution failed:", aErr.message);
  }
} catch (dnsErr) {
  console.log("⚠️ DNS module test failed:", dnsErr.message);
}

// Test direct MongoDB driver connection
console.log("\n2. Testing MongoDB native driver connection...");
try {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    tlsAllowInvalidCertificates: true,
  });
  await client.connect();
  console.log("✅ MongoDB native driver connected!");
  await client.close();
} catch (nativeErr) {
  console.log("❌ MongoDB native driver error:", nativeErr.message);
  console.log("Error details:", JSON.stringify(nativeErr, null, 2));
}

// Test mongoose connection
console.log("\n3. Testing Mongoose connection...");
try {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    tlsAllowInvalidCertificates: true,
  });
  console.log("✅ Mongoose connected successfully!");
  await mongoose.disconnect();
} catch (mongooseErr) {
  console.log("❌ Mongoose connection error:", mongooseErr.message);
  console.log("Error details:", JSON.stringify(mongooseErr, null, 2));
}

console.log("\n=== Diagnostic complete ===");
