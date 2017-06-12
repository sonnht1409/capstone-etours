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
     
     {
      event name: 'Mobile Send Pick Up Location'
      params: 
            {
              tourInstanceID: int,
              coachID: int,
              userID: int,
              hour: int,
              min: int,
              lat: float,
              long: float     
            }
     }
     {
      event name: Mobile Get Schedule
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
             placeID: int
            }
     }
     
     {
      event name: 'Remove Place'
      params:
            {
             placeID: int
            }
     }
     
     {
      event name: 'Reactive Place'
      params: 
            {
             placeID: int     
            }
     } 
     
     ve: boolean    
            }
     }
      
     {
      event name: 'Create Visit Place'
      params: 
            {
              Name: string    
              latitude: float
              longitude: float
            }
     
     }
     
     {
      event name: 'Update Visit Place'
      params: 
            {
             Name: string,
             visitPlaceID: int
            }
     }
     
     {
      event name: 'Remove Visit Place'
      params:
            {
             visitPlaceID: int
            }
     }
     
     {
      event name: 'Reactive Visit Place'
      params: 
            {
             visitPlaceID: int     
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
                             longitude: float,
                             fullname: string,
                             phoneNumber: string,
                             tourName: string
                           
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
      
      {
        event name: 'Mobile Receiver Pick Up Notification'    
        data: 
            {
             tourInstanceID: int,
             coachID: int,
             receiverID: int,
             lat: float,
             long: float,
             hour: int,
             min: int,
             date: int,
             month: int,
             year: int,
             notification: string
            }
        ### Note: only process when user received this event have UserID = receiverID, tourInstanceID = tourInstanceID, coachID=coachID    
      }
      
      {
       event name: Mobile Get Schedule
       data: 
            {
              array [{
                     tourTimeScheduleList: array[{
                              TourInstanceDetailId: int
                              TourTime: string
                              VisitPlaceName: string
                              VisitingPlaceID: int
                              StartTime: datetime
                              EndTime: datetime
                              Activity: string
                              Latitude: float
                              Longitude: float
                         }]
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
      
      {
        event name: 'Create Visit Place'
        data: 
            {
                  status: string
            }
      }
      
      {
        event name: 'Update Visit Place'
        data: 
            {
                  status: string
            }
      }
      
      {
        event name: 'Remove Visit Place'
        data: 
            {
                  status: string
            }
      }
      
      {
        event name: 'Reactive Visit Place'
        data: 
            {
                  status: string
            }
      }
      
      
      {
        event name: 'Get Visit Place List'
        data: 
            {
                  placeList: array[{
                                    ID: int,
                                    Name: string
                                    IsActive: boolean
                                    Latitude:: float
                                    Longitude: float
                                   }]
            }
      }
