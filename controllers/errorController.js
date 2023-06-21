// errorController.js
"use strict";

const httpStatus = require("http-status-codes");

/**
 * Listing 11.2 (p. 168)
 * 에러 처리 미들웨어
 */
// 에러 처리 위한 미들웨어 추가
exports.logErrors = (err, req, res, next) => {
  console.error(err.stack); // 에러 스택 로깅
  next(err); // 다음 미들웨어 함수로 에허 전달
};

/**
 * Listing 12.11 (p. 184)
 * 에러 처리 라우트 추가
 */
exports.resNotFound = (req, res) => {
  // 앞에서 처리되지 못한 모든 요청 처리
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.render("_pages/404", {
    page: "404",
    title: "Not Found",
    error: errorCode,
    message: "The page you are looking for does not exist.",
  });
};

exports.resInternalError = (err, req, res, next) => {
  // 내부 서버 에러의 처리
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.error(`ERROR occurred: ${err.stack}`);
  res.status(errorCode);
  res.render("_pages/500", {
    page: "500",
    title: "Internal Server Error",
    error: errorCode,
    message: "Something went wrong on the server.",
  });
};

/**
 * [노트] 라우트 순서는 중요하다. 이 라우트는 기존에 존재하는 라우트 아래에 와야 한다.
 * 기존 라우트는 범용으로 사용되는 것이며 하위 라우트에 오버라이딩되기 때문이다.
 */
