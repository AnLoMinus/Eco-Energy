document.addEventListener("DOMContentLoaded", function () {
  // Initialize power consumption chart
  const powerConsumptionCtx = document.createElement("canvas");
  document
    .getElementById("power-consumption-chart")
    .appendChild(powerConsumptionCtx);

  new Chart(powerConsumptionCtx, {
    type: "bar",
    data: {
      labels: ["סמארטפון", "טאבלט", "מחשב", "טלוויזיה", "תאורה", "רמקולים"],
      datasets: [
        {
          label: "צריכת חשמל (Wh)",
          data: [30, 45, 240, 240, 200, 60],
          backgroundColor: "#2196F3",
          borderColor: "#1976D2",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Watt-hour (Wh)",
          },
        },
      },
    },
  });

  // Create system diagram
  const systemOverview = document.getElementById("system-overview");
  createSystemDiagram(systemOverview);

  // Initialize power calculator
  const calculator = new PowerCalculator();

  // Initialize system monitor
  const systemMonitor = new SystemMonitor();

  // Initialize daily consumption chart
  const dailyConsumptionCtx = document.getElementById("dailyConsumptionChart");
  const dailyConsumptionChart = new Chart(dailyConsumptionCtx, {
    type: "line",
    data: {
      labels: ["00:00", "06:00", "12:00", "18:00", "24:00"],
      datasets: [
        {
          label: "צריכת חשמל יומית (Wh)",
          data: [0, 100, 200, 150, 100],
          borderColor: "#4caf50",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "שעה",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Watt-hour (Wh)",
          },
        },
      },
    },
  });

  // Update daily consumption chart periodically
  setInterval(() => {
    const newData = dailyConsumptionChart.data.datasets[0].data.map(
      (value) => value + Math.floor(Math.random() * 20 - 10)
    );
    dailyConsumptionChart.data.datasets[0].data = newData;
    dailyConsumptionChart.update();
  }, 5000);

  // Initialize efficiency chart
  const efficiencyCtx = document.getElementById("efficiencyChart");
  new Chart(efficiencyCtx, {
    type: "line",
    data: {
      labels: ["6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
      datasets: [
        {
          label: "יעילות סולארית",
          data: [60, 75, 90, 95, 90, 75, 60],
          borderColor: "#ffd700",
          fill: false,
        },
        {
          label: "יעילות רוח",
          data: [70, 75, 80, 75, 80, 85, 80],
          borderColor: "#87ceeb",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "יעילות (%)",
          },
        },
      },
    },
  });

  // Update efficiency stats periodically
  setInterval(() => {
    const avgEfficiency = document.getElementById("avgEfficiency");
    const currentValue = parseInt(avgEfficiency.textContent);
    const newValue = Math.max(
      75,
      Math.min(95, currentValue + (Math.random() > 0.5 ? 1 : -1))
    );
    avgEfficiency.textContent = newValue + "%";
  }, 3000);

  // Add to the DOMContentLoaded event listener
  class SavingsCalculator {
    constructor() {
      this.initializeCalculator();
    }

    initializeCalculator() {
      const monthlyUsage = document.getElementById("monthlyUsage");
      const offPeakUsage = document.getElementById("offPeakUsage");
      const offPeakPercentage = document.getElementById("offPeakPercentage");

      // Add event listeners
      monthlyUsage.addEventListener("input", () => this.calculateSavings());
      offPeakUsage.addEventListener("input", (e) => {
        offPeakPercentage.textContent = `${e.target.value}%`;
        this.calculateSavings();
      });

      // Initial calculation
      this.calculateSavings();
    }

    calculateSavings() {
      const monthlyUsage = parseFloat(
        document.getElementById("monthlyUsage").value
      );
      const offPeakPercentage =
        parseFloat(document.getElementById("offPeakUsage").value) / 100;

      // Regular tariff calculation
      const regularRate = monthlyUsage <= 400 ? 0.48 : 0.53;
      const regularCost = monthlyUsage * regularRate;

      // Solar system calculation (assuming 70% reduction in grid consumption)
      const gridConsumption = monthlyUsage * 0.3; // Only 30% from grid
      const solarCost = gridConsumption * regularRate;

      // Update display
      document.getElementById(
        "regularCost"
      ).textContent = `₪${regularCost.toFixed(0)}`;
      document.getElementById("solarCost").textContent = `₪${solarCost.toFixed(
        0
      )}`;
      document.getElementById("monthlySavings").textContent = `₪${(
        regularCost - solarCost
      ).toFixed(0)}`;
    }
  }

  // Initialize savings calculator
  const savingsCalculator = new SavingsCalculator();
});

function createSystemDiagram(container) {
  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "300");
  svg.setAttribute("viewBox", "0 0 800 300");

  // Define components
  const components = [
    { id: "solar", x: 100, y: 50, label: "פאנל סולארי", icon: "🌞" },
    { id: "wind", x: 100, y: 150, label: "טורבינת רוח", icon: "🌪️" },
    { id: "controller", x: 300, y: 100, label: "בקר טעינה", icon: "🎮" },
    { id: "battery", x: 500, y: 100, label: "סוללה", icon: "🔋" },
    { id: "inverter", x: 700, y: 100, label: "ממיר מתח", icon: "🔌" },
  ];

  // Draw connections
  const connections = [
    { from: "solar", to: "controller" },
    { from: "wind", to: "controller" },
    { from: "controller", to: "battery" },
    { from: "battery", to: "inverter" },
  ];

  // Draw connections
  connections.forEach((conn) => {
    const from = components.find((c) => c.id === conn.from);
    const to = components.find((c) => c.id === conn.to);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", from.x + 50);
    line.setAttribute("y1", from.y + 25);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y + 25);
    line.setAttribute("class", "connection-line");
    svg.appendChild(line);
  });

  // Draw components
  components.forEach((comp) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Component rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", comp.x);
    rect.setAttribute("y", comp.y);
    rect.setAttribute("width", "100");
    rect.setAttribute("height", "50");
    rect.setAttribute("class", "component-node");
    rect.setAttribute("rx", "5");
    g.appendChild(rect);

    // Component label
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", comp.x + 50);
    text.setAttribute("y", comp.y + 30);
    text.setAttribute("class", "component-label");
    text.textContent = `${comp.icon} ${comp.label}`;
    g.appendChild(text);

    svg.appendChild(g);
  });

  container.appendChild(svg);
}

// Update system status periodically
setInterval(() => {
  // Simulate real-time data updates
  const batteryLevel = Math.floor(Math.random() * 20 + 60); // 60-80%
  const currentProduction = Math.floor(Math.random() * 50 + 150); // 150-200W
  const currentConsumption = Math.floor(Math.random() * 40 + 100); // 100-140W

  document.querySelector(".progress-bar").style.width = `${batteryLevel}%`;
  document.querySelector(".progress-bar").textContent = `${batteryLevel}%`;
  document.querySelectorAll(
    ".status-value"
  )[0].textContent = `${currentProduction}W`;
  document.querySelectorAll(
    ".status-value"
  )[1].textContent = `${currentConsumption}W`;
}, 5000);

// Power Calculator
class PowerCalculator {
  constructor() {
    this.devices = [];
    this.initializeCalculator();
  }

  initializeCalculator() {
    const addDeviceBtn = document.getElementById("addDeviceBtn");
    addDeviceBtn.addEventListener("click", () => this.addDeviceEntry());

    // Add initial device entry
    this.addDeviceEntry();
  }

  addDeviceEntry() {
    const deviceList = document.getElementById("deviceList");
    const deviceEntry = document.createElement("div");
    deviceEntry.className = "device-entry";

    deviceEntry.innerHTML = `
            <input type="text" class="device-name" placeholder="שם המכשיר" />
            <input type="number" class="device-power" placeholder="הספק (ואט)" />
            <input type="number" class="device-hours" placeholder="שעות שימוש ביום" />
            <button class="remove-device">❌</button>
        `;

    deviceList.appendChild(deviceEntry);

    // Add event listeners
    const inputs = deviceEntry.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("input", () => this.calculateConsumption());
    });

    deviceEntry
      .querySelector(".remove-device")
      .addEventListener("click", () => {
        deviceEntry.remove();
        this.calculateConsumption();
      });
  }

  calculateConsumption() {
    let dailyWh = 0;
    const deviceEntries = document.querySelectorAll(".device-entry");

    deviceEntries.forEach((entry) => {
      const power = parseFloat(entry.querySelector(".device-power").value) || 0;
      const hours = parseFloat(entry.querySelector(".device-hours").value) || 0;
      dailyWh += power * hours;
    });

    const monthlyKwh = (dailyWh * 30) / 1000;

    // Update display
    document.getElementById(
      "dailyConsumption"
    ).textContent = `${dailyWh.toFixed(1)} Wh`;
    document.getElementById(
      "monthlyConsumption"
    ).textContent = `${monthlyKwh.toFixed(1)} kWh`;

    // Update chart if needed
    this.updateConsumptionChart(deviceEntries);
  }

  updateConsumptionChart(deviceEntries) {
    const chartData = [];
    const chartLabels = [];

    deviceEntries.forEach((entry) => {
      const name = entry.querySelector(".device-name").value || "מכשיר";
      const power = parseFloat(entry.querySelector(".device-power").value) || 0;
      const hours = parseFloat(entry.querySelector(".device-hours").value) || 0;

      if (power && hours) {
        chartLabels.push(name);
        chartData.push(power * hours);
      }
    });

    // Update existing chart
    if (window.powerConsumptionChart) {
      window.powerConsumptionChart.data.labels = chartLabels;
      window.powerConsumptionChart.data.datasets[0].data = chartData;
      window.powerConsumptionChart.update();
    }
  }
}

// Add after the PowerCalculator class
class SystemMonitor {
  constructor() {
    this.initializeMonitoring();
  }

  initializeMonitoring() {
    // Update system stats every 5 seconds
    setInterval(() => {
      this.updateSystemStats();
    }, 5000);
  }

  updateSystemStats() {
    // Simulate solar production based on time of day
    const hour = new Date().getHours();
    let solarProduction = 0;

    if (hour >= 6 && hour <= 18) {
      // Simulate peak hours between 10-14
      const peakHour = hour >= 10 && hour <= 14 ? 1 : 0.5;
      solarProduction = Math.floor(
        200 * peakHour * (0.8 + Math.random() * 0.4)
      );
    }

    // Update display
    document.querySelectorAll(
      ".status-value"
    )[0].textContent = `${solarProduction}W`;

    // Simulate consumption based on time
    const baseConsumption = 100;
    const timeMultiplier = hour >= 18 || hour <= 22 ? 1.5 : 1;
    const consumption = Math.floor(
      baseConsumption * timeMultiplier * (0.8 + Math.random() * 0.4)
    );

    document.querySelectorAll(
      ".status-value"
    )[1].textContent = `${consumption}W`;

    // Update battery level based on production vs consumption
    const currentLevel =
      parseInt(document.querySelector(".progress-bar").style.width) || 75;
    let newLevel = currentLevel;

    if (solarProduction > consumption) {
      newLevel = Math.min(100, currentLevel + 1);
    } else {
      newLevel = Math.max(0, currentLevel - 1);
    }

    document.querySelector(".progress-bar").style.width = `${newLevel}%`;
    document.querySelector(".progress-bar").textContent = `${newLevel}%`;
  }

  updateSystemIndicators() {
    const hour = new Date().getHours();

    // Update solar indicator
    const solarActive = hour >= 6 && hour <= 18;
    const solarDot = document.querySelector(
      ".solar-indicator + .indicator-details .status-dot"
    );
    solarDot.classList.toggle("active", solarActive);

    // Simulate wind activity
    const windActive = Math.random() > 0.5;
    const windDot = document.querySelector(
      ".wind-indicator + .indicator-details .status-dot"
    );
    windDot.classList.toggle("active", windActive);

    // Update temperature
    const baseTemp = 30;
    const tempVariation = Math.floor(Math.random() * 6 - 3);
    const newTemp = baseTemp + tempVariation;
    document.getElementById("systemTemp").textContent = `${newTemp}°C`;

    // Update temperature trend
    const tempTrend = document.querySelector(".temp-trend i");
    tempTrend.className =
      tempVariation > 0 ? "fas fa-arrow-up" : "fas fa-arrow-down";
    tempTrend.style.color = newTemp > 35 ? "#dc3545" : "#198754";
  }
}

// Add ROI Chart
const roiCtx = document.getElementById("roiChart");
new Chart(roiCtx, {
  type: "line",
  data: {
    labels: ["שנה 1", "שנה 2", "שנה 3", "שנה 4", "שנה 5"],
    datasets: [
      {
        label: "החזר השקעה מצטבר",
        data: [1800, 3600, 5400, 7200, 9000],
        borderColor: "#4caf50",
        fill: true,
        backgroundColor: "rgba(76, 175, 80, 0.1)",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "חיסכון בש״ח",
        },
      },
    },
  },
});
