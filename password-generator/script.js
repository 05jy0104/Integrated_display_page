// 获取 DOM
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthLabel = document.getElementById("strength-label");

// 字符集
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// 长度滑块实时显示
lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

// 生成功能
generateButton.addEventListener("click", makePassword);

function makePassword() {
  const length = Number(lengthSlider.value);
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;

  // 勾选框验证 - 至少选择一种字符类型
  if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
    alert("请至少选择一种字符类型！");
    return;
  }

  const newPassword = createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  );

  passwordInput.value = newPassword;
  updateStrengthMeter(newPassword);
}

function createRandomPassword(len, upper, lower, nums, syms) {
  let all = "";
  if (upper) all += uppercaseLetters;
  if (lower) all += lowercaseLetters;
  if (nums) all += numberCharacters;
  if (syms) all += symbolCharacters;

  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd;
}

// 强度计算
function updateStrengthMeter(pwd) {
  const len = pwd.length;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);
  const hasSym = /[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/.test(pwd);

  let score = 0;
  score += Math.min(len * 2, 40);
  if (hasUpper) score += 15;
  if (hasLower) score += 15;
  if (hasNum) score += 15;
  if (hasSym) score += 15;
  if (len < 8) score = Math.min(score, 40);

  score = Math.max(5, Math.min(100, score));

  let label = "";
  let colorClass = "";
  let width = "";
  
  if (score < 40) {
    label = "Weak";
    colorClass = "weak";
    width = "33%";
  } else if (score < 70) {
    label = "Medium";
    colorClass = "medium";
    width = "66%";
  } else {
    label = "Strong";
    colorClass = "strong";
    width = "100%";
  }
  
  strengthLabel.textContent = label;
  
  // 移除所有颜色类并添加当前类
  strengthBar.classList.remove("weak", "medium", "strong");
  strengthBar.classList.add(colorClass);
  
  // 设置宽度
  strengthBar.style.width = width;
}

// 复制功能
copyButton.addEventListener("click", () => {
  if (!passwordInput.value) return;
  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch((err) => console.error("复制失败:", err));
});

function showCopySuccess() {
  const icon = copyButton.querySelector("i");
  icon.classList.remove("far", "fa-copy");
  icon.classList.add("fas", "fa-check");
  copyButton.style.color = "#3b82f6"; // 使用主题蓝色
  setTimeout(() => {
    icon.classList.remove("fas", "fa-check");
    icon.classList.add("far", "fa-copy");
    copyButton.style.color = "";
  }, 1500);
}

// 初始密码
window.addEventListener("DOMContentLoaded", makePassword);