// =========================================================================
// TELEGRAM BOT SOZLAMALARI (Siz bergan token va chat ID o'rnatildi)
// =========================================================================

const BOT_TOKEN = "9193754548:AAGfe6R5GJlSqP8omEjwejYwm8rFUmkGuMw";
const CHAT_ID = "-1004449975798";

// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. MOBIL MENYU (HAMBURGER) BOSHQARUVI
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-btn");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
            });
        });
    }

    // 2. "KURSGA YOZILISH" TUGMASI BOSILGANDA KURSINI AVTOMATIK TANLASH
    const enrollButtons = document.querySelectorAll(".enroll-btn");
    const registrationSection = document.getElementById("royxatdan-otish");
    const courseSelect = document.getElementById("kurs-select");

    enrollButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedCourse = button.getAttribute("data-course");

            if (courseSelect && selectedCourse) {
                courseSelect.value = selectedCourse;
            }

            if (registrationSection) {
                registrationSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // 3. RO'YXATDAN O'TISH FORMASINI TELEGRAM BOTGA YUBORISH (FormData orqali)
    const form = document.getElementById("registration-form");
    const submitBtn = document.getElementById("submit-btn");
    const formMessage = document.getElementById("form-message");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Yuborilmoqda...";
            formMessage.className = "form-message";
            formMessage.textContent = "";

            // Formadagi BARCHA maydonlarni avtomatik yig'ish
            const formData = new FormData(form);
            let telegramText = "🎓 <b>Yangi o'quvchi arizasi!</b>\n\n";

            for (const [key, value] of formData.entries()) {
                if (value.trim() !== "") {
                    telegramText += `🔹 <b>${escapeHTML(key)}:</b> ${escapeHTML(value.trim())}\n`;
                }
            }

            const now = new Date().toLocaleString("uz-UZ");
            telegramText += `\n🕒 <i>Yuborilgan vaqt: ${now}</i>`;

            const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

            try {
                const response = await fetch(telegramApiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: telegramText,
                        parse_mode: "HTML"
                    })
                });

                const result = await response.json();

                if (response.ok && result.ok) {
                    formMessage.textContent = "Tabriklaymiz! Arizangiz qabul qilindi, tez orada bog'lanamiz";
                    formMessage.classList.add("success");
                    form.reset();
                } else {
                    throw new Error(result.description || "Telegram serveridan xatolik qaytdi.");
                }
            } catch (error) {
                console.error("Xatolik:", error);
                formMessage.textContent = "Xatolik yuz berdi: Ma'lumot yuborilmadi. Iltimos, qayta urinib ko'ring yoki qo'ng'iroq qiling.";
                formMessage.classList.add("error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});

// HTML belgilarini xavfsiz holatga keltiruvchi yordamchi funksiya
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}