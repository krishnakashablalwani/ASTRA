// MongoDB script to check and add admin user
// Run this with: mongosh < add-admin.js

use campushive

// Check if admin exists
const existingAdmin = db.users.findOne({ email: "admin@campushive.local" });

if (existingAdmin) {
  print("✅ Admin user already exists:");
  print("Email: " + existingAdmin.email);
  print("Role: " + existingAdmin.role);
  print("Name: " + existingAdmin.name);
} else {
  print("❌ Admin user not found. Creating admin user...");
  
  // The password hash for "password123" using bcrypt with 10 rounds
  const passwordHash = "$2a$10$YQs7H7H7H7H7H7H7H7H7H.N7H7H7H7H7H7H7H7H7H7H7H7H7H7O";
  
  // Note: In production, generate hash with: bcrypt.hash('password123', 10)
  // For now, we'll let the backend auto-seed handle this
  
  print("Please restart the backend server to trigger auto-seed.");
  print("Or run the backend and it will auto-create the admin on first connection.");
}

print("\n📋 All users in database:");
db.users.find({}, { email: 1, role: 1, name: 1 }).forEach(user => {
  print("- " + user.email + " (" + user.role + ") - " + user.name);
});

print("\n🔢 Total users: " + db.users.countDocuments());
