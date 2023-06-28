import AppConfig from '../common/config';

class UserInfo {
  _id?: string;
  // account: string;
  password: string;
  name: string;
  email: string;
  loginCode?: number;
  phoneNumber?: string;
  avatar?: string;
  googleId?: string;
  address?: string;
  birth?: number;
  gender?: number;
  registerDate?: number;
  token?: string;
  lastLogin?: number;
  status?: number;
  userRole?: number;
  passwordChangeAt: number;
  passwordResetToken: string;
  passwordResetExpires: number;

  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this._id = args._id ?? undefined;
    // this.account = args.account ?? '';
    this.name = args.name ?? '';
    this.avatar = args.avatar ?? '';
    this.loginCode = args.loginCode ?? AppConfig.LOGIN_SUCCESS;
    this.email = args.email ?? '';
    this.phoneNumber = args.phoneNumber ?? '';
    this.password = args.password ?? '';
    this.address = args.address ?? '';
    this.googleId = args.googleId ?? '';
    this.birth = args.birth ?? 0;
    this.gender = args.gender ?? AppConfig.GENDER_OTHER;
    this.registerDate = args.registerDate ?? 0;
    this.token = args.token ?? '';
    this.lastLogin = args.lastLogin ?? Date.now();
    this.status = args.status ?? 1;
    this.userRole = args?.userRole ?? AppConfig.ROLE_USER;
    this.passwordChangeAt = args?.passwordChangeAt ?? Date.now();
    this.passwordResetToken = args?.passwordResetToken ?? '';
    this.passwordResetExpires = args?.passwordResetExpires ?? 0;
  }
}

export { UserInfo };
