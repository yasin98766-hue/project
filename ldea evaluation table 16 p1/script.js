      const body = document.getElementById("ideasBody");
      const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);
      const money = (n) => fmt(n) + " تومان";
      function calculate() {
        const rows = [...body.querySelectorAll("tr")];
        let total = 0,
          best = null,
          validCount = 0;
        rows.forEach((row) => {
          const inputs = [...row.querySelectorAll(".rating")],
            scoreBox = row.querySelector(".score-value");
          const name =
            row.querySelector(".idea-input").value.trim() || "ایده بدون نام";
          total += Math.max(0, Number(row.querySelector(".cost").value) || 0);
          const nums = inputs.map((i) => Number(i.value));
          if (
            nums.some(
              (n, i) =>
                inputs[i].value === "" ||
                !Number.isFinite(n) ||
                n < 1 ||
                n > 5 ||
                !Number.isInteger(n),
            )
          ) {
            scoreBox.textContent = "نامعتبر";
            row.querySelector(".score-percent").textContent = "عدد ۱ تا ۵";
            return;
          }
          const sum = nums.reduce((a, b) => a + b, 0),
            pct = Math.round((sum / 25) * 100);
          scoreBox.textContent = fmt(sum) + " از ۲۵";
          row.querySelector(".score-percent").textContent = fmt(pct) + "٪";
          validCount++;
          if (!best || pct > best.pct) best = { name, pct };
        });
        document.getElementById("ideaCount").textContent =
          fmt(rows.length) + " ایده";
        document.getElementById("totalCost").textContent = money(total);
        document.getElementById("bestIdea").textContent = best
          ? best.name + " (" + fmt(best.pct) + "٪)"
          : "—";
        document.getElementById("status").textContent =
          "محاسبه شد؛ " + fmt(validCount) + " ایده معتبر است.";
      }
      function addRow() {
        const row = document.createElement("tr");
        row.innerHTML =
          '<td class="idea-cell"><input class="idea-input" placeholder="نام ایده" aria-label="نام ایده"></td>' +
          ["فرصت بازار", "سرمایه‌گذاری", "مدیریت و اجرا", "سودآوری", "ریسک"]
            .map(
              (x) =>
                '<td><input class="rating" type="number" min="1" max="5" step="1" placeholder="۱ تا ۵" aria-label="' +
                x +
                '"></td>',
            )
            .join("") +
          '<td class="score-cell"><span class="score-value">—</span><span class="score-percent">از ۱۰۰</span></td><td><input class="cost" type="number" min="0" step="100000" placeholder="هزینه به تومان"></td><td><button class="danger delete-row" type="button">×</button></td>';
        body.appendChild(row);
        document.getElementById("status").textContent =
          "ایده جدید اضافه شد؛ اطلاعاتش را وارد کن.";
      }
      document
        .getElementById("calculateBtn")
        .addEventListener("click", calculate);
      document.getElementById("addRowBtn").addEventListener("click", addRow);
      document
        .getElementById("resetBtn")
        .addEventListener("click", () => location.reload());
      body.addEventListener("click", (e) => {
        const b = e.target.closest(".delete-row");
        if (b) {
          b.closest("tr").remove();
          calculate();
        }
      });
      body.addEventListener("input", (e) => {
        if (e.target.matches(".rating,.cost,.idea-input"))
          document.getElementById("status").textContent =
            "اطلاعات تغییر کرده؛ برای به‌روزرسانی، محاسبه را بزن.";
      });
      calculate();