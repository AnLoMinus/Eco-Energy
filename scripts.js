document.addEventListener("DOMContentLoaded", function () {
  // Load content for each stage
  const stagesContent = document.getElementById("stages");
  const stages = [
    { id: "stage1", title: "מחקר שוק וספקים", file: "1.md" },
    { id: "stage2", title: "רגולציה ותמריצים", file: "2.md" },
    { id: "stage3", title: "הכשרת עובדים", file: "3.md" },
    { id: "stage4", title: "הקמת מודל עסקי", file: "4.md" },
    { id: "stage5", title: "חיפוש משקיעים", file: "5.md" },
    { id: "stage6", title: "שיווק ופרסום", file: "6.md" },
  ];

  // Load MD content function
  async function loadMDContent(file, container) {
    try {
      const response = await fetch(file);
      const content = await response.text();

      // Remove the RTL div wrapper if exists
      const cleanContent = content
        .replace(/<div dir="rtl">/g, "")
        .replace(/<\/div>/g, "");

      // Convert markdown to HTML
      container.innerHTML = marked.parse(cleanContent);

      // Add RTL class to container
      container.classList.add("rtl-content");

      // Initialize any tooltips or popovers
      const tooltipTriggerList = [].slice.call(
        container.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    } catch (error) {
      console.error("Error loading content:", error);
      container.innerHTML = "<p class='text-danger'>שגיאה בטעינת התוכן</p>";
    }
  }

  // Create and load sections
  stages.forEach((stage) => {
    const section = document.createElement("section");
    section.id = stage.id;
    section.className = "stage-section mb-5 fade-in";

    const container = document.createElement("div");
    container.className = "content-container";

    section.innerHTML = `
      <h2 class="text-center mb-4">${stage.title}</h2>
      <div class="loading-spinner text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">טוען...</span>
        </div>
      </div>
    `;

    section.appendChild(container);
    stagesContent.appendChild(section);

    // Load content
    loadMDContent(stage.file, container);
  });

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add active class to nav items on scroll
  window.addEventListener("scroll", function () {
    const sections = document.querySelectorAll(".stage-section");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 60) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });
});
