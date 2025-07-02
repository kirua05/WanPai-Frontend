<script setup>
  import { ref, reactive, nextTick, onMounted } from 'vue'
  import axios from '@/utils/axiosInstance'

  const isExpanded = ref(false)
  const currentMessage = ref('')
  const isLoading = ref(false)
  const messagesContainer = ref(null)
  const messageInput = ref(null)
  const isComposing = ref(false)
  const messages = reactive([
    {
      id: 1,
      text: '你好！我是玩派小助手，有什麼我可以為你推薦的系列商品嗎？',
      isUser: false,
      timestamp: new Date(),
    },
  ])

  const toggleChat = () => {
    isExpanded.value = !isExpanded.value
    if (isExpanded.value) {
      nextTick(() => {
        scrollToBottom()
        // 自動聚焦到input框
        if (messageInput.value) {
          messageInput.value.focus()
        }
      })
    }
  }

  // 處理輸入法狀態
  const handleCompositionStart = () => {
    isComposing.value = true
  }

  const handleCompositionEnd = () => {
    isComposing.value = false
  }

  // 處理 Enter 鍵，區分輸入法選詞和真正的發送
  const handleKeydown = (event) => {
    if (event.key === 'Enter' && !isComposing.value) {
      event.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.value.trim() || isLoading.value) return

    const userMessage = {
      id: Date.now(),
      text: currentMessage.value,
      isUser: true,
      timestamp: new Date(),
    }

    messages.push(userMessage)
    const messageText = currentMessage.value
    currentMessage.value = ''
    isLoading.value = true
    let aiMessageIndex

    await nextTick()
    scrollToBottom()

    try {
      const response = await axios.post('/ai/chat', {
        message: messageText,

        history: messages.slice(-10).map((msg) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text,
        })),
      })

      const aiMessage = {
        id: Date.now() + 1,
        text:
          response.data.reply ||
          response.data.message ||
          '抱歉，我現在無法回答這個問題。',
        isUser: false,
        timestamp: new Date(),
      }

      messages.push(aiMessage)

      aiMessageIndex = messages.length - 1
    } catch (error) {
      error
      const errorMessage = {
        id: Date.now() + 1,
        text: '抱歉，服務暫時不可用，請稍後再試。',
        isUser: false,
        timestamp: new Date(),
      }
      messages.push(errorMessage)

      aiMessageIndex = messages.length - 1
    } finally {
      isLoading.value = false
      await nextTick()

      if (typeof aiMessageIndex !== 'undefined') {
        setTimeout(() => {
          scrollToMessage(aiMessageIndex)
        }, 100)
      } else {
        scrollToBottom()
      }

      // AI回答完成後自動聚焦回input框，方便連續提問
      if (messageInput.value) {
        messageInput.value.focus()
      }
    }
  }

  const scrollToBottom = () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }

  const scrollToMessage = (messageIndex) => {
    if (messagesContainer.value && messageIndex >= 0) {
      const messageElements =
        messagesContainer.value.querySelectorAll('.message-item')
      if (messageElements[messageIndex]) {
        messageElements[messageIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 清理和安全化HTML内容 - 保留後端回傳的 a 標籤和 br 標籤
  const sanitizeHtml = (html) => {
    if (!html) return ''

    // 只過濾掉危險的標籤，保留 br 和 a 標籤
    return html
      .replace(/<br\s*\/?>/gi, '<br>')
      .replace(/<(?!br\s*\/?>|a\s+[^>]*href[^>]*>|\/a>)[^>]+>/gi, '')
  }

  const handleLinkClick = (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault()
      const href = event.target.getAttribute('href')
      if (href) {
        window.open(href, '_blank')
      }
    }
  }

  onMounted(() => {})
</script>

<template>
  <div class="fixed bottom-3 right-3 z-[1000] font-sans sm:bottom-5 sm:right-5">
    <div
      v-if="!isExpanded"
      @click="toggleChat"
      class="flex items-center gap-1 bg-yellow-500 text-white py-2 px-3 rounded-full cursor-pointer shadow-lg shadow-yellow-500/40 transition-all duration-300 ease-in-out text-xs font-medium hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/60 sm:gap-2 sm:py-3 sm:px-5 sm:text-sm md:gap-2"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-shrink-0 sm:w-6 sm:h-6"
      >
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H6L10 22L14 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        />
        <path
          d="M8 9H16M8 13H12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span class="hidden sm:inline">玩派小助手</span>
      <span class="sm:hidden">助手</span>
    </div>

    <div
      v-if="isExpanded"
      class="bg-white rounded-xl w-[280px] h-[400px] shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 xs:w-[260px] xs:h-[380px] sm:w-[320px] sm:h-[450px] md:w-[350px] md:h-[500px] max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-4rem)]"
    >
      <div
        class="bg-yellow-500 text-white px-3 py-3 flex justify-between items-center sm:px-5 sm:py-4"
      >
        <h3 class="m-0 text-sm font-semibold sm:text-base">玩派小助手</h3>
        <button
          @click="toggleChat"
          class="bg-white/20 border border-white/30 text-white cursor-pointer p-1 rounded-md transition-all duration-200 font-bold w-6 h-6 flex items-center justify-center hover:bg-white/30 hover:border-white/50 hover:scale-110 sm:p-1.5 sm:w-7 sm:h-7"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="sm:w-4 sm:h-4"
          >
            <path
              d="M8 6.293l2.146-2.147a.5.5 0 01.708.708L8.707 7l2.147 2.146a.5.5 0 01-.708.708L8 7.707l-2.146 2.147a.5.5 0 01-.708-.708L7.293 8 5.146 5.854a.5.5 0 01.708-.708L8 6.293z"
            />
          </svg>
        </button>
      </div>

      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-3 bg-slate-50 sm:p-4"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'mb-3 animate-in fade-in slide-in-from-bottom-1 duration-300 message-item sm:mb-4',
            message.isUser
              ? 'flex flex-col items-end'
              : 'flex flex-col items-start',
          ]"
        >
          <div
            class="max-w-[85%] py-2 px-3 rounded-[16px] text-xs leading-relaxed sm:max-w-[80%] sm:py-3 sm:px-4 sm:rounded-[18px] sm:text-sm"
            :class="
              message.isUser
                ? 'bg-yellow-500 text-white rounded-br-sm'
                : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm'
            "
            v-html="sanitizeHtml(message.text)"
            @click="handleLinkClick"
          ></div>
          <div class="text-[10px] text-gray-400 mt-1 mx-2 sm:text-xs">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>

        <div
          v-if="isLoading"
          class="mb-3 animate-in fade-in slide-in-from-bottom-1 duration-300 flex flex-col items-start message-item sm:mb-4"
        >
          <div
            class="max-w-[85%] px-3 py-2 rounded-[16px] text-xs leading-relaxed bg-white text-gray-700 border border-gray-200 rounded-bl-sm flex items-center gap-2 sm:max-w-[80%] sm:px-4 sm:py-3 sm:rounded-[18px] sm:text-sm"
          >
            <div class="flex gap-1">
              <span
                class="w-1 h-1 rounded-full bg-gray-400 animate-bounce opacity-50 sm:w-1.5 sm:h-1.5"
              ></span>
              <span
                class="w-1 h-1 rounded-full bg-gray-400 animate-bounce opacity-50 [animation-delay:0.1s] sm:w-1.5 sm:h-1.5"
              ></span>
              <span
                class="w-1 h-1 rounded-full bg-gray-400 animate-bounce opacity-50 [animation-delay:0.2s] sm:w-1.5 sm:h-1.5"
              ></span>
            </div>
            小助手正在思考中
          </div>
        </div>
      </div>

      <div class="p-3 bg-white border-t border-gray-200 sm:p-4">
        <div class="flex gap-2 items-center">
          <input
            ref="messageInput"
            v-model="currentMessage"
            @keydown="handleKeydown"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            placeholder="輸入你的問題..."
            :disabled="isLoading"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-full text-xs outline-none transition-colors duration-200 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed sm:px-4 sm:py-3 sm:text-sm"
          />
          <button
            @click="sendMessage"
            :disabled="!currentMessage.trim() || isLoading"
            class="bg-yellow-500 text-white border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none sm:w-10 sm:h-10"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="sm:w-4 sm:h-4"
            >
              <path
                d="M15.854 7.354l-7-7a.5.5 0 00-.708.708L14.293 7H1.5a.5.5 0 000 1h12.793l-6.147 6.146a.5.5 0 00.708.708l7-7a.5.5 0 000-.708z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
