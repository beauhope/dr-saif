document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".media-list");
  if (!list) return;

  const items = Array.from(list.querySelectorAll(".media-item"));

  // ترتيب تنازلي: الأحدث → الأقدم
  items.sort((a, b) => {
    const da = Date.parse(a.dataset.date || "1970-01-01");
    const db = Date.parse(b.dataset.date || "1970-01-01");
    return db - da;
  });

  // إعادة الإدراج + الترقيم
  items.forEach((item, index) => {
    // حذف أي رقم قديم (أمان)
    const oldNum = item.querySelector(".article-num");
    if (oldNum) oldNum.remove();

    // إنشاء رقم جديد
    const num = document.createElement("span");
    num.className = "article-num";
    num.textContent = index + 1;

    // إضافته في بداية المقال (يمين)
    item.prepend(num);

    list.appendChild(item);
  });
});
