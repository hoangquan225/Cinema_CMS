export default class ENDPONTAPI {
  static LOGIN = '/login';
  static REGISTER = '/register';
  static LOGOUT = '/logout';

  //film
  static UPDATE_FILM = '/film/update-film';
  static GET_ALL_FILM = '/film/get-all-film';
  static GET_FILM_BY_ID = '/film/get-film-by-id';
  static SEARCH_FILM = '/film/search-film';

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
  static GET_TICKET_BY_FILM_OR_DATE = '/ticket/get-ticket-by-film-or-date';
  static GET_SEAT_OF_SCHEDULE_BY_TICKET =
    '/ticket/get-seat-of-schedule-by-ticket';
  //upload
  static UPLOAD = '/upload';
}
