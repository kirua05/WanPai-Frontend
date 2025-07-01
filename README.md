# WanPai 玩派 - 前端專案
<img width="302" alt="image" src="https://github.com/user-attachments/assets/2292f271-7947-4849-acf8-aae897ba004f" />

## 簡介

本專案為「WanPai 玩派」模型電商網站的前端程式碼庫。採用 Vue 3、Tailwind CSS 及 PrimeVue 技術，透過 Vite 架設開發環境，並串接基於 Express 的 RESTful API。功能涵蓋商品瀏覽、搜尋、購物流程與後台管理系統，提供完整的使用與管理體驗。

## 專案由來

專案靈感來自於組員小南的困擾，

每次小南逛模型逛到想買的時候，卻總是缺乏即時的關鍵商品資訊，讓他難以下定決心，

總是逛老半天又空手而歸，逛街探索體驗不佳。

我們打造了一個模型玩具電商平台，提供簡單的標籤分類和搜尋，讓消費者輕鬆尋找喜愛的商品，

商家後台也可以上傳詳細的商品圖文介紹與開箱影片，讓消費者在線上仔細查看商品的每個角度。

**玩派希望讓所有像小南一樣的模型玩具愛好者，都可以在線上享受實體逛街般的樂趣。**


**[>> 點擊進入玩派 <<](https://wanpai-frontend.zeabur.app/)**

## 主要功能
使用者可註冊登入會員，探索商品並加入收藏，加入購物車後可選擇商品及數量結帳。
商家帳號有權限開啟後台管理頁面，自由上下架商品，編輯商品資訊、管理商品及訂單。

<img width="590" alt="image" src="https://github.com/user-attachments/assets/9ff9bfe0-8ad3-45eb-b45a-c7220d435aee" />
<img width="588" alt="image" src="https://github.com/user-attachments/assets/3622479d-67ad-4d72-820d-8f43b4b6788c" />
<img width="586" alt="image" src="https://github.com/user-attachments/assets/7452451e-5996-481b-9833-8d24fe3a091a" />
<img width="582" alt="image" src="https://github.com/user-attachments/assets/101a6e88-7073-4bcb-90be-e3699f997447" />

## 安裝步驟

1. Clone 此 Repository

```bash
 git clone https://github.com/wanpai-app/frontend.git
 cd frontend
```

2. 安裝 npm 相關套件

```bash
 npm install
```

3. 設定環境變數
   建立 `.env` 檔案，並依照 `.env.production` 或下方格式填入必要變數：

```
VITE_API_BASE_URL=https://your-real-api.com/api
```

4. 啟動開發伺服器

```bash
 npm run dev
```

## 技術使用

本專案使用了以下技術和工具：

- Vue 3 + Vite
- Tailwind CSS
- PrimeVue

## 團隊成員

- 彭芷儀 [GitHub](https://github.com/yura813)
  - 新增編輯商品功能
  - 後台訂單管理
  - 資料庫
 
- 張馨云 [GitHub](https://github.com/kirua05)
  - Python 爬蟲清理商品資料，匯入至 PostgreSQL 資料庫
  - 單一商品頁面
  - AWS S3 雲端資料庫連接
   
- 林欣雨 [GitHub](https://github.com/Raelin930)
  - 訂單管理頁面實作
  - 訂單 API
  - 網站 Landing Page
    
- 巫坤郁 [GitHub](https://github.com/kenyykd)
  - 串接綠界金流
  - 購物車詳細資料切版
  - 商品標籤
  - AI 串接
   
- 謝聿涵 [GitHub](https://github.com/hsiehyuhan)
  - 購物車頁面
  - 串接購物車 API
  - 資料庫
  - 加入購物車
 
- 侯建男 [GitHub](https://github.com/Nannn1997)
  - 網站首頁切版
  - 商品資料串接
  - 搜尋商品功能
  - ZeaBur 部署專案
 
- 楊子毅 [GitHub](https://github.com/ziyi1998)
  - 登入註冊功能
  - 會員編輯資料功能
  - 第三方登入
  - 資料庫
  
- 吳禹慧 [GitHub](https://github.com/rosewuuu)
  - 通知頁面
  - 收藏功能
  - 資料庫

## 其他

本專案為課程小組專案，僅供學術用途。
