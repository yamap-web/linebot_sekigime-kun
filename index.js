const https = require("https");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/webhook", (req, res) => {
  res.send("HTTP POST request sent to the webhook URL!");
  // ユーザーがボットにメッセージを送った場合、応答メッセージを送る
  if (req.body.events[0].type === "message") {
    const userMessage = req.body.events[0].message.text;
    let replyMessages;

    if (userMessage === "hey せきぎめくん") {
      const names = [
        "こうせい",
        "げんき",
        "さち",
        "りおな",
        "なな",
        "やまぴー",
        "はな",
        "しゅうへい",
        "りょうま",
        "まさき",
        "だいき",
        "そう",
      ];

      // 名前の配列をランダムに並び替える
      const shuffledNames = names.sort(() => 0.5 - Math.random());
      const numberedNames = shuffledNames.map(
        (name, index) => `${index + 1}: ${name}`
      );

      replyMessages = [
        {
          type: "text",
          text: numberedNames.join("\n"),
        },
      ];

      // APIサーバーに送信する応答トークンとメッセージデータを文字列化する
      const dataString = JSON.stringify({
        // 応答トークンを定義
        replyToken: req.body.events[0].replyToken,
        // 返信するメッセージを定義
        messages: replyMessages,
      });

      // リクエストヘッダー。仕様についてはMessaging APIリファレンスを参照してください。
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      };

      // Node.jsドキュメントのhttps.requestメソッドで定義されている仕様に従ったオプションを指定します。
      const webhookOptions = {
        hostname: "api.line.me",
        path: "/v2/bot/message/reply",
        method: "POST",
        headers: headers,
      };

      // messageタイプのHTTP POSTリクエストが/webhookエンドポイントに送信された場合、
      // 変数webhookOptionsで定義したhttps://api.line.me/v2/bot/message/replyに対して
      // HTTP POSTリクエストを送信します。

      // リクエストの定義
      const request = https.request(webhookOptions, (res) => {
        res.on("data", (d) => {
          process.stdout.write(d);
        });
      });

      // エラーをハンドリング
      // request.onは、APIサーバーへのリクエスト送信時に
      // エラーが発生した場合にコールバックされる関数です。
      request.on("error", (err) => {
        console.error(err);
      });

      // 最後に、定義したリクエストを送信
      request.write(dataString);
      request.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});
