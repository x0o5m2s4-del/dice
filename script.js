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



async function rollDice() {

  const dice1 =
    Math.floor(Math.random() * 6) + 1;

  const dice2 =
    Math.floor(Math.random() * 6) + 1;

  const dice3 =
    Math.floor(Math.random() * 6) + 1;



  document.getElementById("dice1")
    .textContent = dice1;

  document.getElementById("dice2")
    .textContent = dice2;

  document.getElementById("dice3")
    .textContent = dice3;



  const sum =
    dice1 + dice2 + dice3;



  let score = 0;

  let message = "";



  // 합 10 초과
  if (sum > 10) {

    score += 3;

    message += "합 10 초과 +3점! ";
  }



  // 세 숫자 동일
  if (
    dice1 === dice2 &&
    dice2 === dice3
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

    dice1: dice1,

    dice2: dice2,

    dice3: dice3,

    sum: sum,

    score: score,

    time: new Date()

  });



  // 한 번만 가능
  document.getElementById("roll-btn")
    .style.display = "none";

}
