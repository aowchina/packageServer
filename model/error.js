
var errorMap = {};
var  ErrorCode ={
    PasswordWrong : 1000,
    NotAddmin:1001,
    UserNotExists:1002,
    DateBaseError:1003,
    TokenExpired:1004,
    CompanyNotExist:1005,
    CompanyDuplicate:1006,
    ParamError:1007,
    JenkinsError:1008,
    BuildingExists:1009
}; 
setError(ErrorCode.PasswordWrong,"密码错误");
setError(ErrorCode.NotAddmin,"请使用admin账户");
setError(ErrorCode.UserNotExists,"用户不存在");
setError(ErrorCode.DateBaseError,"数据库异常");
setError(ErrorCode.TokenExpired,"登录过期");
setError(ErrorCode.CompanyNotExist,"企业不存在");
setError(ErrorCode.CompanyDuplicate,"企业已存在");
setError(ErrorCode.ParamError,"参数错误");
setError(ErrorCode.JenkinsError,"jenkins错误");
setError(ErrorCode.BuildingExists,"已经存在正在打包的进程");

function setError(code,errorInfo){
    errorMap[code] = errorInfo;
}
function error(code,errorInfo){
    var info = {};
    info.code = code;
    info.errorInfo = errorInfo||errorMap[code];
    return info;
}

error.code = ErrorCode;

module.exports = error;
