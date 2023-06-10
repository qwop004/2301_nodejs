// seedSubscribers.js
"use strict";

/**
 * Listing 15.9 (p. 224)
 */
const mongoose = require("mongoose"),
  Subscriber = require("../models/Subscriber");

// 데이터베이스 연결 설정
mongoose.connect("mongodb://127.0.0.1:27017/taemin_final", {
  useNewUrlParser: true,
});

mongoose.connection;

var subscribers = [
  {
    name: "Yoo Jae-suk",
    email: "yjs@running.com",
    phoneNumber: "",
    newsletter: true,
    profileImg:
      "https://newsimg-hams.hankookilbo.com/2022/01/21/f96adb47-e8b1-43fe-aa16-f2043012cbec.jpg",
  },
  {
    name: "Haha",
    email: "hhh@running.com",
    phoneNumber: "010-????-????",
    newsletter: true,
    profileImg:
      "https://image.ytn.co.kr/general/jpg/2020/0719/202007191609185642_t.jpg",
  },
  {
    name: "Jee Seok-jin",
    email: "bignose@running.com",
    phoneNumber: "010-1234-5678",
    newsletter: true,
    profileImg:
      "https://cdnimg.melon.co.kr/cm/artistcrop/images/000/11/114/11114_500.jpg/melon/optimize/90",
  },
  {
    name: "Kim Jong-kook",
    email: "gymjk@running.com",
    phoneNumber: "010-7777-7777",
    newsletter: true,
    profileImg:
      "https://newsimg.hankookilbo.com/cms/articlerelease/2021/06/17/b8223d84-e72f-42a3-a984-0ae23ba70aa4.jpg",
  },
  {
    name: "Song Ji-hyo",
    email: "mungjh@running.com",
    phoneNumber: "",
    newsletter: true,
    profileImg:
      "https://image.ajunews.com//content/image/2021/08/18/20210818194549250993.jpg",
  },
  {
    name: "Jeon So-min",
    email: "jsm@running.com",
    phoneNumber: "010-8282-8282",
    newsletter: true,
    profileImg:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/2017_%EC%95%84%EC%8B%9C%EC%95%84_%EB%AA%A8%EB%8D%B8_%ED%8E%98%EC%8A%A4%ED%8B%B0%EB%B2%8C_%EB%A0%88%EB%93%9C%EC%B9%B4%ED%8E%AB_%2869%29.jpg/220px-2017_%EC%95%84%EC%8B%9C%EC%95%84_%EB%AA%A8%EB%8D%B8_%ED%8E%98%EC%8A%A4%ED%8B%B0%EB%B2%8C_%EB%A0%88%EB%93%9C%EC%B9%B4%ED%8E%AB_%2869%29.jpg",
  },
  {
    name: "Yang Se-chan",
    email: "ysc@running.com",
    phoneNumber: "010-8822-8822",
    newsletter: true,
    profileImg: "https://newsimg.sedaily.com/2022/12/29/26F3BXBTST_1.jpg",
  },
  {
    name: "Lizzy",
    email: "lizzy@running.com",
    phoneNumber: "010-7272-7272",
    newsletter: false,
    profileImg:
      "https://awsimages.detik.net.id/community/media/visual/2021/05/20/lizzy-eks-after-school_43.jpeg?w=700&q=90",
  },
  {
    name: "Song Joong-ki",
    email: "sjk@running.com",
    phoneNumber: "010-9876-5432",
    newsletter: false,
    profileImg:
      "https://thumb.mt.co.kr/06/2021/07/2021070211313272533_1.jpg/dims/optimize/",
  },
  {
    name: "Gary",
    email: "gary@running.com",
    phoneNumber: "",
    newsletter: false,
    profileImg:
      "https://static.wikia.nocookie.net/murderseries/images/4/40/Gary.png",
  },
  {
    name: "Lee Kwang-soo",
    email: "girin@running.com",
    phoneNumber: "010-7777-9999",
    newsletter: false,
    profileImg:
      "https://img.marieclairekorea.com/2021/04/mck_60877b6a4880b.jpg",
  },
];

var commands = [];

Subscriber.deleteMany({})
  .exec()
  .then((result) => {
    console.log(`Deleted ${result.deletedCount} subscriber records!`);
  });

setTimeout(() => {
  // 프라미스 생성을 위한 구독자 객체 루프
  subscribers.forEach((s) => {
    commands.push(
      Subscriber.create({
        name: s.name,
        email: s.email,
        phoneNumber: s.phoneNumber,
        newsletter: s.newsletter,
        profileImg: s.profileImg,
      }).then((subscriber) => {
        console.log(`Created subscriber: ${subscriber.name}`);
      })
    );
  });

  console.log(`${commands.length} commands created!`);

  Promise.all(commands)
    .then((r) => {
      console.log(JSON.stringify(r));
      mongoose.connection.close();
      console.log("Connection closed!");
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
}, 500);