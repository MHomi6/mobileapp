"use strict";

window.addEventListener("DOMContentLoaded", function () {
  if (typeof localStorage === "undefined") {
    Swal.fire({
      icon: "error",
      title: "エラー",
      text: "このブラウザはLocal Storage機能が実装されていません"
    });
    return;
  } else {
    viewStorage();
    saveLocalStorage();
    delLocalStorage();
    allClearLocalStorage();
    selectTable();
  }
});

function saveLocalStorage() {
  const save = document.getElementById("save");
  save.addEventListener("click", function (e) {
    e.preventDefault();
    const key = document.getElementById("textKey").value;
    const value = document.getElementById("textMemo").value;

    if (key === "" || value === "") {
      Swal.fire({
        icon: "warning",
        title: "入力エラー",
        text: "key, Memoはいずれも必須です。"
      });
      return;
    }

    Swal.fire({
      title: "保存確認",
      text: `LocalStorageに「${key} ${value}」を保存しますか？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "保存",
      cancelButtonText: "キャンセル"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem(key, value);
        viewStorage();

        Swal.fire({
          icon: "success",
          title: "保存完了",
          text: `LocalStorageに「${key} ${value}」を保存しました。`
        });

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });
  });
}

function delLocalStorage() {
  const del = document.getElementById("del");
  del.addEventListener("click", function (e) {
    e.preventDefault();
    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("table1");

    let w_cnt = selectCheckBox(null);

    if (w_cnt < 1) {
      Swal.fire({
        icon: "info",
        title: "選択エラー",
        text: "1つ以上選択してください。"
      });
      return;
    }

    Swal.fire({
      title: "削除確認",
      text: `LocalStorageから${w_cnt}件のデータを削除しますか？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "削除",
      cancelButtonText: "キャンセル"
    }).then((result) => {
      if (result.isConfirmed) {
        for (let i = 0; i < chkbox1.length; i++) {
          if (chkbox1[i].checked) {
            localStorage.removeItem(
              table1.rows[i + 1].cells[1].firstChild.data
            );
          }
        }
        viewStorage();

        Swal.fire({
          icon: "success",
          title: "削除完了",
          text: `${w_cnt}件のデータを削除しました。`
        });

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });
  });
}

function allClearLocalStorage() {
  const allClear = document.getElementById("allClear");
  allClear.addEventListener("click", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "全削除確認",
      text: "LocalStorageのデータを全て削除します。よろしいですか？",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "全削除",
      cancelButtonText: "キャンセル"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        viewStorage();

        Swal.fire({
          icon: "success",
          title: "全削除完了",
          text: "LocalStorageのデータを全て削除しました。"
        });

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });
  });
}

function selectTable() {
  const select = document.getElementById("select");
  select.addEventListener("click", function (e) {
    e.preventDefault();

    let selectedCount = selectCheckBox("select");

    if (selectedCount !== 1) {
      Swal.fire({
        icon: "info",
        title: "選択エラー",
        text: "1つ選択してください。"
      });
    }
  });
}

function selectCheckBox(mode) {
  let w_cnt = 0;
  const chkbox1 = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");
  let w_textKey = "";
  let w_textMemo = "";

  for (let i = 0; i < chkbox1.length; i++) {
    if (chkbox1[i].checked) {
      if (w_cnt === 0) {
        w_textKey = table1.rows[i + 1].cells[1].firstChild.data;
        w_textMemo = table1.rows[i + 1].cells[2].firstChild.data;
      }
      w_cnt++;
    }
  }

  if (mode === "select" && w_cnt === 1) {
    document.getElementById("textKey").value = w_textKey;
    document.getElementById("textMemo").value = w_textMemo;
  }

  return w_cnt;
}

function viewStorage() {
  const list = document.getElementById("list");

  while (list.rows[0]) list.deleteRow(0);

  for (let i = 0; i < localStorage.length; i++) {
    let w_key = localStorage.key(i);
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    list.appendChild(tr);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
    td2.innerHTML = w_key;
    td3.innerHTML = localStorage.getItem(w_key);
  }
if (window.jQuery && $.fn.tablesorter) {
    $("#table1").tablesorter({
      sortList: [[1, 0]]
    });
    $("#table1").trigger("update");
  }
}