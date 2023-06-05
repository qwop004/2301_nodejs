// controllers/usersController.js
"use strict";

/**
 * Listing 18.11 (p. 271)
 * userController.js에서 인덱스 액션 생성과 index 액션의 재방문
 */
const User = require("../models/User"); // 사용자 모델 요청

/**
 * [노트] getUserParams는 이전 캡스톤 프로젝트 (21장)에서 사용돼 왔다. 이 함수는 컨트롤러를 통해
 * 재사용돼 사용자 속성을 하나의 객체로 구성한다. 동일한 함수를 다른 모델 컨트롤러에도 구성해야 한다.
 */
const getUserParams = (body) => {
  return {
    name: {
      first: body.first,
      last: body.last,
    },
    email: body.email,
    username: body.username,
    password: body.password,
    profileImg: body.profileImg,
  };
};

module.exports = {
  /**
   * @TODO: login 액션
   *
   * Listing 23.3 (p. 336)
   * userController.js로의 로그인과 인증 액션 추가
   */
  login: (req, res) => {
    res.render("users/login", {
      page: "login",
      title: "Login"
    });
  },

  /**
   * @TODO: authenticate 액션
   */

  auth: (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if(user) {
          user
            .passwordComparision(req.body.password)
            .then(passwordsMatch =>{
              if(passwordmatch){
                res.locals.redirect = `/users/${user._id}`;
                res.flash(
                  "success",
                  `${user.fullName} logged in!`
                );
                res.locals.user = user;
              } else {
                req.flash(
                  "error",
                  "Wrong Password."
                );
                res.locals.user = "/users/login";
              }
              next();
            });
        }
      })
      .catch(error => {
        console.log(`Error: ${error}`);
        next(error);
      })
  },

  index: (req, res, next) => {
    console.log("index실행");
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
    console.log("indexView실행");
    res.render("users/index", {
      page: "users",
      title: "All Users",
      // flashMessages: {
      //   // Listing 22.6 (p. 331) - 렌더링된 인덱스 뷰에서 플래시 메시지를 추가
      //   success: "Loaded all users!",
      // },
    }); // 분리된 액션으로 뷰 렌더링
  },

  /**
   * 노트: 구독자 컨트롤러에서 index 액션이 getAllSubscribers를 대체한다. main.js에서 액션 관련
   * 라우트 index를 가리키도록 수정하고 subscribers.ejs를 index.ejs로 변경된 점을 기억하자. 이
   * 뷰는 views 폴더 아래 subscribers 폴더에 있어야 한다.
   */

  /**
   * Listing 19.2 (p. 278)
   * userController.js에 액션 생성 추가
   */
  // 폼의 렌더링을 위한 새로운 액션 추가
  new: (req, res) => {
    console.log("new실행");
    res.render("users/new", {
      page: "new-user",
      title: "New User",
    });
  },

  /**
   * Listing 22.3 (p. 328)
   * userController.js에서 create액션이 플래시 메시지를 추가
   *
   * [노트] 플래시 메시지를 임시로 저장하기 위해 요청 객체를 사용했지만, 응답에서의 로컬 변수와 이
   * 메시지들을 연결했기 때문에 메시지들은 결국 응답 객체로 연결된다.
   */
  create: (req, res, next) => {
    let userParams = getUserParams(req.body); // Listing 22.3 (p. 328)
    // 폼 파라미터로 사용자 생성
    User.create(userParams)
      .then((user) => {
        req.flash(
          "success",
          `${user.fullName}'s account created successfully!`
        ); // Listing 22.3 (p. 328)
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        res.locals.redirect = "/users/new";
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        ); // Listing 22.3 (p. 328)
        next(error);
      });
  },

  /**
   * @TODO: validate 액션
   *
   * Listing 23.7 (p. 346)
   * userController.js에서 validate 액션 추가
   */
validate: (req, res, next) => {
  //   req
  //     .sanitizeBody("email")
  //     .nomalizeEmail({ 
  //       all_lowercase: true,
  //     })
  //     .trim();
// req.check("email", "Email is invalid").isEmail();
  //   req.check("password", "Password cannot be empty").notEmpty();

  //   req.getValidationResult()
  //   .then(error => {
  //     if (! error.isEmpty() ) {
  //       let msg = error.aray().map(e => e.msg);
  //       req.skip = true; // auth 건너뛰기
  //       req.flash(
  //         "error",
  //         msg.join(" and ") // 에러 전부 묶어서 보여주기
  //         );
  //         res.locals.redirect = "/users/new";
  //         next();
  //       } else {
  //         next();
  //       }
  //     });
},
  /**
   * [노트] 폼 데이터를 다시 채우기 위해 다양한 방법을 선택할 수 있다. (연구해보면)
   * 어떤 패키지가 효과적인지 알게 될 것이다. 자신에게 가장 적합한 방법을 찾으면
   * 데이터를 다시 처리하도록 애플리케이션의 모든 폼을 변경하라.
   */

  // 분리된 redirectView 액션에서 뷰 렌더링
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  /**
   * 노트: 구독자 컨트롤러에 new와 create 액션을 추가하는 것은 새로운 CRUD 액션을 맞춰
   * getAllSubscribers와 saveSubscriber 액션을 삭제할 수 있다는 의미다. 게다가 홈
   * 컨트롤러에서 할 것은 홈페이지인 index.ejs 제공밖에 없다.
   */

  /**
   * Listing 19.7 (p. 285)
   * userController.js에서 특정 사용자에 대한 show 액션 추가
   */
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
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last,
        },
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        profileImg: req.body.profileImg,
      }; // 요청으로부터 사용자 파라미터 취득

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
