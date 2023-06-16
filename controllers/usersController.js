// controllers/usersController.js
"use strict";

/**
 * Listing 18.11 (p. 271)
 * userController.js에서 인덱스 액션 생성과 index 액션의 재방문
 */
const passport = require("passport"),
  User = require("../models/User"); // 사용자 모델 요청

/**
 * Listing 22.3 (p. 328)
 * userController.js에서 create액션이 플래시 메시지를 추가
 *
 * [노트] getUserParams는 이전 캡스톤 프로젝트 (21장)에서 사용돼 왔다. 이 함수는 컨트롤러를 통해
 * 재사용돼 사용자 속성을 하나의 객체로 구성한다. 동일한 함수를 다른 모델 컨트롤러에도 구성해야 한다.
 */
const getUserParams = (body) => {
  return {
    username: body.username,
    name: {
      first: body.first,
      last: body.last,
    },
    email: body.email,
    password: body.password,
    profileImg: body.profileImg,
  };
};

module.exports = {
  /**
   * Listing 23.3 (p. 336)
   * userController.js로의 로그인과 인증 액션 추가
   */
  login: (req, res) => {
    res.render("users/login", {
      page: "login",
      title: "Login",
    });
  },

  /**
   * @TODO:
   * 
   * Listing 24.5 (p. 356)
   * usersController.js에서 passport 인증 미들웨어 추가
   * 원래 있는 코드는 다 지우고 아래 코드로 대체
   */

  // local strategy로 사용자를 인증하기 위해 passport 호출
  authenticate: passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),
  // passport의 authenticate 메소드를 사용해 사용자 인증

  /**
   * @TODO:
   * 
   * Listing 24.8 (p. 359)
   * usersController.js에서 logout 액션 추가
   */
  logout: (req, res, next) => {
    req.logout(() => {
      console.log("Logged out!");
    });
    req.flash("success", "Logged out!");
    res.locals.redirect = "/";
    next();
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },



  /** Create */
    // 폼의 렌더링을 위한 새로운 액션 추가
  new: (req, res) => {
    res.render("users/new", {
      page: "new-user",
      title: "New User",
    });
  },

  validate: (req, res, next) => {
    // 사용자가 입력한 이메일 주소가 유효한지 확인
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim(); // trim()으로 whitespace 제거
    req.check("email", "Email is invalid").isEmail();
    req.check("password", "Password cannot be empty").notEmpty(); // password 필드 유효성 체크

    // 사용자가 입력한 비밀번호가 일치하는지 확인
    req.getValidationResult().then((error) => {
      // 앞에서의 유효성 체크 결과 수집
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true; // skip 속성을 true로 설정
        req.flash("error", messages.join(" and ")); // 에러 플래시 메시지로 추가
        res.locals.redirect = "/users/new"; // new 뷰로 리디렉션 설정
        next();
      } else {
        next(); // 다음 미들웨어 함수 호출
      }
    });
  },


  create: (req, res, next) => {
    if (req.skip) next(); // 유효성 체크를 통과하지 못하면 다음 미들웨어 함수로 전달

    let newUser = new User(getUserParams(req.body));

    User.register(newUser, req.body.password, (error, user) => {
      if(user){ //success
        req.flash(
          "success",
          `${user.fullName}'s account created!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}`
        );
        res.locals.redirect = "/users/new";
        next(); 
      }
    });
  },

/**Read */

  index: (req, res, next) => {
    User.find() // index 액션에서만 퀴리 실행
      .then((users) => {
        // 사용자 배열로 index 페이지 렌더링
        res.locals.users = users; // 응답상에서 사용자 데이터를 저장하고 다음 미들웨어 함수 호출
        next();
      })
      .catch((error) => {
        // 로그 메시지를 출력하고 홈페이지로 리디렉션
        console.log(`Error fetching users: ${error.message}`);
        next(error); // 에러를 캐치하고 다음 미들웨어로 전달
      });
  },

  indexView: (req, res) => {
    res.render("users/index", {
      page: "users",
      title: "All Users",
      flashMessages: {
      //   // Listing 22.6 (p. 331) - 렌더링된 인덱스 뷰에서 플래시 메시지를 추가
        success: "Loaded all users!",
      },
    }); // 분리된 액션으로 뷰 렌더링
  },


  show: (req, res, next) => {
    let userId = req.params.id; // request params로부터 사용자 ID 수집
    User.findById(userId) // ID로 사용자 찾기
      .then((user) => {
        res.locals.user = user; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error); // 에러를 로깅하고 다음 함수로 전달
      });
  },

  // show 뷰의 렌더링
  showView: (req, res) => {
    res.render("users/show", {
      page: "user-details",
      title: "User Details",
    });
  },

  /**
   * Listing 20.6 (p. 294)
   * edit와 update 액션 추가
   */
  // edit 액션 추가
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId) // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
      .then((user) => {
        res.render("users/edit", {
          user: user,
          page: "edit-user",
          title: "Edit User",
        }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // update 액션 추가
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = getUserParams(req.body);

    User.findByIdAndUpdate(userId, {
      $set: userParams,
    }) //ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
      .then((user) => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Listing 20.9 (p. 298)
   * delete 액션의 추가
   */
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
};
