const { composeMongoose } = require('graphql-compose-mongoose');
const { schemaComposer } = require('graphql-compose');
const UserProfile = require("../models/userProfile");

const CustomUpdateResponseTC = schemaComposer.createObjectTC({
    name: 'CustomUpdateResponse',
    fields: {
        acknowledged: 'Boolean'
    }
})

async function userProfileSetNameAndPhoneResolver(source, args, context, info) {

    let { userId, firstName, phone } = args

    let result = await UserProfile.updateOne(
        { _id: userId },
        {
            $push: { phones: phone },
            $set: { firstName }
        }
    )
    return { acknowledged: result.acknowledged || false }
}

async function userProfileRemoveAssignedGroups(source, args, context, info) {

    let { profileId, assignedGroupId } = args

    let result = await UserProfile.updateOne(
        { _id: profileId },
        {
            $pull: {
                assignedGroups: { _id: assignedGroupId },
            }
        }
    )
    return { acknowledged: result.acknowledged || false }
}

async function userProfileUpdatePhoneType(source, args, context, info) {

    let { profileId, phoneId, phoneType } = args

    let result = await UserProfile.updateOne(
        { "_id": profileId, "phones._id": phoneId },
        {
            $set: {
                "phones.$.phoneType": phoneType
            }
        }
    )
    return { acknowledged: result.acknowledged || false }
}

async function updateAssignedGroupSkillExperienceDate(source, args, context, info) {

    let { profileId, assignedGroupId, skillId, experienceDate } = args

    let result = await UserProfile.updateOne(
        { "_id": profileId },
        {
            $set: {
                "assignedGroups.$[assignedGroupId].skills.$[skillId].experienceAsOfDate": experienceDate
            }
        },
        {
            arrayFilters: [{ "assignedGroupId._id": assignedGroupId }, { "skillId._id": skillId }]
        }
    )

    return { acknowledged: result.acknowledged || false }
}

async function userProfileRemovePhoneNumber(source, args, context, info) {

    console.log(args)

    let { profileId, phoneId } = args

    let result = await UserProfile.updateOne(
        { _id: profileId },
        {
            $pull: {
                phones: { _id: phoneId },
            }
        }
    )

    return { acknowledged: result.acknowledged || false }
}

//CONVERT THE MONGOOSE MODEL TO THE GRAPHQL SCHEMA COMPOSER, TC = TYPE COMPOSER

const customizationOptions = {}
const UserProfileTC = composeMongoose(UserProfile, customizationOptions);

/*
TODO: UNCOMMENT IF YOU NEED RAW OPS FOR QUERIES
schemaComposer.Query.addFields({
    userProfileById: UserProfileTC.mongooseResolvers.findById(),
    userProfileByIds: UserProfileTC.mongooseResolvers.findByIds(),
    userProfileOne: UserProfileTC.mongooseResolvers.findOne(),
    userProfileMany: UserProfileTC.mongooseResolvers.findMany(),
    userProfileCount: UserProfileTC.mongooseResolvers.count(),
    userProfileConnection: UserProfileTC.mongooseResolvers.connection(),
    userProfilePagination: UserProfileTC.mongooseResolvers.pagination(),
});
*/

// Add needed CRUD UserProfile operations to the GraphQL Schema

schemaComposer.Mutation.addFields({
    userProfileCreateOne: UserProfileTC.mongooseResolvers.createOne(),
    userProfileCreateMany: UserProfileTC.mongooseResolvers.createMany(),
    userProfileUpdateById: UserProfileTC.mongooseResolvers.updateById(),
    /*
    TODO - UNCOMMENTS THESE IF YOU NEED THE OTHER RAW OPS
    userProfileUpdateOne: UserProfileTC.mongooseResolvers.updateOne(),
    userProfileUpdateMany: UserProfileTC.mongooseResolvers.updateMany(),
    userProfileRemoveById: UserProfileTC.mongooseResolvers.removeById(),
    userProfileRemoveOne: UserProfileTC.mongooseResolvers.removeOne(),
    userProfileRemoveMany: UserProfileTC.mongooseResolvers.removeMany(),
    */
    userProfileSetNameAndPhone: {
        type: CustomUpdateResponseTC,
        args: { userId: 'MongoID!', firstName: 'String!', phone: 'JSON!' },
        resolve: userProfileSetNameAndPhoneResolver
    },
    userProfileRemoveAssignedGroups: {
        type: CustomUpdateResponseTC,
        args: { profileId: 'MongoID!', assignedGroupId: 'MongoID!' },
        resolve: userProfileRemoveAssignedGroups
    },
    userProfileRemovePhoneNumber: {
        type: CustomUpdateResponseTC,
        args: { profileId: 'MongoID!', phoneId: 'MongoID!' },
        resolve: userProfileRemovePhoneNumber
    },
    userProfileUpdatePhoneType: {
        type: CustomUpdateResponseTC,
        args: { profileId: 'MongoID!', phoneId: 'MongoID!', phoneType: "String!" },
        resolve: userProfileUpdatePhoneType
    },
    updateAssignedGroupSkillExperienceDate: {
        type: CustomUpdateResponseTC,
        args: { profileId: 'MongoID!', assignedGroupId: 'MongoID!', skillId: 'MongoID!', experienceDate: 'Date!' },
        resolve: updateAssignedGroupSkillExperienceDate
    }
});

module.exports = schemaComposer.buildSchema();
