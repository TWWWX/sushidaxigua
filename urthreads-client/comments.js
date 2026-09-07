/**
 * Client-side script for Comments feature
 *
 * Handles loading, displaying, and submitting comments with moderation.
 * Comments are moderated before appearing publicly.
 *
 * HTML Requirements (refer to examples for detailed structure):
 * - Container with `data-worker-comments` attribute
 * - Set data-page-id, data-page-url, data-page-title
 * - Comment list element with `data-comment-list`
 * - Comment form with `data-comment-draft-form`
 * - Identity form with `data-comment-identity-form`
 * - Modal dialog with `data-comment-modal`
 * - Status message element with `data-comment-status`
 *
 * Configuration:
 * Set window.COMMENTS_CONFIG before including this script:
 * window.COMMENTS_CONFIG = {
 *   endpoint: 'https://your-worker.workers.dev/comments',
 *   siteId: 'daxigua'
 * };
 */

(function() {
  // Configuration
  const config = {
    endpoint: window.COMMENTS_CONFIG?.endpoint || '',
    siteId: window.COMMENTS_CONFIG?.siteId || 'daxigua',
  };

  if (!config.endpoint) {
    console.warn('[Comments] No endpoint configured. Set window.COMMENTS_CONFIG.endpoint');
    return;
  }

  /**
   * Format date for display
   */
  function formatCommentDate(value) {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  /**
   * localStorage helpers: remember commenter identity so the nickname is
   * only asked once (editable later via the identity bar)
   */
  function getIdentityKey() {
    return `${config.endpoint}:comment-identity`;
  }

  function getSavedIdentity() {
    try {
      const raw = window.localStorage.getItem(getIdentityKey());
      if (!raw) return null;
      const data = JSON.parse(raw);
      const nickname = String(data?.nickname || '').trim();
      if (!nickname) return null;
      return {
        nickname,
        email: String(data?.email || '').trim(),
        website: String(data?.website || '').trim(),
      };
    } catch (error) {
      return null;
    }
  }

  function saveIdentity(identity) {
    try {
      window.localStorage.setItem(getIdentityKey(), JSON.stringify(identity));
    } catch (error) {
      // Identity persistence is best-effort; commenting still works without it
    }
  }

  /**
   * localStorage helpers: prevent repeat comment likes from the same browser
   */
  function getCommentLikedKey(commentId) {
    return `${config.endpoint}:comment-liked:${commentId}`;
  }

  function isCommentLiked(commentId) {
    try {
      return window.localStorage.getItem(getCommentLikedKey(commentId)) === 'true';
    } catch (error) {
      return false;
    }
  }

  function setCommentLiked(commentId) {
    try {
      window.localStorage.setItem(getCommentLikedKey(commentId), 'true');
    } catch (error) {
      // Likes still work without localStorage
    }
  }

  function removeCommentLiked(commentId) {
    try {
      window.localStorage.removeItem(getCommentLikedKey(commentId));
    } catch (error) {
      // Likes still work without localStorage
    }
  }

  /**
   * Create a comment element with reply and like actions
   */
  function makeComment(comment, onReply, onLike, depth = 0) {
    const item = document.createElement('article');
    item.className = 'comment-item';
    if (depth > 0) {
      item.classList.add('comment-reply');
      item.style.marginLeft = '1.5rem';
    }

    const meta = document.createElement('p');
    meta.className = 'comment-meta';
    const author = comment.authorName || '匿名';
    const createdAt = formatCommentDate(comment.createdAt);
    meta.textContent = createdAt ? `${author} · ${createdAt}` : author;

    const content = document.createElement('p');
    content.className = 'comment-body';
    content.textContent = comment.content || '';

    const actions = document.createElement('div');
    actions.className = 'comment-actions';

    const likeButton = document.createElement('button');
    likeButton.type = 'button';
    likeButton.className = 'comment-like-button';
    const commentLiked = isCommentLiked(comment.id);
    likeButton.textContent = `赞 (${comment.likesCount || 0})`;
    likeButton.classList.toggle('is-liked', commentLiked);
    // 已点赞的按钮保持可点击：再次点击 = 取消点赞（toggle 在 likeComment 内处理）
    likeButton.disabled = false;
    likeButton.addEventListener('click', () => {
      if (onLike) onLike(comment, likeButton);
    });

    const replyButton = document.createElement('button');
    replyButton.type = 'button';
    replyButton.className = 'comment-reply-button';
    replyButton.textContent = '回复';
    replyButton.addEventListener('click', () => {
      if (onReply) onReply(comment);
    });

    actions.append(likeButton, replyButton);
    item.append(meta, content, actions);

    if (comment.replies && comment.replies.length > 0) {
      const replies = document.createElement('div');
      replies.className = 'comment-replies';
      comment.replies.forEach((reply) => {
        replies.append(makeComment(reply, onReply, onLike, depth + 1));
      });
      item.append(replies);
    }

    return item;
  }

  /**
   * Resize textarea to fit content
   */
  function resizeCommentField(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  /**
   * Fetch approved comments from endpoint
   * sort: 'likes'（默认，按点赞数）| 'time'（按时间）
   */
  async function loadComments(endpoint, pageId, listElement, statusElement, onReply, onLike, sort = 'likes') {
    listElement.replaceChildren();
    const loading = document.createElement('p');
    loading.className = 'comment-empty comment-loading';
    loading.textContent = '正在加载评论...';
    listElement.append(loading);

    try {
      const url = new URL(endpoint);
      url.searchParams.set('path', pageId);
      url.searchParams.set('siteId', config.siteId);
      url.searchParams.set('sort', sort);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load comments: ${response.statusText}`);
      }

      const payload = await response.json();
      const comments = payload?.comments || [];

      listElement.replaceChildren();

      if (comments.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'comment-empty';
        empty.textContent = '还没有人评论，来抢沙发吧。';
        listElement.append(empty);
        return;
      }

      comments.forEach((comment) => {
        listElement.append(makeComment(comment, onReply, onLike));
      });
    } catch (error) {
      console.error('[Comments] Failed to load comments:', error);
      listElement.textContent = '';
      if (statusElement) {
        statusElement.textContent = '评论加载失败，请稍后重试。';
        statusElement.classList.add('is-error');
      }
    }
  }

  /**
   * Submit a comment
   */
  async function submitComment(
    endpoint,
    pageId,
    pageUrl,
    pageTitle,
    nickname,
    email,
    website,
    content,
    parentId,
    statusElement,
    submitButton
  ) {
    if (statusElement) {
      statusElement.textContent = '正在提交评论...';
      statusElement.classList.remove('is-error');
    }
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId: config.siteId,
          path: pageId,
          pageUrl,
          pageTitle,
          content,
          nickname,
          email,
          website,
          parentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to post comment: ${response.statusText}`);
      }

      let payload = {};
      try {
        payload = await response.json();
      } catch (error) {
        // Response body is optional; fall back to pending wording
      }
      const isApproved = payload.status === 'approved';
      const successMessage = isApproved ? '评论已发表。' : '评论已提交，等待审核后显示。';
      if (statusElement) {
        statusElement.textContent = successMessage;
      }
      return true;
    } catch (error) {
      console.error('[Comments] Failed to submit comment:', error);
      if (statusElement) {
        statusElement.textContent = '评论提交失败，请稍后重试。';
        statusElement.classList.add('is-error');
      }
      return false;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  async function likeComment(comment, button, statusElement) {
    if (!comment || !comment.id) return;

    // 已点赞的再次点击 = 取消点赞（toggle）
    const wasLiked = isCommentLiked(comment.id);

    // 乐观更新：点击立即反映到界面，服务器确认在后台进行，失败时回滚
    const previousCount = Math.max(0, Number(comment.likesCount) || 0);
    const optimisticCount = wasLiked ? Math.max(0, previousCount - 1) : previousCount + 1;
    comment.likesCount = optimisticCount;
    if (wasLiked) {
      removeCommentLiked(comment.id);
    } else {
      setCommentLiked(comment.id);
    }
    if (button) {
      button.textContent = `赞 (${optimisticCount})`;
      button.classList.toggle('is-liked', !wasLiked);
      button.disabled = true; // 请求期间禁用，防止连点导致计数错乱
    }

    try {
      const url = new URL(config.endpoint);
      url.pathname = url.pathname.replace(/\/$/, '') + '/like';
      url.searchParams.set('commentId', comment.id);
      url.searchParams.set('siteId', config.siteId);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancel: wasLiked }),
      });

      if (!response.ok) {
        throw new Error(`Failed to like comment: ${response.statusText}`);
      }

      // 以服务器返回的计数为准（并发场景下可能和乐观值有偏差）
      const payload = await response.json();
      if (payload?.likes != null) {
        comment.likesCount = Number(payload.likes);
        if (button) {
          button.textContent = `赞 (${comment.likesCount})`;
        }
      }
    } catch (error) {
      // 请求失败：回滚到点击前的状态
      comment.likesCount = previousCount;
      if (wasLiked) {
        setCommentLiked(comment.id);
      } else {
        removeCommentLiked(comment.id);
      }
      if (button) {
        button.textContent = `赞 (${previousCount})`;
        button.classList.toggle('is-liked', wasLiked);
      }
      console.error('[Comments] Failed to like comment:', error);
      if (statusElement) {
        statusElement.textContent = '评论点赞失败，请稍后重试。';
        statusElement.classList.add('is-error');
      }
    } finally {
      if (button) {
        button.disabled = false;
      }
    }
  }

  /**
   * Initialize comment section
   */
  function initCommentSection(section) {
    const draftForm = section.querySelector('[data-comment-draft-form]');
    const identityForm = section.querySelector('[data-comment-identity-form]');
    const modal = section.querySelector('[data-comment-modal]');
    const cancelButton = section.querySelector('[data-comment-cancel]');
    const status = section.querySelector('[data-comment-status]');
    const list = section.querySelector('[data-comment-list]');
    const contentField = draftForm?.elements.content;
    const nicknameField = identityForm?.elements.nickname;
    const sendButton = draftForm?.querySelector('[data-comment-send]');

    if (!draftForm || !identityForm || !modal || !list) {
      console.warn('[Comments] Missing required elements in comment section');
      return;
    }

    const pageId = section.dataset.pageId;
    const pageUrl = section.dataset.pageUrl;
    const pageTitle = section.dataset.pageTitle;
    let pendingContent = '';
    let replyTargetId = null;
    let currentSort = 'likes'; // 默认按点赞排序，可切换按时间

    // 排序切换条（插入在评论列表上方）
    const sortBar = document.createElement('div');
    sortBar.className = 'comment-sort-bar';
    const sortLabel = document.createElement('span');
    sortLabel.className = 'comment-sort-label';
    sortLabel.textContent = '排序丨';
    const likesSortBtn = document.createElement('button');
    likesSortBtn.type = 'button';
    likesSortBtn.className = 'comment-sort-btn is-active';
    likesSortBtn.textContent = '按点赞';
    const timeSortBtn = document.createElement('button');
    timeSortBtn.type = 'button';
    timeSortBtn.className = 'comment-sort-btn';
    timeSortBtn.textContent = '按时间';
    sortBar.append(sortLabel, likesSortBtn, timeSortBtn);

    function applySort(sort) {
      currentSort = sort;
      likesSortBtn.classList.toggle('is-active', sort === 'likes');
      timeSortBtn.classList.toggle('is-active', sort === 'time');
      loadComments(config.endpoint, pageId, list, status, setReplyTarget, handleLike, currentSort);
    }
    likesSortBtn.addEventListener('click', () => {
      if (currentSort !== 'likes') applySort('likes');
    });
    timeSortBtn.addEventListener('click', () => {
      if (currentSort !== 'time') applySort('time');
    });
    if (list?.parentElement) {
      list.parentElement.insertBefore(sortBar, list);
    }

    const setReplyTarget = (comment) => {
      replyTargetId = comment.id;
      setStatus(`正在回复 ${comment.authorName}，回复需审核后显示。`);
      contentField?.focus();
    };

    const clearReplyTarget = () => {
      replyTargetId = null;
      if (status) {
        status.textContent = '';
        status.classList.remove('is-error');
      }
    };

    const handleLike = (comment, button) => {
      likeComment(comment, button, status);
    };

    if (!pageId || !pageUrl || !pageTitle) {
      console.warn('[Comments] Missing required data attributes (pageId, pageUrl, pageTitle)');
      return;
    }

    const modalTitle = modal.querySelector('.comment-modal-title');
    const identitySubmitButton = identityForm.querySelector('button[type="submit"]');
    const identityBar = section.querySelector('[data-comment-identity-bar]');
    const identityName = section.querySelector('[data-comment-identity-name]');
    const identityEditButton = section.querySelector('[data-comment-identity-edit]');

    // Modal controls. mode 'comment': identity dialog opened before posting;
    // mode 'identity': user edits their saved identity without posting.
    let modalMode = 'comment';

    const fillIdentityForm = () => {
      const identity = getSavedIdentity();
      if (!identity) return;
      if (nicknameField) nicknameField.value = identity.nickname;
      const emailField = identityForm.elements.email;
      const websiteField = identityForm.elements.website;
      if (emailField) emailField.value = identity.email;
      if (websiteField) websiteField.value = identity.website;
    };

    const renderIdentityBar = () => {
      const identity = getSavedIdentity();
      if (!identityBar) return;
      identityBar.hidden = !identity;
      if (identity && identityName) {
        identityName.textContent = `以「${identity.nickname}」身份发表`;
      }
    };

    const openModal = (mode = 'comment') => {
      modalMode = mode;
      fillIdentityForm();
      if (modalTitle) {
        modalTitle.textContent = mode === 'identity' ? '修改身份信息' : '填写身份信息';
      }
      if (identitySubmitButton) {
        identitySubmitButton.textContent = mode === 'identity' ? '保存' : '提交评论';
      }
      modal.hidden = false;
      document.body.classList.add('comment-modal-open');
      window.setTimeout(() => nicknameField?.focus(), 0);
    };

    const closeModal = () => {
      modal.hidden = true;
      document.body.classList.remove('comment-modal-open');
    };

    // Draft form handlers
    const updateSendButton = () => {
      if (sendButton && contentField) {
        sendButton.disabled = contentField.value.trim() === '';
      }
    };

    const setStatus = (message, isError = false) => {
      if (status) {
        status.textContent = message;
        status.classList.toggle('is-error', isError);
      }
    };

    contentField?.addEventListener('input', () => {
      resizeCommentField(contentField);
      updateSendButton();
    });

    const submitWithIdentity = async (nickname, email, website) => {
      const success = await submitComment(
        config.endpoint,
        pageId,
        pageUrl,
        pageTitle,
        nickname,
        email,
        website,
        pendingContent,
        replyTargetId,
        status,
        identitySubmitButton
      );

      if (success) {
        pendingContent = '';
        replyTargetId = null;
        draftForm.reset();
        resizeCommentField(contentField);
        updateSendButton();
        identityForm.reset();
        clearReplyTarget();
        closeModal();
        await loadComments(config.endpoint, pageId, list, status, setReplyTarget, handleLike, currentSort);
      }
    };

    draftForm.addEventListener('submit', (event) => {
      event.preventDefault();
      pendingContent = contentField?.value.trim() || '';
      if (!pendingContent) return;
      setStatus('');
      const identity = getSavedIdentity();
      if (identity) {
        submitWithIdentity(identity.nickname, identity.email, identity.website);
      } else {
        openModal('comment');
      }
    });

    // Identity form (nickname/email) handlers
    identityForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(identityForm);
      const nickname = String(formData.get('nickname') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const website = String(formData.get('website') || '').trim();

      if (!nickname) return;

      // Persist immediately so a failed post does not lose the identity
      saveIdentity({ nickname, email, website });
      renderIdentityBar();

      if (modalMode === 'comment' && pendingContent) {
        await submitWithIdentity(nickname, email, website);
      } else {
        identityForm.reset();
        closeModal();
        setStatus('身份信息已保存。');
      }
    });

    // Identity bar edit handler
    identityEditButton?.addEventListener('click', () => {
      setStatus('');
      openModal('identity');
    });

    // Modal close handlers
    cancelButton?.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });

    // Initial setup
    loadComments(config.endpoint, pageId, list, status, setReplyTarget, handleLike, currentSort);
    resizeCommentField(contentField);
    updateSendButton();
    renderIdentityBar();
  }

  /**
   * Initialize all comment sections on page
   */
  function initComments() {
    document.querySelectorAll('[data-worker-comments]').forEach(initCommentSection);
  }

  // Auto-init disabled; call CommentsModule.initComments() manually when the page shows
  window.CommentsModule = {
    initComments,
    formatCommentDate,
    makeComment,
  };
})();
