export const VERSON_NAME = "5.1.0"; // 版本名
export const VERSON_CODE = "34"; // 版本号
export const ISLOGIN = "islogin";//标识用户是否登录
export const CAR_SEARCH = "car_search";
export const CITY_SEARCH = "city_search";
export const USER_INFO = "user_info";//保存用户信息
export const GESTURE = "gesture";
export const USERNAME = "username";
export const LOGIN_TYPE = "login_type"
export const FIRST_INTO = "first_into"
export const INTO_TIME = "into_time";
export const CAR_TYPE_FOOTMARK = "car_type_footmark"; // 车品牌足迹
export const CAR_SEEK_DATA = 'car_seek_data';       //  车辆历史搜索
/* userinfo start */
export const BASE_USER_ID = "base_user_id";//用户ID
export const ENTERPRISE_LIST = "enterprise_list";//	企业列表	array<object> enterprise_list
export const HEAD_PORTRAIT_URL = "head_portrait_url";// 用户头像url head_portrait_url
export const IDCARD_NUMBER = "idcard_number";//用户身份证号 idcard_number
export const PHONE = "phone";//用户手机号 phone
export const REAL_NAME = "real_name";//用户姓名 real_name
export const LOAN_SUBJECT = "LOAN_SUBJECT";//当前选择借款主体
export const TOKEN = "token"; //token
export const USER_LEVEL = "user_level"; //	0：初级注册用户，1:正式用户 2：管理员用户  user_level
export const NEED_GESTURE = "need_gesture"; //	是否需要手势解锁
/* userinfo end */
export const NEED_OPENBRAND = "need_openbrand"; //	需要打开车型列表
export const NEED_CHECK_NEW_CAR = "checkNewCar";        // 选择新车列表
export const NEED_CHECK_USER_CAR = "checkUserCar";        // 选择二手车列表
export const NEED_USER_CHECK_RECOMMEND = "userCarcheckRecommend";   // 取消二手车推荐车源
export const NEED_NEW_CHECK_RECOMMEND = "newCarcheckRecommend";   // 取消新车推荐车源
export const NEED_TOAST_ERROR = "need_toast_error";   // 登录界面是否需要弹出异常提示
/* message start*/
export const ADVERTISEMENT_LAST_MESSAGE_TIME = "advertisement_last_message_time"; //车市头条数据库中缓存的最近一条数据的时间
export const SYSTEMS_LAST_MESSAGE_TIME = "systems_last_message_time"; //系统消息数据库中缓存的最近一条数据的时间
/* message end */
export const GET_USER_PERMISSION = "get_user_permission";   // 获取角色权限

export const MB_TX = "mb_txq";   // 提现
export const MB_SLSJ = "mb_slsjq";   // 受理时间
export const MB_ZHGL_ZZ = "mb_zhgl_zz";   // 账户管理 转账
export const MB_ZHGL_TX = "mb_zhgl_tx";   // 账户管理 提现
export const MB_ZHGL_CZ = "mb_zhgl_cz";   // 账户管理 充值
export const MB_LSSJ = "mb_lssj";   // 流水时间
export const MB_ZHGL_WKHWBD = "mb_zhgl_wkhwbd";   // 账号管理 未开户未绑定
export const MB_ZHGL_WKHWBD_YHK = "mb_zhgl_wkhwbd_yhk";   // 账号管理 未开户未绑定 银行卡
export const MB_ZHGL_YKHWBD = "mb_zhgl_ykhwbd";   // 账号管理 已开户未绑定
export const MB_ZHGL_BKJM = "mb_zhgl_bkjm";   // 账号管理 绑卡界面
export const MB_YKHYBD = "mb_ykhybd";   // 已开户已绑卡
export const MB_ZHGL_YKHYBD = "mb_zhgl_ykhybd";   // 账号管理 已开户已绑卡
export const MB_XZ_KTGRZH = "mb_xz_ktgrzh";   // 选择  开通个人账户
export const MB_XZ_KTQYZH = "mb_xz_ktqyzh";   // 选择 开通企业账户

export const MB_KTGRZH = "mb_ktgrzh";   //  开通企业账户
export const MB_KTQYZH = "mb_ktqyzh";   //  开通企业账户

export const HF_INDICATIVE_LAYER = '_indicative_layer';  //恒丰账户蒙层显示控制对象  @dingyonggang
export const HF_OPEN_INDIVIDUAL = 'open_individual';     // 开通个人账户蒙层
export const HF_OPEN_ENTERPRISE = 'open_enterprise';     // 开通企业账户蒙层
export const HF_OPEN_ENTERPRISE_OPTION = 'open_enterprise_option';    //开通企业选项蒙层
export const HF_OPEN_INDIVIDUAL_OPTION = 'open_individual_option';    //开通个人账户选项蒙层
export const HF_WITHDRAW_BUTTON = 'withdraw_button';            // 提现按钮蒙层
export const HF_WITHDRAW_INSTRUCTION= 'withdraw_instruction'; //提现银行受理时间及到账时间
export const HF_ACCOUNT_TRANSFER = 'transfer';    //账户管理转账条目说明蒙层
export const HF_ACCOUNT_WITHDRAW = 'account_withdraw';    //账户管理提现按钮蒙层
export const HF_ACCOUNT_DEPOSIT = 'account_deposit';    //账户管理充值页面
export const HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT = 'do_not_open_account';    //卡片页 未开恒丰账户
export const HF_ACCOUNT_DO_NOT_BIND_BANKCARD = 'account_do_not_bind_bankcard';    //卡片页 我的账户未绑卡 蒙层
export const HF_ACCOUNT_DID_BIND_BANKCARD = 'account_did_bind_bankcard';    //卡片页 我的账户已经绑卡蒙层
export const HF_MINE_OPEN_ACCOUNT = 'open_account';    //我的页面里账户管理条目蒙层
export const HF_MINE_DO_NOT_BIND_BANKCARD= 'mine_do_not_bind_bankcard';    //我的 账户管理 未绑卡蒙层
export const HF_MINE_DID_BIND_BANKCARD = 'account_did_bind_bankcard';    //我的 账户管理 已绑卡 蒙层
export const HF_TRANSACTION_LOG = 'transaction_log';    //账户流水时间筛选按钮蒙层01234
export const INVOICE_TITLE = "INVOICE_TITLE";   // 发票抬头
export const TAXPAYER_IDENTIFICATION_NUMBER = "TAXPAYER_IDENTIFICATION_NUMBER";   // 纳税人识别号
