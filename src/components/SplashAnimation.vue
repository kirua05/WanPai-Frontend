<script setup>
  import { ref, onMounted } from 'vue'

  defineProps({
    show: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(['hide'])

  const fadeOut = ref(false)

  onMounted(() => {
    setTimeout(() => {
      fadeOut.value = true
      setTimeout(() => {
        emit('hide')
      }, 800)
    }, 3000)
  })
</script>

<template>
  <div
    v-if="show"
    :class="[
      'fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-200 transition-opacity duration-800',
      fadeOut ? 'opacity-0' : 'opacity-100',
    ]"
  >
    <div class="text-center text-white space-y-4 relative z-50">
      <div class="animate-bounce">
        <img
          src="@/assets/logo.png"
          alt="WanPai Logo"
          class="h-80 w-auto mx-auto drop-shadow-2xl"
        />
      </div>

      <div
        class="space-y-3 animate-[fadeInUp_1s_ease-in_0.2s_both] -translate-y-20"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="relative inline-block leading-none whitespace-nowrap">
            <span
              class="absolute inset-0 text-[98px] md:text-[74px] font-bold tracking-tight text-yellow-600 -ml-[4px]"
            >
              玩派 WanPai
            </span>
            <h2
              class="relative text-[96px] md:text-[72px] font-bold tracking-tight text-white bg-clip-text drop-shadow-lg"
            >
              玩派 WanPai
            </h2>
          </div>
        </div>
        <p
          class="text-xl md:text-2xl text-yellow-600 max-w-md mx-auto leading-relaxed drop-shadow-sm animate-[fadeInOut_3s_ease-out_both] space-y-8 translate-y-4"
        >
          發現精彩模型世界
          <br />
          <span class="text-yellow-600">打造你的收藏夢想</span>
        </p>
      </div>

      <div
        class="flex justify-center space-x-8 mt-8 animate-[fadeInUp_1s_ease-out_0.8s_both] -translate-y-12"
      >
        <div
          class="text-center space-y-2 animate-[float_1.5s_ease-in-out_infinite] delay-[0.5s]"
        >
          <div
            class="w-16 h-16 mx-auto bg-white backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <i
              class="pi pi-star text-2xl text-yellow-500 animate-[spin_3s_linear_infinite]"
            ></i>
          </div>
          <p class="text-base text-yellow-500 font-semibold">精選商品</p>
        </div>
        <div
          class="text-center space-y-2 animate-[float_1.5s_ease-in-out_infinite] delay-[0.5s]"
        >
          <div
            class="w-16 h-16 mx-auto bg-white backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <i class="pi pi-truck text-2xl text-yellow-500 animate-bounce"></i>
          </div>
          <p class="text-base text-yellow-500 font-semibold">快速配送</p>
        </div>
        <div
          class="text-center space-y-2 animate-[float_1.5s_ease-in-out_infinite] delay-[0.5s]"
        >
          <div
            class="w-16 h-16 mx-auto bg-white backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <i class="pi pi-heart text-2xl text-yellow-500 animate-pulse"></i>
          </div>
          <p class="text-base text-yellow-500 font-semibold">用心服務</p>
        </div>
      </div>

      <div class="flex justify-center mt-8 -translate-y-12">
        <div class="flex space-x-4">
          <div
            class="w-5 h-5 bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full animate-bounce shadow-lg"
          ></div>
          <div
            class="w-5 h-5 bg-gradient-to-r from-teal-400 to-teal-300 rounded-full animate-bounce shadow-lg"
            style="animation-delay: 0.2s"
          ></div>
          <div
            class="w-5 h-5 bg-gradient-to-r from-blue-300 to-blue-200 rounded-full animate-bounce shadow-lg"
            style="animation-delay: 0.4s"
          ></div>
        </div>
      </div>
    </div>

    <div
      class="absolute top-10 left-10 w-24 h-24 border-2 border-yellow-400/50 rounded-full animate-[spin_20s_linear_infinite] bg-gradient-to-br from-yellow-300/20 to-amber-400/20"
    ></div>
    <div
      class="absolute bottom-20 right-16 w-20 h-20 border-2 border-amber-400/50 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_1s_infinite] bg-gradient-to-br from-amber-300/20 to-orange-400/20"
    ></div>
    <div
      class="absolute top-1/3 right-8 w-12 h-12 border-2 border-orange-400/50 rounded-full animate-bounce delay-500 bg-gradient-to-br from-orange-300/20 to-red-400/20"
    ></div>
    <div
      class="absolute bottom-1/3 left-8 w-16 h-16 border-2 border-yellow-500/50 rounded-full animate-pulse delay-1500 bg-gradient-to-br from-yellow-400/20 to-amber-500/20"
    ></div>

    <div
      class="absolute top-16 right-8 w-[400px] h-[400px] animate-[float_4s_ease-in-out_infinite] delay-[1s] opacity-80"
    >
      <img
        src="@/assets/figure.png"
        alt="Figure"
        class="w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
    <div
      class="absolute bottom-[-20px] left-0 w-[900px] h-[900px] animate-[float_5s_ease-in-out_infinite] delay-[2s] opacity-75"
    >
      <img
        src="@/assets/godzilla.png"
        alt="Godzilla"
        class="w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
    <div
      class="absolute top-1/2 right-64 w-[400px] h-[400px] animate-[float_3.5s_ease-in-out_infinite] delay-[1.5s] opacity-70"
    >
      <img
        src="@/assets/pink-figure.png"
        alt="Pink Figure"
        class="w-full h-full object-contain drop-shadow-2xl"
      />
    </div>

    <div
      class="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-60 delay-[2s]"
    ></div>
    <div
      class="absolute top-3/4 right-1/4 w-2 h-2 bg-amber-400 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-70 delay-[3s]"
    ></div>
    <div
      class="absolute bottom-1/4 left-1/3 w-4 h-4 bg-orange-400 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-50 delay-[4s]"
    ></div>
  </div>
</template>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateX(20px);
    }
    20% {
      opacity: 1;
      transform: translateX(0);
    }
    80% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-20px);
    }
  }
</style>
