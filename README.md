# MONGODB GRAPHQL POC

## Description
The MongoDB GraphQL POC is based on the graph-compose library and is using the mongoose plugin https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html of the same repository. 


## Setup

**Prerequisite**
Create a `.env` file and add MONGO_URL and PORT as the environment variables

**.env**

```
MONGO_URL=
PORT=
```

**Step 1**: Clone the repostiory via `git clone https://github.com/Pacifier24/MongoDBGraphQLPOC.git`

**Step 2**: Run the command `npm install` to install all the dependencies`

**Step 3**: Run command `npm run server` to run the apollo server on the default port **4000**

**Step 4**: Open the url http://localhost:4000/graphql to access the apollo server.

## Description

The POC is built on taking the below schema as a reference point. 

**UserProfile Schema**

```

{ 
      "id": "profileId1", 
      "firstName": "Alison", 
      "phones": [ 
        { 
          "id": "phoneId1", 
          "phoneNumber": "+11234567", 
          "phoneType": "CELL" 
        } 
      ], 
      "assignedGroups": [ 
        { 
          "id": "assignGroupId1", 
          "effectiveDate": "2023-01-1" 
          "group": { 
            "id": "groupId1", 
            "nameTranslate": "test" 
          }, 
          "skills": [ 
            { 
              "id": "skillId1", 
              "experienceAsOfDate": "2019-02-06" 
            } 
          ] 
        } 
      ] 
    } 
  }
  
```

### Mutations

The POC primarily focuses on the mutations in the GraphQL that natively supports the mongoose schema. Since it uses the [graphQL-compose-mongoose](https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html) schema, the user doesn't need to define the schema in mongoose and then for graphQL, the [graphQL-compose](https://graphql-compose.github.io/docs/intro/quick-start.html) uses the existing mongoose schema and then ingests that schema inside the schema composer to generate the graphQL endpoints. 

Although the composer directly provides raw methods, it is also possible to create your own custom mutations which is exactly what this POC aims to achieve.

Although these mutations can be directly accessed via the http://localhost:4000/graphql , the following provides a breif on what every mutation is trying to achieve.

#### List of custom mutations

**userProfileSetNameAndPhone** -> Updates the Name and pushes the phone number in the phones array. INPUT: profileID, firstName, phone 

**userProfileRemoveAssignedGroups** -> Removes assignedGroups by id from assignedGroups array. INPUT: profileId, assignedGroupId

**userProfileRemovePhoneNumber** -> Removes phones by id from phones array. INPUT: profileId, phoneId

**userProfileUpdatePhoneType** -> Updates phoneType by the profileId. INPUT: profileId, phoneId, phoneType

**updateAssignedGroupSkillExperienceDate** -> Updates experienceDate of a specific skill under an specific assignedGroup -> INPUT: profileId, assignedGroupId, skillId, experienceDate

**userProfileCreateOne** -> Creates a new userProfile record -> INPUT: record(user profile document)




