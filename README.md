# API URL

http://52.187.10.94:8080/

# Tool Test Socket event 
http://amritb.github.io/socketio-client-tool/

# Database server
etours2.database.windows.net
username: etours
password: $Son01627335534
azure: etoursserver@gmail.com
password: Anhphuong11

# casptone-etours
This project for our graduation
# event-name api 
Come with event name as String and the following is parameter(s) type.

Ex: 

      {      
         event-name: 'log message',         
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
             tourInstanceID: int,
             coachID: int     
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
              userList: array of UserID (if null or empty mean send to all tourist),
              message: string
              senderID: int
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
              userID: int,
              coachID: int,
              tourInstanceID: int,    
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
      
      {
       event name: 'Mobile Send Request'
       params:
            {
                  
                  type: int (2= đổi địa điểm, 3= thông báo sự cố)
                  userID: int
                  coachID: int
                  tourInstanceID: int
                  type =2 {
                    licensePlate: string
                    startPlaceName: string
                    destinationName: string    
                  }
                  type =3 {
                    message: string
                  }
            }
      }
      
      {
       event name: 'Mobile Get Notifications' (hàm nhận lại những request mình đã gởi)
       params:
            {
                 userID: int 
            }
      }
      
      {
       event name: 'Mobile Get Received Notifications' 
       params:
            {
                 userID: int 
            }
      }
      
      {
       event name: 'Web Get Notifications' 
       params:
            {
                 getAll: boolean (true = get all notification, false = get newest)
            }
      }
      
      {
       event name: 'Read Notification' (both web and mobile use it
       params:
            {
                 notificationID: int
            }
      }
      
      {
       event name: 'Get Scan History'     
       params:
            {
                 tourInstanceID:int,
                 userID: int
            }
      }

      {
       event name: 'Update Mobile Schedule'
       params:
            {
                  scanDataList: array[{
                                          scheduleID: int,
                                          status: int,
                                          numberPerTotal: string,
                                          listTouristOff: string
                                          note: string
                                    }]
                  userID: int                  
            }
      }

      {
       event name: 'Mobile Update Tourist Status'
       params:
            {
                 touristStatusList: array[{
                                                userID:int,
                                                touristStatus: int
                                          }] 
            }
      }

      {
       event name: 'Web Response Notification'
       params:
            {
               notificationID: int,
               isAccept: boolean (1 or 0)
            }
      }

      {
       event name: 'Tour Guide Get My Tour List'
       params: 
            {
               userID: int   
            }     
      }
      
      {
       event name: 'Mobile Upate Token'
       params:
            {
               userID: int,
               firebaseToken: string   
            }     
      }

      {
       event name: 'Start The Tour'
       params:
            {
               tourInstanceID: int
            }     
      }

      {
       event name: 'Complete Trip'
       params:
            {
              
               tourInstanceID: int   
            }     
      }

      {
       event name: 'Get Coach List In Tour'     
       params:
            {
              tourInstanceID: int    
            }
      }

      {
       event name: 'Get Schedule By Coach'
       params:
            {
              tourInstanceID: int,
              coachID: int    
            }     
      }

      {
       event name: 'Change Visit Place'
       params:
            {
              scheduleID: int,
              tourInstanceID: int,
              coachID: int,
              oldVisitPlaceID: int,
              oldVisitPlaceName: string,
              newVisitiPlaceID: int,
              newVisitPlaceName: string    
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
     
     {
      event name: 'Get Coach Company List'     
      params:
            {
               isActive: boolean   
            }
     }

     {
      event name: 'Create Coach Company'     
      params:
            {
              name: string    
            }
     } 

     {
      event name: 'Update Coach Company'     
      params:
            {
              name: string
              coachCompanyID: int
            }
     }

     {
      event name: 'Remove Coach Company'
      params:
            {
              coachCompanyID: int     
            }     
     }

     {
      event name: 'Reactive Coach Company'
      params:
            {
              coachCompanyID: int     
            }     
     }

     {
      event name: 'Get Tour List'
      params:
            {
              isActive: int     
            }     
     }

     {
      event name: 'Create Tour'
      params:
            {
              name: string,
              startPlaceID: int
              destinationID: int
              duration: string
              description: string
            }     
     }

     {
      event name: 'Update Tour'
      params:
            {
              name: string,
              startPlaceID: int
              destinationID: int
              duration: string
              description: string
              tourID: int     
            }     
     }

     {
      event name: 'Remove Tour'
      params:
            {
              tourID: int     
            }     
     }

     {
      event name: 'Reactive Tour'
      params:
            {
              tourID: int     
            }     
     }

     {
      event name: 'Update Visit Place Order'
      params:
            {
              tourID: int,
              visitPlaceOrderList: array[{
                                          
                                          visitPlaceID: int,
                                          priority: int
                                          }]    
            }     
     }

     {
      event name: 'Get Visit Place Order'
      params:
            {
                  tourID: int
            }     
     }

     {
      event name: 'Get Tourist Status List'
      params: 
            {
                  isActive: boolean (0 or 1)
            }
     }

     {
      event name: 'Create Tourist Status'
      params:
            {
                  status: string
            }

     }

     {
      event name: 'Update Tourist Status'     
      params:
            {
                  status: string
                  touristStatusID: int
            }
     }

     {
      event name: 'Remove Tourist Status'
      params:
            {
                  touristStatusID: int
            }
     }

     {
      event name: 'Reactive Tourist Status'
      params:
            {
                  touristStatusID: int
            }     
     }

     {
      event name: 'Get Tour Guide Status List'
      params: 
            {
                  isActive: boolean (0 or 1)
            }
     }

     {
      event name: 'Create Tour Guide Status'
      params:
            {
                  status: string
            }

     }

     {
      event name: 'Update Tour Guide Status'     
      params:
            {
                  status: string
                  tourGuideStatusID: int
            }
     }

     {
      event name: 'Remove Tour GUide Status'
      params:
            {
                  tourGuideStatusID: int
            }
     }

     {
      event name: 'Reactive Tour Guide Status'
      params:
            {
                  tourGuideStatusID: int
            }     
     }
     
     {
      event name: 'Get Tour Instance Status List'
      params:
            {
                  isActive: boolean (0 or 1)
            }
     }

     {
      event name: 'Create Tour Instance Status'
      params:
            {
                  status: string
            }     
     }

     {
      event name: 'Update Tour Instance Status'
      params:
            {
                  status: string
                  tourInstanceStatusID: int
            }     
     }

     {
      event name: 'Remove Tour Instance Status'
      params:
            {                  
                  tourInstanceStatusID: int
            }
     }

     {
      event name: 'Reactive Tour Instance Status'
      params:
            {                  
                  tourInstanceStatusID: int
            }
     }

     {
      event name: 'Get Tour Instance List'
      params:
            {
                  tourID: int,
                  tourInstanceStatus: int,
                  isActive: bit (1 or 0)
            }     
     }

     {
      event name: 'Create Tour Instance'
      params:
            {
                  startDate: datetime (both date and time include),
                  endDate: datetime (both date and time include),
                  tourID: int
            }     
     }

     {
      event name: 'Update Tour Instance'     
      params:
            {
                  startDate: datetime (both date and time include),
                  endDate: datetime (both date and time include),
                  tourID: int
                  tourInstanceStatus: int
                  tourInstanceID: int
            }
     }

     {
      event name: 'Remove Tour Instance'
      params: 
            {
                  tourInstanceID: int
            }     
     }

     {
      event name: 'Reactive Tour Instance'
      params: 
            {
                  tourInstanceID: int
            }     
     }

     {
      event name: 'Get All Tour Instance'
      params:
            {
                  isActive: bit
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
                                      CardCode: String
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
               LicensePlate,
               UserActive: boolean,
               RoleActive: boolean,
               TourID: int
               TourName: string,
               StartTime: datetime,
               EndTime: datetime,
               status: String,
               logStatus: String,
               Email: string,
               Address: string

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
                              scheduleID: int
                              TourInstanceDetailId: int
                              TourTime: string
                              Status: int
                              VisitPlaceName: string
                              VisitingPlaceID: int
                              StartTime: datetime
                              EndTime: datetime
                              Activity: string
                              Latitude: float
                              Longitude: float
                              ImageLink: string
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
        event name: 'Mobile Login By Card'
        loggedUser: 
             {
               fullname: String, 
               UserID: int,
               RoleID: int,
               TourInstanceID: int,
               CoachID: int,
               LicensePlate,
               UserActive: boolean,
               RoleActive: boolean,
               TourID: int
               TourName: string,
               StartTime: datetime,
               EndTime: datetime,
               status: String,
               logStatus: String,
               Email: string,
               Address: string
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
      
      {
       event name: 'Mobile Get Notifications'
       data:
            {
             notificationList: array [{
                                          notificationID: int
                                          message: string
                                          time: string (chưa +7 UTC)
                                          hour: int
                                          min: int
                                          year: int
                                          month: int 
                                          date: int
                                          header: string
                                          content: string
                                          isRead: bit
                                          isAccept: bit
                                          }]
            }
      }
      
      {
       event name: 'Web Get Notifications'
       data:
            {
             notificationList: array [{
                                          notificationID: int
                                          message: string
                                          time: string (chưa +7 UTC)
                                          senderID: int
                                          sender: string
                                          licensePlate: string
                                          tourName: string
                                          isRead: bit
                                          isAccept: bit
                                          type: int
                                          }]
            }
      }
      
      {
       event name: 'Web Trigger Notification'
       data: 
            {
              no data, after received this event, call socket.emit('Web Get Notification') event with param getAll = false
            }
      }
      
      
       event name: 'Mobile Get Received Notifications' 
       data:
            {
             notificationList: array [{
                                          notificationID: int
                                          message: string
                                          messageType: string
                                          time: string (chưa +7 UTC)
                                          senderID: int (0 mean sent from center)
                                          senderName: string (0 mean name = admin)
                                          receiverID:int
                                          receiverName: string                                         
                                          isRead: bit,
                                          isAccept: bit
                                          }]
            }
      }

       {
       event name: 'Get Scan History'     
       data:
            {
                 ScheduleID:int
                 UserID:int
                 OnTotal: string ( =numberPerTotal)
                 TouristOff: string ( =listTouristOff)
                 Note: string
                 Status: int
                 StartTime: datetime
                 EndTime: datetime
                 VisitingPlaceID: int
                 VisitingPlaceName
            }
      }

      {
       event name: 'Update Mobile Schedule'
       data:
            {
                  status: string
            }
      }

      {
       event name: 'Reschedule Time'
       data:
            {
                  status: string
            }     
      }

       {
       event name: 'Mobile Update Tourist Status'
       data:
            {
                status: string 
            }
      }
      
      

      {
       event name: 'Tour Guide Get My Tour List'
       data: 
            {
               myTourList: array[{
                                    TourName: String,
                                    TourInstanceID: int,
                                    CoachID: int
                                    StartTime: datetime,
                                    EndTime: datetime,
                                    LicensePlate: String,
                                    Status: String,
                                    TotalTourist: int,
                                    TotalVisitPlace:int
                                    }]
            }     
      }

      {
       event name: 'Mobile Update Token'
       data:
            {
               status: string  
            }     
      }

      {
       event name: 'Web Response Notification'
       data:
            {
               status: string
            }
      }

      {
       event name: 'Start The Tour'
       data:
            {
               status: string
            }     
      }

      {
       event name: 'Complete Trip'
       data:
            {
               status: string
            }     
      }

      {
       event name: 'Get Coach List In Tour'     
       data:
            {
              coachList: array[{
                                    id: int
                                    licensePlate: string
                              }]
            }
      }

      {
       event name: 'Get Schedule By Coach'
       data:
            {
              scheduleList: array [{
                                    TourInstanceDetailID: int
                                    TourTime: string
                                    StartTime: datetime
                                    EndTime: datetime
                                    Activity: string
                                    Status: int (1 completed, 2 on going, 3 future)
                                    CoachID: int
                                    VisitingPlaceID: int
                                    Name: string
                                    }]
            }     
      }

      {
       event name: 'Change Visit Place'
       data:
            {
                  status: string
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
      data:
            {
             status: string     
            }
     }
     
     {
      event name: 'Update Visit Place Type'
      data:
            {
             status: string
            }
     }
     
     {
      event name: 'Remove Visit Place Type'
      data:
            {
             status: string
            }
     }
     
     {
      event name: 'Reactive Visit Place Type'
      data:
            {
             status: string
            }
      }
      
      {
       event name: 'Get Visit Place Type List'
       data:
            {
              visitingPlaceTypeList: array[{    
                                                ID: int
                                                Name: string
                                                IsActive: boolean
                                          }]    
            }
      }

      {
       event name: 'Get Coach Company List'
       data:
            {
              coachCompanyList: array[{
                                          ID: int
                                          Name: string
                                          IsActive: boolean
                                     }]    
            }
      }

      {
       event name: 'Create Coach Company'
       data:
            {
              status: string    
            }     
      }

      {
       event name: 'Update Coach Company'
       data:
            {
              status: string    
            }     
      }

      {
       event name: 'Remove Coach Company'
       data:
            {
              status: string    
            }     
      }

      {
       event name: 'Reactive Coach Company'
       data:
            {
              status: string    
            }     
      }
           {
      event name: 'Get Tour List'
      data:
            {
              tourList: array[{
                              tourID: int  
                              tourName: string
                              startPlaceID: int
                              startPlaceName: string
                              destinationID: int
                              destinationName: string
                              duration: string
                              description: string
                              }]
            }     
     }

     {
      event name: 'Create Tour'
      data:
            {
              status: string,
              tourID: int
            }     
     }

     {
      event name: 'Update Tour'
      data:
            {
              status: string
            }     
     }

     {
      event name: 'Remove Tour'
      data:
            {
              status: string
            }     
     }

     {
      event name: 'Reactive Tour'
      data:
            {
              status: string
            }     
     }

     {
      event name: 'Update Visit Place Order'
      data:
            {
                  status: string
            }     
     }

     {
      event name: 'Get Visit Place Order'
      data:
            {
                  visitPlaceOrderList: array[{
                                                ID: int,
                                                TourID: int,
                                                VisitingPlaceID: int,
                                                Priority: int
                                                }]
            }     
     }

     {
      event name: 'Remove Visit Order List'
      data:
            {
                  status: string
            }     
     }

     {
      event name: 'Get Tourist Status List'
      data: 
            {
                  touristStatusList: array[{
                                                ID: int,
                                                Status: string,
                                                IsActive: boolean (0 , 1)
                                          }]
            }
     }

     {
      event name: 'Create Tourist Status'
      data:
            {
                  status: string
            }

     }

     {
      event name: 'Update Tourist Status'     
      data:
            {
                  status: string
            }
     }

     {
      event name: 'Remove Tourist Status'
      data:
            {
                  status: string
            }
     }

     {
      event name: 'Reactive Tourist Status'
      data:
            {
                  status: string
            }     
     }

     {
      event name: 'Get Tour Guide Status List'
      data: 
            {
                  tourGuideStatusList: array[{
                                                ID: int,
                                                Status: string,
                                                IsActive: boolean (0 , 1)
                                          }]
            }
     }

     {
      event name: 'Create Tour Guide Status'
      data:
            {
                  status: string
            }

     }

     {
      event name: 'Update Tour Guide Status'     
      data:
            {
                  status: string
            }
     }

     {
      event name: 'Remove Tour Guide Status'
      data:
            {
                  status: string
            }
     }

     {
      event name: 'Reactive Tour Guide Status'
      data:
            {
                  status: string
            }     
     }

     {
      event name: 'Get Tour Instance Status List'
      data:
            {
                  tourInstanceStatusList: array[{
                                                      ID: int,
                                                      Status:string
                                                      IsACtive: boolean (0 , 1)
                                                }]
            }
     }

     {
      event name: 'Create Tour Instance Status'
      data:
            {
                  status: string
            }     
     }

     {
      event name: 'Update Tour Instance Status'
      data:
            {
                  status: string
            }     
     }

     {
      event name: 'Remove Tour Instance Status'
      data:
            {
                  status: string
            }
     }

     {
      event name: 'Reactive Tour Instance Status'
      data:
            {
                  status: string
            }
     }

      {
      event name: 'Get Tour Instance List'
      data:
            {
                 tourInstanceList: array[{
                                          Duration:String
                                          EndTime: datetime
                                          StartTime: datetime
                                          TourID:int
                                          TourInstanceID:int
                                          TourName: String
                                        }] 
            }     
     }

     {
      event name: 'Create Tour Instance'
      data:
            {
                  status: string
            }     
     }

     {
      event name: 'Update Tour Instance'     
      data:
            {
                  status: string
            }
     }

     {
      event name: 'Remove Tour Instance'
      data: 
            {
                  status: string
            }     
     }

     {
      event name: 'Reactive Tour Instance'
      data: 
            {
                  status: string
            }     
     }

     {
      event name: 'Get All Tour Instance'
      data:
            {
                 tourInstanceList: array[{
                                          Duration:String
                                          EndTime: datetime
                                          StartTime: datetime
                                          TourID:int
                                          TourInstanceID:int
                                          TourName: String
                                          TourInstanceStatusID: int
                                          Status: string
                                          IsActive: bit
                                        }] 
            }     
     }