$(function(){
    function buildHTML(message){
      // 「もしメッセージに画像が含まれていたら」という条件式
      if (message.image) {
        //メッセージに画像が含まれる場合のHTMLを作る
        var html =
        `<div class="main_chat__message-list__main-box__current-box">
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
        `<div class="main_chat__message-list__main-box__current-box">
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
    // console.log("OK")
    var formData = new FormData(this);
    var url = $(this).attr("action");
    $.ajax({
      url: url,
      type: "post",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false
    })

    .done(function(data){
      var html = buildHTML(data);
      $(".main_chat__message-list__main-box").append(html);
      $("form")[0].reset();
      $(".main_chat__message-list").animate({ scrollTop: $(".main_chat__message-list")[0].scrollHeight}, 'fast');
    })

    .fail(function(data){
      alert("エラーが発生したためメッセージは送信できませんでした。");
    })

    .always(function(data){
      $(".main_chat__message-form__main-box__send-btn").prop("disabled", false);
    })

  });
});