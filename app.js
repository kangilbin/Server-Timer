const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// 정적 파일을 호스팅하기 위한 미들웨어 등록
app.use(express.static("public"));

// 루트 URL에 대한 GET 요청에 응답하는 라우트 정의
app.get("/", (req, res) => {
  fs.readFile("index.html", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

// POST 요청의 본문을 해석하기 위한 미들웨어 등록
app.use(express.urlencoded({ extended: true }));

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
