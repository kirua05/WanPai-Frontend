<template>
  <main class="bg-white text-gray-800 overflow-x-hidden">
    <!-- Hero 區 -->
    <section class="relative bg-yellow-100 py-24 px-6 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-4">尋找屬於你的命定玩具</h1>
      <p class="text-lg md:text-xl max-w-xl mx-auto">
        從懷舊到新歡，讓喜歡有個地方落腳。<br />
        玩派，陪你打造專屬的收藏宇宙。
      </p>
      <RouterLink to="/products"
        class="inline-block mt-6 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full shadow-md transition">
        開始探索
      </RouterLink>
    </section>

    <!-- 精選玩具區 -->
    <section class="py-16 px-6 bg-white">
      <h2 class="text-3xl font-bold text-center mb-10">精選玩具</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div class="bg-yellow-50 rounded-lg shadow p-6 text-center">玩具卡片 A</div>
        <div class="bg-yellow-50 rounded-lg shadow p-6 text-center">玩具卡片 B</div>
        <div class="bg-yellow-50 rounded-lg shadow p-6 text-center">玩具卡片 C</div>
      </div>
    </section>

    <!-- 玩派故事區 -->
    <section class="py-16 px-6 bg-yellow-50">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <h2 class="text-3xl font-bold">關於玩派</h2>
        <p class="text-base md:text-lg leading-relaxed">
          我們是來自模型迷的電商平台，想讓你能夠安心逛、慢慢選，<br />
          把「看到玩具就笑出來」的快樂找回來。
        </p>
      </div>
    </section>

    <!-- 小南心聲語錄區 -->
    <section class="py-16 px-6 bg-white">
      <h2 class="text-3xl font-bold text-center mb-10">來自小南的心聲</h2>
      <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-gray-700">
        <div class="bg-yellow-100 p-6 rounded-xl shadow">
          「我只是進去晃晃，結果帶回了童年。」
        </div>
        <div class="bg-yellow-100 p-6 rounded-xl shadow">
          「不是收藏東西，是在收藏我生命中那些微小卻幸福的瞬間。」
        </div>
        <div class="bg-yellow-100 p-6 rounded-xl shadow">
          「我喜歡這些角色，也喜歡那個為它們著迷的自己。」
          <p class="text-sm text-right mt-4 text-yellow-700">—— 小南 / 玩具愛好者</p>
        </div>
      </div>
    </section>

    <!-- CTA 區 -->
    <section class="py-20 px-6 bg-yellow-200 text-center">
      <h2 class="text-3xl font-bold mb-4">找到喜歡的玩具了嗎？</h2>
      <p class="text-lg mb-6">註冊帳號，開始打造你的收藏清單 ✨</p>
      <RouterLink to="/register"
        class="inline-block px-6 py-3 bg-white text-yellow-600 font-semibold rounded-full shadow-md hover:bg-yellow-50 transition">
        立即註冊
      </RouterLink>
    </section>
  </main>
</template>
