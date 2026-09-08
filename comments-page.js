/**
 * 评论区页面逻辑：入口跳转、hash 路由显示/隐藏、组件按需初始化
 * 路由约定：#/comments 打开评论区，清空 hash 返回首页
 */
(function () {
  var commentsPageInited = false;

  function showCommentsPage() {
    var home = document.getElementById('homePage');
    var game = document.getElementById('gamePage');
    var page = document.getElementById('commentsPage');
    if (home) home.style.display = 'none';
    if (game) game.style.display = 'none';
    if (!page) return;
    page.style.display = 'block';
    page.scrollTop = 0; // 评论页是内部滚动容器

    // 首次显示时初始化点赞与评论组件
    if (!commentsPageInited) {
      commentsPageInited = true;
      if (window.LikesModule && typeof window.LikesModule.initLikeButtons === 'function') {
        window.LikesModule.initLikeButtons();
      }
      if (window.CommentsModule && typeof window.CommentsModule.initComments === 'function') {
        window.CommentsModule.initComments();
      }
    }
  }

  function hideCommentsPage() {
    var page = document.getElementById('commentsPage');
    if (page) page.style.display = 'none';
  }

  // 入口点击：首页底部「评论区」
  var entry = document.getElementById('commentsEntry');
  if (entry) {
    entry.addEventListener('click', function () {
      if (window.location.hash === '#/comments') {
        showCommentsPage();
      } else {
        window.location.hash = '#/comments';
      }
    });
  }

  // 返回首页：直接移除 URL 中的 hash，地址栏不残留 #/（pushState 不触发 hashchange，手动调用路由）
  var back = document.getElementById('commentsBackBtn');
  if (back) {
    back.addEventListener('click', function () {
      history.pushState(null, '', window.location.pathname + window.location.search);
      if (window._suRouteByHash) { window._suRouteByHash(); }
    });
  }

  // 赞赏弹窗：点击遮罩空白或「知道了」关闭
  var donateLink = document.getElementById('donateLink');
  var donateModal = document.getElementById('donateModal');
  var donateCloseBtn = document.getElementById('donateCloseBtn');

  function openDonateModal() {
    if (donateModal) donateModal.hidden = false;
  }

  function closeDonateModal() {
    if (donateModal) donateModal.hidden = true;
  }

  if (donateLink) donateLink.addEventListener('click', openDonateModal);
  if (donateCloseBtn) donateCloseBtn.addEventListener('click', closeDonateModal);
  if (donateModal) {
    donateModal.addEventListener('click', function (event) {
      if (event.target === donateModal) closeDonateModal();
    });
  }

  // 赞赏码点击放大：全屏查看，点击任意处关闭
  var donateQrImg = document.getElementById('donateQrImg');
  var donateQrViewer = document.getElementById('donateQrViewer');
  if (donateQrImg && donateQrViewer) {
    donateQrImg.addEventListener('click', function () {
      donateQrViewer.hidden = false;
    });
    donateQrViewer.addEventListener('click', function () {
      donateQrViewer.hidden = true;
    });
  }

  // 暴露给 index.html 的 hash 路由
  window._suShowCommentsPage = showCommentsPage;
  window._suHideCommentsPage = hideCommentsPage;
})();
