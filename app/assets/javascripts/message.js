$(function(){

  function buildHTML(message){
    // 「もしメッセージに画像が含まれていたら」という条件式
    if (message.image) {
      //メッセージに画像が含まれる場合のHTMLを作る
      var html =
      `<div class="main_chat__message-list__main-box__current-box" data-message-id="${message.id}">
        <div class="main_chat__message-list__main-box__current-box__upper-info">
          <div class="main_chat__message-list__main-box__current-box__upper-info__talker">
            ${message.user_name}
          </div>
          <div class="main_chat__message-list__main-box__current-box__upper-info__date">
            ${message.created_at}
          </div>
        </div>
        <div class="main_chat__message-list__main-box__current-box__text">
          <p class="main_chat__message-list__main-box__current-box__text__content">
            ${message.content}
          </p>
        </div>
        <img src=${message.image} >
      </div>`
      return html;
    } else {
      //メッセージに画像が含まれない場合のHTMLを作る
      var html =
      `<div class="main_chat__message-list__main-box__current-box" data-message-id="${message.id}">
        <div class="main_chat__message-list__main-box__current-box__upper-info">
          <div class="main_chat__message-list__main-box__current-box__upper-info__talker">
            ${message.user_name}
          </div>
          <div class="main_chat__message-list__main-box__current-box__upper-info__date">
            ${message.created_at}
          </div>
        </div>
        <div class="main_chat__message-list__main-box__current-box__text">
          <p class="main_chat__message-list__main-box__current-box__text__content">
            ${message.content}
          </p>
        </div>
      </div>`
      return html;
    };
  }

  $("#new_message").on("submit", function(e){
    e.preventDefault()
    var formData = new FormData(this);
    //form要素のaction属性の値を取得
    var url = $(this).attr("action");
    $.ajax({
      url: url,
      type: "post",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false
    })

    .done(function(message){
      var html = buildHTML(message);
      $(".main_chat__message-list__main-box").append(html);
      $("form")[0].reset();
      $(".main_chat__message-list").animate({ scrollTop: $(".main_chat__message-list")[0].scrollHeight}, 'fast');
    })

    .fail(function(){
      alert("エラーが発生したためメッセージは送信できませんでした。");
    })

    .always(function(){
      $(".main_chat__message-form__main-box__send-btn").prop("disabled", false);
    })

  });


  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.main_chat__message-list__main-box__current-box:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })

    .done(function(messages) {
      if (messages.length !== 0) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.main_chat__message-list__main-box').append(insertHTML);
        $(".main_chat__message-list").animate({ scrollTop: $(".main_chat__message-list")[0].scrollHeight});
      }
    })

    .fail(function() {
      alert('error');
    });
  };

  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }

});