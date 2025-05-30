



// Create Session  Input :- Access Token , msg? Output :- Session_Id
// Delete Session  Input :- Session Id  Output :- True/False
// Update Session  Input :- Session Id,Title Output :- Updated Title
// GET Session     Input :- Access Token ,Output : Session Ids
//


class ApiClient<T>{

    endpoint:string

    constructor(endpoint:string) {
        this.endpoint = endpoint
    }



     create = async () => {


     }

}