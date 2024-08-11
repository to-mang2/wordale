//const 정답 = "HONEY";

let index = 0;
let attempts = 0;
let timer;

function appStart() {
  //게임 종료 메시지
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:34vh; left:37vw; background-color:white; width:200px; height:100px;";
    document.body.appendChild(div);
  };

  //다음 줄로 넘기는 방법 , WORDLE 게임은 6줄까지만 있기 때문에 attempts가 6(즉, 7번째 줄)이 되면 아무 값도 반환하지 않는다. (아무 일도 일어나지 않음)
  const nextLine = () => {
    if (attempts === 6) return;
    attempts += 1;
    index = 0;
  };

  //키보드 모양 화면에도 정답 글자 및 색상 표시하기
  const keyBoard = (key, color) => {
    const keyElement = document.querySelector(
      `.keyboard-block[data-key='${key}']`
    );
    if (keyElement) {
      keyElement.style.backgroundColor = color;
    }
  };

  //비교용 <내 눈에는 위에랑 똑같은데 이상하게 위 코드는 잘 되고 이거는 잘 안됨
  // const keyBoard = (key, color) => {
  //   const keyElement = document.querySelector(
  //     `.keyboard-block[data-key='${key}']`
  //   );
  //   if (keyElement) {
  //     keyElement.style.backgroundColor = color;
  //   }
  // };

  //게임 종료 시, 종료 메시지 나오게 하기+타이머 종료
  const gameover = () => {
    window.removeEventListener("keydown", handleKeyDown);
    displayGameover();
    clearInterval(timer);
  };
  // 엔터키 함수 만들기 (글자가 5글자 채워졌을때만 발동되어야 한다. 또한 정답도 확인해야 함.)
  const handleEnterkey = async () => {
    let 맞은_갯수 = 0;

    //서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );

      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];

      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6aaa64";
        keyBoard(입력한_글자, "#6aaa64");
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#c9b458";
        keyBoard(입력한_글자, "#c9b458");
      } else {
        block.style.background = "#787c7e";
        keyBoard(입력한_글자, "black");
      } //틀린 글자는 블랙으로 표시
      block.style.color = "white";
    }

    //입력한_글자와 정답_글자가 일치하면 맞은_갯수 5개, 따라 게임 종료 / 아니라면 다음 줄로
    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  //backspace 함수 설정하기
  const handleBackspace = () => {
    if (index > 0) {
      //인덱스가 0일 때도 적용되면 -1이라는 오류 발생하므로, 0보다 클 때
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      ); //backspace 키를 누르면 preBlock이 활성화되는데 그 내용은 data-index에서 인덱스 넘버를 하나씩 줄이고
      preBlock.innerText = ""; //그 안의 내용은 공백으로 한다.
    }
    if (index !== 0) index -= 1; //0 이 아니면 -1 한다.
  };

  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase(); //대문자 만들어주는 함수;
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace")
      handleBackspace(); //key값이 Backspace면 backspace 함수 발동.
    //만약 인덱스가 5일 때 Enter키를 누르면 handleEnterkey를 호출 아니면 리턴
    else if (index === 5) {
      if (event.key === "Enter") handleEnterkey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index++; //만약 키코드가 65이상 90미만이라면 (A~Z를 의미) thisBlock의 안 텍스트는 key, 인덱스 하나씩 추가 => 옆 칸으로 하나씩 채워진다는 뜻
    }
    //같은 표현이라고 볼 수 있음.
    //index = index + 1;
    //index += 1;
    //index++;
  };

  const starttimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  starttimer();
  window.addEventListener("keydown", handleKeyDown);
}

// document.getElementById("keyboard-cont").addEventListener("click", (e) => {
//   const target = e.target;

//   if (!target.classList.contains("keyboard-block")) {
//     return;
//   }
//   let key = target.textContent;

//   if (key === "<img src='delete.svg'>") {
//     key = "Backspace";
//   }

//   document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
// }); 이거 해결해야 함

appStart();
