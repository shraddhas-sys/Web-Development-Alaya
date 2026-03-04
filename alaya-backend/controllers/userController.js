const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

// User Registration
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// User login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        if (user.isDisabled) {
            return res.status(403).json({ success: false, message: "Account is disabled. Please contact an administrator." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginCount = (user.failedLoginCount || 0) + 1;
            await user.save();
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Successful login update
        user.failedLoginCount = 0;
        user.loginCount = (user.loginCount || 0) + 1;
        user.lastLoginAt = new Date();
        await user.save();

        const secret = process.env.JWT_SECRET || "dev_secret_change_me";
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            secret,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone,
                bio: user.bio,
                profilepic: user.profilepic,
                isDisabled: user.isDisabled,
                lastLoginAt: user.lastLoginAt,
                loginCount: user.loginCount,
                failedLoginCount: user.failedLoginCount
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, phone, bio, profilepic } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        //  user admin authorization
        if (req.user && req.user.role !== 'admin' && parseInt(req.user.id, 10) !== parseInt(id, 10)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }


       // update fill
        user.username = username || user.username;
        user.phone = phone || user.phone;
        user.bio = bio || user.bio;
        user.profilepic = profilepic || user.profilepic;

        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Sanctuary Profile Harmonized! ",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone,
                bio: user.bio,
                profilepic: user.profilepic
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// change password
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (req.user && req.user.role !== 'admin' && parseInt(req.user.id, 10) !== parseInt(id, 10)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }


        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Current password incorrect" });

        // password validation
        if (newPassword.length < 8 || !/[A-Z]/.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Security Standard: Password must be at least 8 characters and include one uppercase letter."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ success: true, message: "Security Strengthened! " });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (req.user && req.user.role !== 'admin' && parseInt(req.user.id, 10) !== parseInt(id, 10)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }


        await user.destroy();
        return res.status(200).json({ success: true, message: "Identity Dissolved." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// forgot and reset
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, message: "No Seeker found." });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Reset link dispatched.",
            resetToken: resetToken
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token." });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Identity secured!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Change security password
exports.changeSecurityPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, currentSecurityPassword, newSecurityPassword } = req.body;

        if (!newSecurityPassword) {
            return res.status(400).json({ success: false, message: "newSecurityPassword is required" });
        }

        // Policy: 8+ and at least one uppercase
        if (newSecurityPassword.length < 8 || !/[A-Z]/.test(newSecurityPassword)) {
            return res.status(400).json({ success: false, message: "Security password must be at least 8 characters and include an uppercase letter." });
        }

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // user or admin
        if (req.user && req.user.role !== 'admin' && parseInt(req.user.id, 10) !== parseInt(id, 10)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        // If already set, require currentSecurityPassword; otherwise require currentPassword
        if (user.securityPasswordHash) {
            if (!currentSecurityPassword) return res.status(400).json({ success: false, message: "currentSecurityPassword is required" });
            const ok = await bcrypt.compare(currentSecurityPassword, user.securityPasswordHash);
            if (!ok) return res.status(400).json({ success: false, message: "Current security password incorrect" });
        } else {
            if (!currentPassword) return res.status(400).json({ success: false, message: "currentPassword is required" });
            const ok = await bcrypt.compare(currentPassword, user.password);
            if (!ok) return res.status(400).json({ success: false, message: "Current password incorrect" });
        }

        user.securityPasswordHash = await bcrypt.hash(newSecurityPassword, 10);
        await user.save();

        return res.status(200).json({ success: true, message: "Security password updated." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
