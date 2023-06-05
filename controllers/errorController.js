exports.logErrors = (error, req, res, next) => {
    console.error(error.stack);
    next(error);
};

const httpStatus = require("http-status-codes");

exports.resNotFound = (req, res) => {
    console.log("errorController : resNotFound 호출 완료");
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render('_pages/404', {
        page : "404",
        title : "Page Not Found",
        error : errorCode,
        messeage : "오류",
    });
    //res.send(`${errorCode} | 페이지 없음`);
};

exports.resInternalError = (errors, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occured: ${errors.stack}`);
    res.status(errorCode);
    res.render('_pages/500', {error : errorCode});
    // res.send(`${errorCode} | 서버 에러`)
}