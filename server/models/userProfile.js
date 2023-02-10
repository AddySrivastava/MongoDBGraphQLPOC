const mongoose = require("mongoose");

const PhoneSchema = new mongoose.Schema({
    phoneNumber: String,
    phoneType: String
})

const GroupSchema = new mongoose.Schema({
    nameTranslate: String
})

const SkillSchema = new mongoose.Schema({
    experienceAsOfDate: Date
})

const AssignedGroupSchema = new mongoose.Schema({
    effectiveDate: Date,
    group: GroupSchema,
    skills: [{ type: SkillSchema }]
})

const UserProfileSchema = new mongoose.Schema({
    id: String,
    firstName: String,
    phones: [{ type: PhoneSchema }],
    assignedGroups: [{ type: AssignedGroupSchema }]
})

module.exports = mongoose.model("UserProfile", UserProfileSchema);