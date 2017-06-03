# API URL
http://52.187.181.75:8080/
# casptone-etours
This project for our graduation
# event-name api 
Come with event name as String and the following is parameter(s) type.

Ex: 

      {      
         event-name: 'chat message',         
         param: 
            {   
               message: String    
            }   
      }
      
      
# Client event (send to server)
     {
        event name: 'getTouristList',
        params: 
            {
              tourInstanceID: int, (current is 3, for testing)
              coachID: int (current is 1, for testing)
            }
     }
     
     {
        event name: 'Scan'
        params: 
            {
              cardCode: String,
              tourInstanceID: int
            }
     }
     
     {
       event name: 'Web Login'
       params: 
            {
              username: String,
              password: String (encoded) 
            }
     }
     
     
# Server event (send to client)
      {
        event name: 'getTouristList',
        data: 
            {
              touristList: array [{
                                      UserID: int,
                                      Fullname: String, 
                                      SeatNumber: String, 
                                      TouristStatus: int (1 on, 2 off )
                                    }] 
            }
      }
      
      {
        event name: 'Scan',
        data: 
            {
              status: String,
              fullname: String,
              UserID: int,
              SeatNumber: String,
              TouristStatus: int (1 on, 2 off) this status before update
            }
      }
      
      {
        event name: 'Web Login'
        loggedUser: 
             {
               fullname: String, 
               UserID: int,
               RoleID: int,
               UserActive: boolean,
               RoleActive: boolean,
               status: String,
               logStatus: String
             }
            
      }
