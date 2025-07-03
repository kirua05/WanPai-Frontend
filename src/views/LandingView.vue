<script setup>
  import { ref, onMounted } from 'vue'
  import axios from '@/utils/axiosInstance'
  import { useToast } from 'primevue/usetoast'
  import { useRouter } from 'vue-router'
  import ScrollIndicator from '@/components/ScrollIndicator.vue'
  const router = useRouter()

  function goToProducts() {
    sessionStorage.setItem('wanpai_seen_splash', 'true')
    router.push('/products')
  }

  const toast = useToast()
  const isInView = ref(false)

  onMounted(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isInView.value = true
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    const el = document.querySelector('#xiaonan-section')
    if (el) observer.observe(el)
  })

  const showBlocks = ref(false)
  const showCar = ref(false)
  const showRobot = ref(false)
  const showDino = ref(false)

  const animated = {
    car: ref(false),
    robot: ref(false),
    dino: ref(false),
  }

  onMounted(() => {
    setTimeout(() => (showBlocks.value = true), 200)
    setTimeout(() => (showCar.value = true), 500)
    setTimeout(() => (showRobot.value = true), 800)
    setTimeout(() => (showDino.value = true), 1100)
  })

  const featuredProducts = ref([])

  onMounted(async () => {
    try {
      const res = await axios.get('/products')
      const shuffled = res.data.sort(() => 0.5 - Math.random())
      featuredProducts.value = shuffled.slice(0, 4)
    } catch {
      toast.add({
        severity: 'warn',
        summary: '載入失敗',
        detail: '無法載入精選商品，請稍後再試',
        life: 3000,
      })
    }
  })
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('xiaonan-section')
    if (aboutSection) {
      const offsetTop =
        aboutSection.getBoundingClientRect().top + window.pageYOffset
      const offset = offsetTop - 340

      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      })
    }
  }
  onMounted(() => {
    sessionStorage.setItem('wanpai_seen_splash', 'true')

    loadProducts()
  })
  async function loadProducts() {
    try {
      const res = await axios.get('/products')
      const shuffled = res.data.sort(() => 0.5 - Math.random())
      featuredProducts.value = shuffled.slice(0, 4)
    } catch {
      toast.add({
        severity: 'warn',
        summary: '載入失敗',
        detail: '無法載入精選商品，請稍後再試',
        life: 3000,
      })
    }
  }
</script>

<template>
  <main class="bg-white text-gray-800 overflow-x-hidden">
    <section
      class="relative bg-white px-6 pt-10 pb-22 md:pb-42 lg:pb-50 overflow-hidden"
    >
      <div class="absolute inset-0 z-0 pointer-events-none">
        <img
          src="@/assets/magicpattern-blob-1751124065159.png"
          alt="背景"
          class="absolute top-100 md:top-135 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-50 animate-float md:w-[1800px] md:opacity-80"
        />
      </div>

      <img
        v-if="showBlocks"
        src="@/assets/hero/BuildingBlocks.png"
        alt="積木屋"
        class="absolute z-10 pop-in w-[1000px] top-[80px] left-10 md:left-40 2xl:left-[15%] 2xl:w-[1200px]"
      />
      <div
        v-if="showCar"
        class="hidden md:block absolute z-10 pop-in w-56 bottom-8 left-[110px] top-[60px] rotate-[-6deg] 2xl:left-[12%] 2xl:w-[280px]"
        @animationend="animated.car = true"
      >
        <img
          src="@/assets/hero/Racing.png"
          :class="animated.car ? 'slow-spin' : ''"
          alt="賽車"
        />
      </div>
      <div
        v-if="showRobot"
        class="hidden md:block absolute z-10 pop-in top-[12%] right-[70px] w-40 2xl md:right-[10%] md:w-[180px]"
        @animationend="animated.robot = true"
      >
        <img
          src="@/assets/hero/Robot.png"
          :class="animated.robot ? 'soft-bounce' : ''"
          alt="機器人"
        />
      </div>
      <div
        v-if="showDino"
        class="hidden md:block absolute z-10 pop-in bottom-25 right-[140px] w-[330px] 2xl:right-[10%] 2xl:w-[400px]"
        @animationend="animated.dino = true"
      >
        <img
          src="@/assets/hero/monsters.png"
          :class="animated.dino ? 'float-x' : ''"
          alt="恐龍"
        />
      </div>

      <div
        class="relative z-30 text-center space-y-6 max-w-[90%] mt-62 md:mt-0 md:max-w-3xl mx-auto pt-0 md:pt-5"
      >
        <div class="-mt-68 relative z-30 flex justify-center md:-mt-20">
          <img
            src="@/assets/logo.png"
            alt="玩派 logo"
            class="h-28 md:h-75 w-auto"
          />
        </div>
        <h1
          class="text-7xl md:text-8xl font-extrabold text-gray-800 leading-tight mt-60 md:-mt-10"
        >
          玩派
        </h1>
        <p
          class="text-gray-800 text-2xl md:text-3xl font-extrabold -mt-4 md:-mt-4"
        >
          尋找屬於你的命定玩具
        </p>
        <p class="text-xl text-gray-600 mt-0">陪你打造專屬的收藏宇宙</p>

        <div class="mt-6 flex justify-center gap-4 md:pb-42 lg:pb-52">
          <button
            @click="goToProducts"
            class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full shadow-md transition cursor-pointer"
          >
            開始探索
          </button>
          <button
            @click="scrollToAbout"
            class="px-6 py-3 bg-white text-yellow-500 border-2 border-yellow-400 hover:bg-yellow-100 font-semibold rounded-full shadow-md transition cursor-pointer"
          >
            關於玩派
          </button>
        </div>
      </div>
      <ScrollIndicator />
    </section>

    <section class="py-16 px-6 bg-white -mt-10 md:mt-16">
      <h2 class="text-3xl font-bold text-center mb-10">精選玩具</h2>
      <div
        class="flex overflow-x-auto scrollbar-hide gap-6 items-stretch justify-cente max-w-6xl mx-auto px-2 min-h-[280px]"
      >
        <RouterLink
          v-for="item in featuredProducts"
          :key="item.id"
          :to="`/products/${item.id}`"
          class="flex-shrink-0 w-64 bg-yellow-50 rounded-xl shadow p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-300"
        >
          <div class="flex flex-col items-center cursor-pointer">
            <img
              :src="
                item.coverImage ||
                item.images?.[0]?.imgUrl ||
                'https://via.placeholder.com/150'
              "
              alt="商品圖片"
              class="w-32 h-32 object-contain mb-4"
            />
            <h3 class="text-lg font-semibold text-gray-800 text-center">
              {{ item.name }}
            </h3>
          </div>
          <p class="text-yellow-600 font-bold text-center mt-4">
            NT$ {{ item.price }}
          </p>
        </RouterLink>
      </div>
    </section>

    <section class="block px-6 py-24 relative h-[600px] overflow-hidden mt-5">
      <img
        src="/src/assets/story-bg.png"
        alt="裝飾背景"
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1200px] rounded-[30px] md:rounded-[60px] z-0"
      />

      <div
        class="relative z-10 max-w-7xl mx-auto flex flex-row gap-10 items-center h-full"
      >
        <div
          id="xiaonan-section"
          class="w-full md:w-7/12 space-y-6 text-center mx-auto px-4 -mt-83 md:mt-0"
        >
          <h2
            class="text-2xl md:text-5xl text-yellow-700 mt-[-60px] font-extrabold"
          >
            關於玩派
          </h2>
          <p class="text-ml text-gray-700 leading-relaxed">
            我們不是賣玩具給小孩，
            <br />
            而是把玩具的快樂，還給大人。
            <br />
            讓你在探索的路上不再迷路。
          </p>
          <p class="hidden md:block text-sm text-gray-600 mt-20">
            靈感來自一位總是「只是晃晃」卻空手而回的模型控——我們的朋友小南。
          </p>
        </div>

        <div class="hidden md:block w-5/12 pr-4" id="xiaonan-section">
          <div class="max-w-sm">
            <h3 class="text-2xl font-bold text-gray-800 mb-4" v-show="isInView">
              來自小南的心聲
            </h3>
          </div>
          <div v-show="isInView" class="space-y-4 max-w-sm">
            <div
              class="bg-white p-4 rounded-xl shadow pop-in"
              style="animation-delay: 200ms"
            >
              「我只是進去晃晃，結果帶回了童年。」
            </div>
            <div
              class="bg-white p-4 rounded-xl shadow pop-in"
              style="animation-delay: 400ms"
            >
              「不是收藏東西，是在收藏我生命中那些微小卻幸福的瞬間。」
            </div>
            <div
              class="bg-white p-4 rounded-xl shadow pop-in"
              style="animation-delay: 600ms"
            >
              「我喜歡這些角色，也喜歡那個為它們著迷的自己。」
              <p class="text-sm text-right mt-2 text-yellow-700">
                —— 小南 / 玩具迷
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="overflow-hidden bg-white py-4 -mt-90">
      <div class="flex marquee-fast w-max">
        <p
          class="text-[56px] font-black tracking-widest text-yellow-700 uppercase px-6 min-w-max"
          style="font-family: 'Baloo 2', cursive"
        >
          TAKARATOMY ✦ MEGAHOUSE ✦ KAIYODO ✦ GOOD SMILE ✦ JXK ✦ BANDAI ✦ AOSHIMA
          ✦ PROOF ✦
        </p>
        <p
          class="text-[56px] font-black tracking-widest text-yellow-700 uppercase px-6 min-w-max"
          style="font-family: 'Baloo 2', cursive"
        >
          TAKARATOMY ✦ MEGAHOUSE ✦ KAIYODO ✦ GOOD SMILE ✦ JXK ✦ BANDAI ✦ AOSHIMA
          ✦ PROOF ✦
        </p>
      </div>
    </section>

    <section class="bg-yellow-50 px-6 py-20">
      <div
        class="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-12 min-h-[300px]"
      >
        <div
          class="w-full md:w-1/2 flex flex-col items-center justify-center text-center space-y-4"
        >
          <img src="@/assets/hero/Racing.png" alt="賽車插圖" class="w-32" />
          <h2 class="text-2xl font-bold text-gray-800">
            從懷舊到新歡，讓喜歡有個地方落腳。
          </h2>
          <p class="text-gray-700">尋找你的命定玩具，開始建立你的玩具宇宙。</p>
          <RouterLink
            to="/products"
            class="inline-block mt-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full shadow-md transition cursor-pointer"
          >
            前往瀏覽商品
          </RouterLink>
        </div>

        <div class="w-full md:w-px bg-gray-400 md:block hidden"></div>

        <div
          class="w-full md:w-1/2 flex flex-col items-center justify-center text-center space-y-4"
        >
          <img src="@/assets/hero/Robot.png" alt="機器人插圖" class="w-19" />
          <h2 class="text-2xl font-bold text-gray-800 -mt-1">
            找到喜歡的玩具了嗎？
          </h2>
          <p class="text-gray-700">註冊帳號，開始打造你的收藏清單 ✨</p>
          <RouterLink
            to="/authform"
            class="inline-block mt-2 px-6 py-3 bg-white text-yellow-600 font-semibold rounded-full shadow-md hover:bg-yellow-100 transition cursor-pointer"
          >
            立即註冊
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
