/*global $ */

class ConfusionMartixCalculator {
    constructor() {
        this.getOption();
    }

    // 小数点以下第1位で四捨五入
    toPrecision1(num) {
        return Math.round(num * 10.0) / 10;
    }

    // 混同行列を計算
    calc() {
        // フォームから値を取得
        // 検査対象の総人数
        const total = parseInt($("#total").val());
        // 検査対象中の感染者数の予想
        const infected = parseInt($("#infected").val());

        // 混同行列を計算
        const truePositive = infected * this.sensitivity / 100.0;
        const falseNegative = infected * (100.0 - this.sensitivity) / 100.0;
        const falsePositive = (total - infected) * (100.0 - this.specificity) / 100.0;
        const trueNegative = (total - infected) * this.specificity / 100.0;

        // 適合度を計算
        const precision = truePositive / (truePositive + falsePositive);

        // 混同行列の反映
        $("#true-positive").html(this.toPrecision1(truePositive));
        $("#false-negative").html(this.toPrecision1(falseNegative));
        $("#false-positive").html(this.toPrecision1(falsePositive));
        $("#true-negative").html(this.toPrecision1(trueNegative));

        // 適合率の反映
        $("#precision").html(this.toPrecision1(precision * 100));
    }

    // オプションを取得
    getOption() {
        // 検査の感度(罹っている人を検査した場合、陽性になる確率(%))
        this.sensitivity = parseFloat($("#sensitivity").val());
        // 検査の特異度(罹っていない人を検査した場合、陰性になる確率(%))
        this.specificity = parseFloat($("#specificity").val());
    }

    // オプションを書き戻す
    restoreOption() {
        // 検査の感度(罹っている人を検査した場合、陽性になる確率(%))
        $("#sensitivity").val(this.sensitivity);
        // 検査の特異度(罹っていない人を検査した場合、陰性になる確率(%))
        $("#specificity").val(this.specificity);
    }
}

// メイン関数
$(document).ready(function () {
    const confusionMatrixCalculator = new ConfusionMartixCalculator();
    // 計算を実行
    confusionMatrixCalculator.calc();

    // 再計算をクリックすると計算を実行
    $("#recalc").on("click", function (event) {
        // フォームを送信する挙動を止める
        event.preventDefault();
        // 混同行列を計算する
        confusionMatrixCalculator.calc();
    });

    // モーダルを開いたとき、オプションの値を取得しておく
    $('#optionModal').on('show.bs.modal', function () {
        confusionMatrixCalculator.getOption();
    });

    // モーダルを閉じたとき、オプションの値を復元
    $('#optionModal').on('hide.bs.modal', function () {
        confusionMatrixCalculator.restoreOption();
    });

    // モーダルで適用をクリックすると計算を実行
    $("#apply-option").on("click", function () {
        // フォームを送信する挙動を止める
        event.preventDefault();
        // オプションの値を取得する
        confusionMatrixCalculator.getOption();
        // 混同行列を計算する
        confusionMatrixCalculator.calc();
        // モーダルを明示的に閉じる
        $("#optionModal").modal("hide");
    });
});
