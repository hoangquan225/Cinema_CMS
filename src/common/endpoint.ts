export default class ENDPONTAPI {
  static LOGIN = '/login';
  static REGISTER = '/register';
  static LOGOUT = '/logout';

  //film
  static UPDATE_FILM = '/film/update-film';
  static GET_ALL_FILM = '/film/get-all-film';
  static GET_FILM_BY_ID = '/film/get-film-by-id';
  static SEARCH_FILM = '/film/search-film';
  static GET_FILM_BY_STATUS = '/film/get-film-by-status';
  static GET_FILM_BY_CATEGORY = '/film/get-film-by-category';
  static AUTO_UPDATE_STATUS_FILM = '/film/auto-update-status-film';

  //User
  static UPDATE_USER = '/user/update-user';
  static GET_USER_BY_ID = '/user/get-user-by-id';
  static CHANGE_PASSWORD = '/user/change-password';
  static GET_USER_FROM_TOKEN = '/user/get-user-from-token';
  static FORGOT_PASSWORD = '/user/forgot-password';
  static CHECK_RESET_PASSWORD = '/user/check-reset-password';
  static RESET_PASSWORD = '/user/reset-password';

  //ticket
  static CREATE_TICKET = '/ticket/create-ticket';
  static GET_ALL_TICKET = '/ticket/get-all-ticket';
  static GET_SEAT_OF_SCHEDULE_BY_TICKET =
    '/ticket/get-seat-of-schedule-by-ticket';
  static GET_TICKET_BY_USER = '/ticket/get-ticket-by-user';


  //upload
  static UPLOAD = '/upload';

  // statistic 
  static LOAD_STATISTIC = '/loadStatistic'

  //schedule
  static UPDATE_SCHEDULE = '/schedule/update-schedule'
  static GET_SCHEDULE = '/schedule/get-schedule'
}
