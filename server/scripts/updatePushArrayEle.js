// variables

`{
	"userId": "63e4e5415050b560d54f4001",
	"firstName": "addy",
	"payload": {
		"phoneNumber": "+14381234509",
		"phoneType": "CELL2"
	}
}`


// mutation query

`mutation UserProfilePushElementInArray($userId: MongoID!, $payload: JSON!, $firstName: String) {
  userProfilePushElementInArray(userId: $userId, payload: $payload, firstName: $firstName) {
    upsertedId
  }
}`