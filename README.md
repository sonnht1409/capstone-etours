# API URL
http://52.187.117.134:8080/

# Tool Test Socket event 
http://amritb.github.io/socketio-client-tool/

# Database server
etours1.database.windows.net
password: $Son01627335534
azure: sonnht1409@gmail..com
password: $evil001

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
     
     {
      event name: 'Mobile Get Others Location'
      params: 
            {
              tourInstanceID: int,
              coachID: int,
              roleID: int (0 if want to select all, other to select specific role),
              currentRoleID: int (role of device which sent event to server)
            }
     }
     
     {
      event name: 'Mobile Gather Tourist'
      params: 
            {
              tourInstanceID: int,
              coachID: int,
              userList: array of UserID (if null or empty mean send to all tourist)
            }
     }
     
     {
      event name: 'Mobile Login By Card'
      params:
            {
             cardCode: string
            }
     }
     
     {
       event name: 'Driver Get Next Pick Up'
       params: 
            {
              tourInstanceID: int,
              coachID: int
            }
      }
      
      {
       event name: 'Reschedule Time'
       params:
            {
              scheduleList: array object, ex: [{
                    scheduleID: 9,
                    startYear: 2017,
                    startMonth: 6 (đúng với tháng hiện tại),
                    startDate: 1,
                    startHour: 6,
                    startMin: 15,
                    endYear: 2017,
                    endMonth: 6,
                    endDate: 1,
                    endHour: 6,
                    endMin: 30
                }, {
                    scheduleID: 1,
                    startYear: 2017,
                    startMonth: 6 (đúng với tháng hiện tại),
                    startDate: 1,
                    startHour: 7,
                    startMin: 15,
                    endYear: 2017,
                    endMonth: 6,
                    endDate: 1,
                    endHour: 9,
                    endMin: 30
                }]
              
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
             name: string,
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
     
         
     {
      event name: 'Create Visit Place'
      params: 
            {
             name:string
             latitude: float
             longitude: float
             typeID: int
             
            }
     }
     
     {
      event name: 'Update Visit Place'
      params:
            {
             name: string
             latitude: float
             longitude: float
             typeID: int
             visitPlaceID: int
            }
     }
     {
      event name: 'Remove Visit Place'
      params: 
            {
              placeID: int    
            }
     }
     
     {
      event name: 'Reactive Visit Place'
      params:
            {
              placeID: int     
            }
     }
     
     {
      event name: 'Get Visit Place List'
      params:
            {
             isActive: boolean     
            }
     }
     
     {
      event name: 'Get Visit Place Type List'
      params: 
            {
             isActive: boolean     
            }
     }
     
     {
      event name: 'Create Visit Place Type'
      params:
            {
             name: string     
            }
     }
     
     {
      event name: 'Update Visit Place Type'
      params:
            {
             name: string
             visitingPlaceTypeID: int
            }
     }
     
     {
      event name: 'Remove Visit Place Type'
      params:
            {
             visitingPlaceTypeID: int     
            }
     }
     
     {
      event name: 'Reactive Visit Place Type'
      params:
            {
             visitingPlaceTypeID: int     
            }
      }
      
      {
       event name: 'Get Visit Place Type List'
       params:
            {
              isActive: boolean    
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
                             UserID: int,
                             latitutde: float
                             longitude: float,
                             Fullname: string,
                             PhoneNumber: string,
                             TourName: string,
                             RoleID: int
                             
                           
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
      
      {
        event name: 'Mobile Get Others Location'     
        data: 
            {
                  userLocationList: array[{
                                            Fullname: string
                                            Latitude: float
                                            Longitude: float
                                            PhoneNumber: string
                                            role: string
                                            SeatNumber: string
                                            UserID: int
                                          }]
            }
      }
      
      {
      event name: 'Mobile Gather Tourist'
      data: 
            {
              tourInstanceID: int,
              coachID: int,
              userList: array of UserID,
              message: string
              
            }
     }
     
     {
        event name: 'Mobile Login By Card'
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
       event name: 'Driver Get Next Pick Up'
       data: 
            {
              latitude: float
              longitude: float
              hour: int
              min: int
              date: int
              month: int
              year: int
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
                                    visitPlaceID: int,
                                    visitPlaceName: string
                                    IsActive: boolean
                                    Latitude:: float
                                    Longitude: float
                                    typeID: int
                                    typeName: string
                                   }]
            }
      }
      
      {
      event name: 'Create Visit Place Type'
      params:
            {
             status: string     
            }
     }
     
     {
      event name: 'Update Visit Place Type'
      params:
            {
             status: string
            }
     }
     
     {
      event name: 'Remove Visit Place Type'
      params:
            {
             status: string
            }
     }
     
     {
      event name: 'Reactive Visit Place Type'
      params:
            {
             status: string
            }
      }
      
      {
       event name: 'Get Visit Place Type List'
       params:
            {
              visitingPlaceTypeList: array[{    
                                                ID: int
                                                Name: string
                                                IsActive: boolean
                                          }]    
            }
      }
