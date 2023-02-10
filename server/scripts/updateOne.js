//variables

`{
    "record": {
        "firstName": "admin"
    },
    "filter": {
        "id": {
            "$oid": "63e4e5415050b560d54f4001"
        }
    }
}`

//profile update

`mutation UserProfileUpdateOne($record: UpdateOneUserProfileInput!, $filter: FilterUpdateOneUserProfileInput) {
  userProfileUpdateOne(record: $record, filter: $filter) {
    recordId
    }
}`

