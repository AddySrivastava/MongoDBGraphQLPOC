const { composeMongoose } = require('graphql-compose-mongoose');
const { schemaComposer } = require('graphql-compose');
const UserProfile = require("../models/userProfile");

const CustomUpdateResponseTC = schemaComposer.createObjectTC({
    name: 'CustomUpdateResponse',
    fields: {
        acknowledged: 'Boolean'
    }
})

async function userProfileSetNameAndPhone(source, args, context, info) {

    let { userId, firstName, payload } = args

    let result = await UserProfile.updateOne(
        { _id: userId },
        {
            $push: { phones: payload },
            $set: { firstName }
        }
    )
    return { recordId: result.acknowledged }
}

async function removeAssignedGroups(source, args, context, info) {

    let { profileId, assignedGroupId } = args

    let result = await UserProfile.updateOne(
        { _id: profileId },
        {
            $pull: {
                assignedGroups: { _id: assignedGroupId },
            }
        }
    )
    return { recordId: result.acknowledged } || false
}

async function removePhoneNumber(source, args, context, info) {

    return UserProfileTC.mongooseResolvers.createOne(args.payload)
}

//CONVERT THE MONGOOSE MODEL TO THE GRAPHQL SCHEMA COMPOSER, TC = TYPE COMPOSER

const customizationOptions = {}
const UserProfileTC = composeMongoose(UserProfile, customizationOptions);

console.log(UserProfileTC.mongooseResolvers.dataLoader());
//Add needed CRUD UserProfile operations to the GraphQL Schema
schemaComposer.Query.addFields({
    userProfileById: UserProfileTC.mongooseResolvers.findById(),
    userProfileByIds: UserProfileTC.mongooseResolvers.findByIds(),
    userProfileOne: UserProfileTC.mongooseResolvers.findOne(),
    userProfileMany: UserProfileTC.mongooseResolvers.findMany(),
    userProfileCount: UserProfileTC.mongooseResolvers.count(),
    userProfileConnection: UserProfileTC.mongooseResolvers.connection(),
    userProfilePagination: UserProfileTC.mongooseResolvers.pagination(),
});

schemaComposer.Mutation.addFields({
    userProfileCreateOne: UserProfileTC.mongooseResolvers.createOne(),
    userProfileCreateMany: UserProfileTC.mongooseResolvers.createMany(),
    userProfileUpdateById: UserProfileTC.mongooseResolvers.updateById(),
    userProfileUpdateOne: UserProfileTC.mongooseResolvers.updateOne(),
    userProfileUpdateMany: UserProfileTC.mongooseResolvers.updateMany(),
    userProfileRemoveById: UserProfileTC.mongooseResolvers.removeById(),
    userProfileRemoveOne: UserProfileTC.mongooseResolvers.removeOne(),
    userProfileRemoveMany: UserProfileTC.mongooseResolvers.removeMany(),
    userProfileSetNameAndPhone: {
        type: CustomUpdateResponseTC,
        args: { userId: 'MongoID!', firstName: 'String', payload: 'JSON!' },
        resolve: userProfileSetNameAndPhone
    },
    userProfileRemoveAssignedGroups: {
        type: CustomUpdateResponseTC,
        args: { profileId: 'MongoID!', assignedGroupId: 'MongoID!' },
        resolve: removeAssignedGroups
    },
    userProfileRemovePhoneNumber: {
        type: CustomUpdateResponseTC,
        args: { profileId: 'MongoID!', phoneId: 'MongoID!' },
        resolve: removePhoneNumber
    }
});

module.exports = schemaComposer.buildSchema();
