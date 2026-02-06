document.addEventListener("DOMContentLoaded", () => {
  const PAGE_SIZE = 40;

  const list = document.querySelector(".media-list");
  const meta = document.getElementById("articlesMeta");
  const pager = document.getElementById("pagination");
  if (!list || !pager || !meta) return;

  const items = Array.from(list.querySelectorAll(".media-item"));

  // ترتيب تنازلي: الأحدث → الأقدم
  items.sort((a, b) => {
    const da = Date.parse(a.dataset.date || "1970-01-01");
    const db = Date.parse(b.dataset.date || "1970-01-01");
    return db - da;
  });

  // إجمالي المقالات
  const total = items.length;

  // حساب الصفحات
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // الصفحة الحالية من الرابط (اختياري) ?page=2
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page") || "1", 10);
  if (Number.isNaN(currentPage) || currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  // تحديث العنوان أعلى الصفحة
  function renderMeta() {
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, total);

    meta.innerHTML = `
      <div class="articles-meta__line">
        <span>مجموع المقالات المنشورة: <strong>${total}</strong></span>
        <span>عرض: <strong>${start}</strong>–<strong>${end}</strong></span>
        <span>صفحة <strong>${currentPage}</strong> من <strong>${totalPages}</strong></span>
      </div>
    `;
  }

  // ترقيم تلقائي (يمين المقال) — اختياري، إذا سبق طبقته سيظل يعمل
  function applyNumbers(visibleItems, startIndex) {
    visibleItems.forEach((item, i) => {
      const old = item.querySelector(".article-num");
      if (old) old.remove();

      const num = document.createElement("span");
      num.className = "article-num";
      num.textContent = startIndex + i; // يبدأ من 1 للأحدث

      item.prepend(num);
    });
  }

  // عرض صفحة
  function renderPage() {
    list.innerHTML = "";

    const startIndex0 = (currentPage - 1) * PAGE_SIZE;
    const pageItems = items.slice(startIndex0, startIndex0 + PAGE_SIZE);

    // إضافة العناصر للصفحة
    pageItems.forEach(it => list.appendChild(it));

    // رقم تسلسلي للأحدث = 1
    applyNumbers(pageItems, startIndex0 + 1);

    // تحديث شريط المعلومات والأزرار
    renderMeta();
    renderPager();
  }

  // تحديث رابط الصفحة ?page=
  function goToPage(p) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(p));
    window.location.href = url.toString();
  }

  function renderPager() {
    pager.innerHTML = "";

    const prev = document.createElement("button");
    prev.className = "pager-btn";
    prev.textContent = "◀ السابق";
    prev.disabled = currentPage <= 1;
    prev.addEventListener("click", () => goToPage(currentPage - 1));

    const next = document.createElement("button");
    next.className = "pager-btn";
    next.textContent = "التالي ▶";
    next.disabled = currentPage >= totalPages;
    next.addEventListener("click", () => goToPage(currentPage + 1));

    pager.appendChild(prev);

    const label = document.createElement("span");
    label.className = "pager-label";
    label.textContent = `صفحة ${currentPage} من ${totalPages}`;
    pager.appendChild(label);

    pager.appendChild(next);
  }

  renderPage();
});
