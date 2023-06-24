const express = require("express");
const fs = require("fs");
const cors = require("cors");
const fetch = require("node-fetch").default;
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

// 정적 파일을 호스팅하기 위한 미들웨어 등록
app.use(express.static("public"));
app.use(cors());
app.use(cookieParser());

// 루트 URL에 대한 GET 요청에 응답하는 라우트 정의
app.get("/", (req, res) => {
  fs.readFile("index.html", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

// 프록시 서버 구현
app.get("/host", async (req, res) => {
  try {
    const response = await fetch(req.query.url); // 절대 URL로 요청 보내기
    const dateHeaderValue = response.headers.get("date");
    res.send(dateHeaderValue); // 클라이언트에게 응답 데이터 전달
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
});

app.get("/iframe", async (req, res) => {
  try {
    const { session_cookie } = req.cookies;

    // 인터파크에 요청을 보낼 때 세션 쿠키를 전달
    const response = await fetch(req.query.url, {
      headers: {
        Cookie: `session_cookie=${session_cookie}`,
      },
    });

    if (response.ok) {
      // 인터파크로부터 받은 응답을 텍스트로 변환하여 클라이언트에 전달
      const data = await response.text();
      res.send(data);
    } else {
      throw new Error("Request failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// POST 요청의 본문을 해석하기 위한 미들웨어 등록
app.use(express.urlencoded({ extended: true }));

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
