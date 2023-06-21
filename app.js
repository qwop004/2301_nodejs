// app.js
"use strict";

/**
 * =====================================================================
 * Define Express app and set it up
 * =====================================================================
 */

// modules
const express = require("express"), // express를 요청
  layouts = require("express-ejs-layouts"), // express-ejs-layou패키지 불러오기.. 161쪽
  app = express(); // express 애플리케이션의 인스턴스화

// controllers 폴더의 파일을 요청
const pagesController = require("./controllers/pagesController"),
     subscribersController = require("./controllers/subscribersController"),
     usersController = require("./controllers/usersController"),
      errorController = require("./controllers/errorController");

const router = express.Router(); // Express 라우터를 인스턴스화
app.use("/", router); // 라우터 객체 사용,, 라우터를 express 애플리케이션에 추가 (미들웨어 함수와 라우트 추가 할것)

const methodOverride = require("method-override"); // method-override 미들웨어를 요청
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
); // method-override 미들웨어를 사용

/**
 * Listing 22.1 (p. 325)
 * app.js에서의 플래시 메시지 요청
//  */
const expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"); // Lesson 23 - express-validator 미들웨어를 요청

router.use(cookieParser("secret_passcode")); // cookie-parser 미들웨어를 사용하고 비밀 키를 전달
router.use(
  expressSession({
    // express-session 미들웨어를 사용
    secret: "secret_passcode", // 비밀 키를 전달
    cookie: {
      maxAge: 4000000, // 쿠키의 유효 기간을 설정
    },
    resave: false, // 세션을 매번 재저장하지 않도록 설정
    saveUninitialized: false, // 초기화되지 않은 세션을 저장하지 않도록 설정
  })
);
router.use(connectFlash()); // connect-flash 미들웨어를 사용

const passport = require('passport');// passport를 요청
router.use(passport.initialize());  // passport를 초기화
router.use(passport.session()); // passport가 Express.js 내 세션을 사용하도록 설정


const User = require('./models/User'); // User 모델을 요청
 passport.use(User.createStrategy()); // User 모델의 인증 전략을 passport에 전달
 passport.serializeUser(User.serializeUser()); // User 모델의 직렬화 메서드를 passport에 전달
 passport.deserializeUser(User.deserializeUser()); // User 모델의 역직렬화 메서드를 passport에 전달

// /**
//  * Listing 22.2 (p. 327)
//  * 응답상에서 connectFlash와 미들웨어와의 연계
//  */
router.use((req, res, next) => {
  // 응답 객체상에서 플래시 메시지의 로컬 flashMessages로의 할당
  res.locals.flashMessages = req.flash(); // flash 메시지를 뷰에서 사용할 수 있도록 설정
  res.locals.loggedIn = req.isAuthenticated();  // 로그인 여부를 확인하는 불리언 값을 로컬 변수에 추가
  res.locals.currentUser = req.user;  // 현재 사용자를 로컬 변수에 추가
  next();
});


















/**
 * =====================================================================
 * Define Mongoose and MongoDB connection
 * =====================================================================
 */

// // 애플리케이션에 Mongoose 설정. Mongoose는 MongoDB를 지원하는 nodejs확장모듈. DB데이터 조회시, 데이터를 javascript 객체로 바꿔줌.
const mongoose = require("mongoose"), // mongoose를 요청
  dbName = "taemin_final";            // 기존에 없으면 새로 생성. 오류없음.

// // 데이터베이스 연결 설정
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
  useNewUrlParser: true,
});

// // 연결되면 메시지를 보냄
const db = mongoose.connection;
db.once("open", () => {
  console.log(`Connected to ${dbName} MongoDB using Mongoose!`);
});

// /**
//  * =====================================================================
//  * Define app settings and middleware
//  * =====================================================================
//  */

app.set("port", process.env.PORT || 3000);

// // ejs 레이아웃 렌더링 
app.set("view engine", "ejs"); // ejs를 사용하기 위한 애플리케이션 세팅
router.use(layouts); // layout 모듈 사용을 위한 애플리케이션 세팅
router.use(express.static("public"));  
  
// // body-parser의 추가 177쪽
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// express-validator의 추가
router.use(expressValidator()); //최신버전 사용불가

// /**
//  * =====================================================================
//  * Define routes
//  * =====================================================================
//  */

// /**
//  * Pages
//  */
router.get("/", pagesController.showHome); // 홈 페이지 위한 라우트 추가
router.get("/about", pagesController.showAbout); // 코스 페이지 위한 라우트 추가

// /**
//  * @TODO: login 라우트 추가
//  *
//  * Listing 23.2 (p. 335)
//  * app.js로 로그인 라우트를 추가
//  */
router.get("/users/login", usersController.login);
router.post("/users/login", 
  usersController.authenticate, //authenticate,
  usersController.redirectView
);

router.get(
  "/users/logout",
  usersController.logout, 
  usersController.redirectView
);




// /**
//  * Users
//  */
router.get("/users", usersController.index, usersController.indexView); // index 라우트 생성
router.get("/users/new", usersController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/users/create", 
  usersController.validate, // Listing 23.6 (p. 344) - 사용자 생성 라우트에 유효성 체크 미들웨어 추가
  usersController.create,
  usersController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);

// /**
//  * Subscribers
//  */
router.get("/subscribers",
  subscribersController.index,
  subscribersController.indexView
); // index 라우트 생성

router.get("/subscribers/new", subscribersController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView
);
router.get("/subscribers/:id/edit", subscribersController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);

// =====================================================================
// 미들웨어 함수로 에러 처리하기 (169쪽)
app.use(errorController.resNotFound); // 미들웨어 함수로 에러 처리 추가 169쪽
app.use(errorController.resInternalError);
// =====================================================================

// =====================================================================
// 3000번 포트로 리스닝 설정 (app.set("port", process.env.PORT || 3000); 정의함)
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
