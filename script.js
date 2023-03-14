$(function () {
    // 400までの素数の配列を定義
    var primeArray = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397];
    // 過去の数値を格納する配列を初期化
    var historyArray = [];
    // 開始時間、待ち時間、最大待ち時間を初期化
    var startTime = 0;
    var delay = 10;
    var maxDelay = 1000;

    // CSVファイルのパスを指定
    const csvPath = 'test.csv';
    // XMLHttpRequestオブジェクトを生成
    const xhr = new XMLHttpRequest();
    // CSVファイルを非同期で読み込む
    xhr.open('GET', csvPath, true);
    // レスポンスタイプをCSVに設定
    xhr.responseType = 'text';
    // 読み込み完了時の処理
    xhr.onload = () => {
        // レスポンステキストを取得
        const csvText = xhr.response;
        // 改行コードで分割して配列にする
        const lines = csvText.split('\n');
        // カンマで分割して各列を配列に格納するための空の配列を用意
        const columns = [];
        for (let i = 0; i < lines[0].split(',').length; i++) {
            columns.push([]);
        }
        // 各行の各列の値を配列に格納
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            for (let j = 0; j < values.length; j++) {
                columns[j].push(values[j]);
            }
        }
        // 結果を代入
        primeArray = columns[0];
    };

    // 読み込み開始
    xhr.send();


    // 回すボタンをクリックしたときの処理
    $("#button1").click(function () {
        // ボタンを無効にする
        $("#button1").addClass("disabled");
        // 初期化処理を実行
        init();
        // ドラムロールを再生する
        $("#play-button").get(0).play();
        // 開始時間を取得する
        startTime = $.now();
        // 抽選システムを起動する
        substitute(primeArray, startTime);
    });

    // ソートボタンをクリックしたときの処理
    $(".sort").on("click", function () {
        // ソートボタンにcheckedクラスをトグルする
        $(".sort").toggleClass("checked");
        // ソートがトグルされていない場合
        if (!$('input[name="check"]').prop("checked")) {
            // ソートがトグルされている状態にする
            $(".sort input").prop("checked", true);
            // 過去の数値をソートして、テキスト要素に表示する
            var historyArraySorted = (Array.from(historyArray)).sort(function (a, b) {
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            });
            $("#history").text(historyArraySorted.join(" - "));
        } else {
            // ソートがトグルされている場合は、ソートを解除して、履歴順に数値をテキスト要素に表示する
            $(".sort input").prop("checked", false);
            $("#history").text(historyArray.join(" - "));
        }
    });

    function init() {
        // 初期化
        if ($('input[name="check"]').prop("checked")) {
            // ソートがトグルされている場合は昇順表示を解除
            $(".sort").toggleClass("checked");
            $(".sort input").prop("checked", false);
            $("#history").text(historyArray.join(" - "));
        }
        startTime = 0;
        delay = 0;
    }

    function shuffle([...array]) {
        // 配列をシャッフルする関数
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function substitute([...array], startTime) {
        // 配列をdelayごとにシャッフルして先頭要素を表示する
        primeArray = shuffle(array);
        var newText = primeArray[0];
        $("#string").text(newText);

        if ($.now() - startTime > 1950) {
            // シャッフル終了(1950は音源との調整)
            setTimeout(function () {
                // 音源が終わるまでは押せなくしておく
                $("#button1").removeClass("disabled");
            }, 5270 - 1950)
            // 履歴に追加
            addHistory(primeArray[0])
            // 履歴が増えてきたらフォントを小さくする
            if (historyArray.length > 30) {
                $("h3").css("font-size", "20pt")
            }
            $("#history").text(historyArray.join(" - "));
            return;

        } else {
            // シャッフル中
            delay += ($.now() - startTime) / 400;
            delay = Math.min(delay, maxDelay)
            setTimeout(function () {
                substitute(array, startTime);
            }, delay);
        }
    }

    // ヒストリーを更新する処理
    function addHistory(number) {
        console.log(number)
        primeArray.shift();
        historyArray.push(number);
        console.log(primeArray);
        console.log(historyArray);
    }
});