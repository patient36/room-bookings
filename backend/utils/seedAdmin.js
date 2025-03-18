import User from "../models/user.model.js";

export const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ accountType: "admin" });
        if (existingAdmin) {
            console.log("Admin already exists. Skipping seeding.");
            return;
        }

        await User.create({
            name: process.env.FIRST_ADMIN_NAME || "Super Admin",
            email: process.env.FIRST_ADMIN_EMAIL,
            password: process.env.FIRST_ADMIN_PASSWORD,
            accountType: "admin",
            phone:process.env.FIRST_ADMIN_PHONE
        });

        console.log("Admin created successfully!");
    } catch (error) {
        console.error("Seeding error:", error);
    }
};
