# API URL
http://52.187.17.228:8080/

# Database server
etours.database.windows.net
password: $Son01627335534
azure: phuongtase61553@fpt.edu.vn
password: Anhphuong11

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
     
     {
       event name: 'Mobile Login'
       params: 
            {
              username: String,
              password: String (encoded) 
            }
     }
     
     {
      event name: 'Mobile Sent GPS'
      params: 
            {
              tourInstanceID: int,
              coachID: int,
              userID: int,
              lat: float
              long: float
            }
     }
     
     {
      event name: 'Web Get GPS'
      params:
            {
              tourInstanceID: int,
              roleID: int
            }
     }

     {
      event name: 'Get Visit Place Location'
      params:
            {
              tourInstanceID: int
            }
     }
     
## CRUD

     {
      event name: 'Get Place List'
      params: 
            {
              IsActive: boolean    
            }
     }
      
     {
      event name: 'Create Place'
      params: 
            {
              Name: string    
            }
     
     }
     
     {
      event name: 'Update Place'
      params: 
            {
             Name: string,
             ID: int
            }
     }
     
     {
      event name: 'Remove Place'
      params:
            {
             ID: int
            }
     }
     
     {
      event name: 'Reactive Place'
      params: 
            {
             ID: int     
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
      
      {
        event name: 'Mobile Login'
        loggedUser: 
             {
               fullname: String, 
               UserID: int,
               RoleID: int,
               TourInstanceID: int,
               CoachID: int,
               UserActive: boolean,
               RoleActive: boolean,
               status: String,
               logStatus: String
             }
            
      }
      
      {
        event name: 'Mobile sent GPS'
        data: 
            {
              implement late
            }
      }
      
      {
        event name: 'Web Get GPS'
        data:
            {
              gpsList: array[{
                             userID: int,
                             latitutde: float
                             longitude: float
                           
                             }]                
            }
      }
      
      {
        event name: 'Get Visit Place Location'
        data: 
            {
             visitingPlaceList: array[{
                                          Name: string
                                          latitude: float
                                          longitude: float
                                          priority: int
                                      }]  
            }
      }
## CRUD
      {
        event name: 'Create Place'
        data: 
            {
                  status: string
            }
      }
      
      {
        event name: 'Update Place'
        data: 
            {
                  status: string
            }
      }
      
      {
        event name: 'Remove Place'
        data: 
            {
                  status: string
            }
      }
      
      {
        event name: 'Reactive Place'
        data: 
            {
                  status: string
            }
      }
      
      {
        event name: 'Get Place List'
        data: 
            {
                  placeList: array[{
                                    id: int,
                                    name: string
                                    isActive: boolean
                                   }]
            }
      }
