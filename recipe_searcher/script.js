// DOM元素
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const backBtn = document.getElementById("back-btn");

// API配置
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

// 事件监听
searchBtn.addEventListener("click", searchMeals);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchMeals();
});
mealsContainer.addEventListener("click", handleMealClick);
backBtn.addEventListener("click", () => mealDetails.classList.add("hidden"));

// 搜索菜谱
async function searchMeals() {
    const searchTerm = searchInput.value.trim();
    
    // 处理空输入
    if (!searchTerm) {
        showError("请输入搜索关键词");
        return;
    }
    
    try {
        showLoading();
        mealsContainer.innerHTML = "";
        errorContainer.classList.add("hidden");

        // 从API获取菜谱数据
        const response = await fetch(`${SEARCH_URL}${searchTerm}`);
        const data = await response.json();

        if (data.meals === null) {
            // 没有找到菜谱
            resultHeading.textContent = "";
            mealsContainer.innerHTML = "";
            showError(`未找到与"${searchTerm}"相关的菜谱，请尝试其他关键词！`);
        } else {
            resultHeading.textContent = `"${searchTerm}"的搜索结果：`;
            displayMeals(data.meals);
            searchInput.value = "";
        }
    } catch (error) {
        showError("网络错误，请稍后重试");
    }
}

// 显示加载状态
function showLoading() {
    resultHeading.textContent = "搜索中...";
    mealsContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>正在搜索美味菜谱...</p>
        </div>
    `;
}

// 显示错误信息
function showError(message) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden");
}

// 显示菜谱列表
function displayMeals(meals) {
    mealsContainer.innerHTML = "";
    
    meals.forEach((meal) => {
        const mealCard = document.createElement("div");
        mealCard.className = "recipe-card";
        mealCard.setAttribute("data-meal-id", meal.idMeal);
        
        mealCard.innerHTML = `
            <div class="recipe-image">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                <div class="recipe-overlay">
                    <button class="view-recipe-btn">
                        <i class="fas fa-eye"></i>
                        查看详情
                    </button>
                </div>
            </div>
            <div class="recipe-info">
                <h3 class="recipe-title">${meal.strMeal}</h3>
                <div class="recipe-meta">
                    ${meal.strCategory ? `
                        <span class="recipe-category">
                            <i class="fas fa-tag"></i>
                            ${meal.strCategory}
                        </span>
                    ` : ""}
                    <span class="recipe-time">
                        <i class="fas fa-clock"></i>
                        30分钟
                    </span>
                </div>
            </div>
        `;
        
        mealsContainer.appendChild(mealCard);
    });
}

// 处理菜谱点击事件
async function handleMealClick(e) {
    const recipeCard = e.target.closest(".recipe-card");
    if (!recipeCard) return;

    const mealId = recipeCard.getAttribute("data-meal-id");

    try {
        const response = await fetch(`${LOOKUP_URL}${mealId}`);
        const data = await response.json();

        if (data.meals && data.meals[0]) {
            const meal = data.meals[0];
            showMealDetails(meal);
        }
    } catch (error) {
        showError("无法加载菜谱详情，请稍后重试");
    }
}

// 显示菜谱详情
function showMealDetails(meal) {
    const ingredients = extractIngredients(meal);

    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = `
        <div class="recipe-detail">
            <div class="recipe-hero">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-detail-img">
                <div class="recipe-header">
                    <h1 class="recipe-detail-title">${meal.strMeal}</h1>
                    <div class="recipe-tags">
                        <span class="tag category-tag">
                            <i class="fas fa-tag"></i>
                            ${meal.strCategory || "未分类"}
                        </span>
                        <span class="tag difficulty-tag">
                            <i class="fas fa-signal"></i>
                            简单
                        </span>
                    </div>
                </div>
            </div>

            <div class="recipe-content">
                <div class="ingredients-section">
                    <h2 class="section-title">
                        <i class="fas fa-shopping-basket"></i>
                        食材清单
                    </h2>
                    <ul class="ingredients-list">
                        ${ingredients.map(item => `
                            <li>
                                <i class="fas fa-check-circle"></i>
                                <span class="ingredient">${item.measure} ${item.ingredient}</span>
                            </li>
                        `).join("")}
                    </ul>
                </div>

                <div class="instructions-section">
                    <h2 class="section-title">
                        <i class="fas fa-list-ol"></i>
                        制作步骤
                    </h2>
                    <div class="instructions">
                        <p>${formatInstructions(meal.strInstructions)}</p>
                    </div>
                </div>

                <div class="recipe-actions">
                    ${meal.strYoutube ? `
                        <a href="${meal.strYoutube}" target="_blank" class="action-btn youtube-btn">
                            <i class="fab fa-youtube"></i>
                            观看视频教程
                        </a>
                    ` : ""}
                    <button class="action-btn save-btn" onclick="saveRecipe('${meal.idMeal}')">
                        <i class="fas fa-heart"></i>
                        收藏菜谱
                    </button>
                </div>
            </div>
        </div>
    `;
    
    mealDetails.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

// 提取食材信息
function extractIngredients(meal) {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push({
                ingredient: ingredient.trim(),
                measure: (measure || "").trim()
            });
        }
    }
    
    return ingredients;
}

// 格式化制作步骤
function formatInstructions(instructions) {
    if (!instructions) return "暂无制作说明";
    
    // 简单的格式化：将数字开头的步骤分开
    return instructions
        .split(/\r\n|\n/)
        .filter(step => step.trim())
        .map(step => step.trim())
        .join("<br><br>");
}

// 收藏菜谱功能
function saveRecipe(mealId) {
    // 这里可以实现收藏功能
    alert("菜谱已收藏！");
}

// 点击模态框外部关闭
mealDetails.addEventListener("click", (e) => {
    if (e.target === mealDetails) {
        mealDetails.classList.add("hidden");
        document.body.style.overflow = "auto";
    }
});

// 添加加载动画样式
const style = document.createElement('style');
style.textContent = `
    .loading-container {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--border);
        border-top: 4px solid var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);