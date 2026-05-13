const firebaseConfig = {

  apiKey: "AIzaSyD2ZvVaN_ZWrTKvQdWGpdLyt0jb1FHnVp4",

  authDomain: "cardgame-ed26e.firebaseapp.com",

  projectId: "cardgame-ed26e",

  storageBucket: "cardgame-ed26e.firebasestorage.app",

  messagingSenderId: "830034089374",

  appId: "1:830034089374:web:7c00cf947426a813f8b28f"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();



async function startGame() {

  const name =
    document.getElementById("name").value.trim();

  const studentId =
    document.getElementById("studentId").value.trim();



  if (!name || !studentId) {

    alert("이름과 학번을 입력해줘!");

    return;

  }



  // 중복 참여 검사
  const snapshot =
    await db.collection("diceGame")

    .where(
      "studentId",
      "==",
      studentId
    )

    .get();



  if (!snapshot.empty) {

    alert("이미 참여한 학생이야!");

    return;

  }



  document.getElementById("start-screen")
    .style.display = "none";



  document.getElementById("game-screen")
    .style.display = "block";

}



function getDiceEmoji(number) {

  const diceEmojis = {

    1: "⚀",

    2: "⚁",

    3: "⚂",

    4: "⚃",

    5: "⚄",

    6: "⚅"

  };



  return diceEmojis[number];

}



async function rollDice() {

  const dice1 =
    document.getElementById("dice1");

  const dice2 =
    document.getElementById("dice2");

  const dice3 =
    document.getElementById("dice3");



  // 흔들리는 효과
  dice1.classList.add("rolling");

  dice2.classList.add("rolling");

  dice3.classList.add("rolling");



  // 굴리는 애니메이션
  let rolling = setInterval(() => {

    dice1.textContent =
      getDiceEmoji(
        Math.floor(Math.random() * 6) + 1
      );

    dice2.textContent =
      getDiceEmoji(
        Math.floor(Math.random() * 6) + 1
      );

    dice3.textContent =
      getDiceEmoji(
        Math.floor(Math.random() * 6) + 1
      );

  }, 100);



  // 2초 뒤 결과 결정
  setTimeout(async () => {

    clearInterval(rolling);



    dice1.classList.remove("rolling");

    dice2.classList.remove("rolling");

    dice3.classList.remove("rolling");



    const num1 =
      Math.floor(Math.random() * 6) + 1;

    const num2 =
      Math.floor(Math.random() * 6) + 1;

    const num3 =
      Math.floor(Math.random() * 6) + 1;



    dice1.textContent =
      getDiceEmoji(num1);

    dice2.textContent =
      getDiceEmoji(num2);

    dice3.textContent =
      getDiceEmoji(num3);



    const sum =
      num1 + num2 + num3;



    let score = 0;

    let message = "";



    // 합 10 초과
    if (sum > 10) {

      score += 3;

      message += "합 10 초과 +3점! ";
    }



    // 트리플
    if (
      num1 === num2 &&
      num2 === num3
    ) {

      score += 5;

      message += "트리플 +5점! ";
    }



    if (score === 0) {

      message = "0점 😢";

    } else {

      message += `총 ${score}점 🎉`;

    }



    document.getElementById("result-text")
      .textContent = message;



    const name =
      document.getElementById("name").value;

    const studentId =
      document.getElementById("studentId").value;



    // Firebase 저장
    await db.collection("diceGame").add({

      name: name,

      studentId: studentId,

      dice1: num1,

      dice2: num2,

      dice3: num3,

      sum: sum,

      score: score,

      time: new Date()

    });



    // 한 번만 가능
    document.getElementById("roll-btn")
      .style.display = "none";

  }, 2000);

}
