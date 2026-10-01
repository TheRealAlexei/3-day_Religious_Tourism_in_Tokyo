// ==========================================
// 72H Tokyo Strategic Blueprint - Script
// ==========================================

// ---------- i18n Translation System ----------
const i18n = {
  "zh-Hant": {
    "nav_itinerary": "行程介紹",
    "nav_themes": "主題",
    "nav_budget": "經費",
    "nav_team": "團隊介紹",
    "hero_tag": "Tokyo Strategic Blueprint / 2026 Edition",
    "hero_title": "72小時東京極效週末",
    "hero_subtitle": "霓虹與線香的雙重濾鏡",
    "hero_desc": "空間解構與文化導覽：從神佛習合的底蘊，重新定義東京極大化體驗",
    "hero_cta": "探索行程 &darr;",
    "intro_title": "捨棄冗餘，提煉文化核心",
    "intro_lead": "將傳統 5 日行程中過爛的鋪陳點俐落捨棄，保留五大核心區域。真正的極致旅遊不在於打卡數量，而在於「看懂」這座城市。",
    "area_akiba": "秋葉原",
    "area_akiba_desc": "科技霓虹・次元文化",
    "area_asakusa": "淺草",
    "area_asakusa_desc": "千年古寺・下町風情",
    "area_ueno": "上野",
    "area_ueno_desc": "文化殿堂・庶民市場",
    "area_shibuya": "澀谷",
    "area_shibuya_desc": "潮流十字・年輕脈動",
    "area_shinjuku": "新宿",
    "area_shinjuku_desc": "不夜城市・極致夜景",
    "track1_title": "精準物流動線",
    "track1_desc": "以 JR 山手線為軸心，最小化交通時間，最大化體驗密度。",
    "track2_title": "心靈文化導覽",
    "track2_desc": "穿梭於現代科技感與傳統線香之中，雙軌藍圖無縫疊加。",
    "itin_title": "72 小時行程總覽",
    "itin_lead": "從降落到撤退，每一刻都經過精密計算。",
    "map_heading": "72 小時旅遊地圖：線香、霓虹與回東京座標",
    "map_subtitle": "高亮 Day 1-3 路線，標記神田明神、淺草神社、上野東照宮、明治神宮與主要地標；縮小到日本尺度時可點金色菱形回到東京。",
    "map_btn_home": "回到東京原點",
    "map_note": "* 地圖標示 72 小時高亮路線、神社寺院、知名地標、交通節點與國土尺度東京錨點",
    "d1_title": "降落與科技霓虹之夜",
    "d1_t1_h": "抵達成田機場 (NRT)",
    "d1_t1_p": "搭乘 <strong>Skyliner</strong>（單程約 &yen;2,570，41 分鐘）直達日暮里，無縫轉乘 JR 山手線抵達秋葉原。",
    "d1_t2_h": "戰略基地建置",
    "d1_t2_p": "東京都千代田區神田佐久間町。完美卡位 JR 山手線與地鐵交通樞紐，節省每日往返通勤的隱形成本。",
    "d1_t3_h": "秋葉原探索",
    "d1_t3_p": "卸下行李後，直奔日本最大電器街與動漫聖地。感受東京獨有的都市叢林與高畫質霓虹。每一種小眾狂熱都有其歸屬 —— 這正是「八百萬神」在現代文化中的變體延伸。",
    "d1_t4_h": "晚餐：在地居酒屋 / 連鎖定食",
    "d1_t4_p": "快速補給體力。預算 &yen;1,500~3,500。",
    "d1_tip_cat1": "居酒屋",
    "d1_tip_r1": "養老乃瀧 / 鳥貴族 — 串燒、刺身拼盤",
    "d1_tip_cat2": "連鎖定食",
    "d1_tip_r2": "松屋 / 吉野家 — 牛丼、咖哩飯",
    "d1_tip_cat3": "拉麵",
    "d1_tip_r3": "九州じゃんがら / 一蘭 — 濃厚豚骨",
    "d1_t5_p": "購買 <strong>Suica</strong> 或 1日/2日地鐵券（約 &yen;600~800），為接下來的高密度移動建立運作基礎。",
    "d2_title": "神聖與世俗的完整一日",
    "d2_t1_h": "早餐：便利商店",
    "d2_t1_p": "高效解決。預算 &yen;300~600。推薦 7-11 飯糰、FamilyMart 三明治。",
    "d2_t2_h": "上午：淺草 (Asakusa)",
    "d2_t2_p": "從東京最古老的寺廟出發。穿過雷門與仲見世通，實際上是從世俗世界逐步進入神聖空間的「淨化」過程。淺草寺旁緊鄰「淺草神社」—— 佛教觀音與神道教比鄰而居，是活生生的「神佛習合」。",
    "d2_t3_h": "中午：上野 (Ueno)",
    "d2_t3_p": "漫步上野恩賜公園，切換至阿美橫丁體驗下町都市的強大生命力。",
    "d2_t4_h": "午餐：阿美橫丁平價美食",
    "d2_t4_p": "預算 &yen;800~1,500。海鮮丼、串燒、炸物應有盡有。",
    "d2_t5_h": "交通轉場：JR 山手線 東 &rarr; 西",
    "d2_t5_p": "從上野搭乘 JR 山手線前往澀谷 / 新宿方向，車程約 25-30 分鐘。",
    "d2_t6_h": "傍晚：澀谷 (Shibuya)",
    "d2_t6_p": "直擊年輕文化中心「澀谷十字路口」，世界最繁忙的行人穿越道。感受現代東京的脈動。",
    "d2_t7_h": "晚餐：新宿周邊",
    "d2_t7_p": "入夜後轉戰新宿，沒入百貨商圈與歌舞伎町的迷人夜景。享用拉麵或燒肉。",
    "d2_t8_h": "夜晚：新宿 (Shinjuku)",
    "d2_t8_p": "如果早上的淺草代表對「來世與傳統」的敬畏，晚上的新宿則代表對「現世與物質」的極致追求。這正是東京雙重性格的完美調和。",
    "d3_title": "完美撤退與最終衝刺",
    "d3_t1_h": "09:00 - 12:00 最終補給",
    "d3_t1_p": "於秋葉原基地周邊或上野進行最後的伴手禮與藥妝採購。以基地為中心，無需提著大包小包跨區移動。",
    "d3_t2_h": "13:00 - 14:00 戰略撤退",
    "d3_t2_p": "返回飯店提取行李，搭乘 JR 山手線至日暮里。",
    "d3_t3_h": "14:30 - 15:30 高速直達",
    "d3_t3_p": "搭乘 Skyliner（約 &yen;2,570）平穩快速返回成田機場。",
    "d3_t4_h": "傍晚 滿載歸途",
    "d3_t4_p": "搭機返回，完美結束 72 小時兼具文化深度與執行效率的週末。",
    "tag_transport": "交通",
    "tag_stay": "住宿",
    "tag_culture": "文化",
    "tag_food": "餐飲",
    "tag_tip": "小提示",
    "tag_shopping": "採購",
    "themes_title": "主題深度探索",
    "themes_lead": "透過信仰的濾鏡，深度解鎖東京的文化底蘊與精神世界。",
    "rel_sub": "神佛習合 &mdash; Shinbutsu-Shūgō",
    "rel_intro": "在日本，宗教不是排他的信仰，而是各取所需的「生活工具」。神道教與佛教歷經千年融合，形成獨特的「神佛習合」體系 &mdash; 這構成了東京包容萬物的獨特底色，也是理解這座城市最深層的鑰匙。",
    "rel_birth": "<strong>出生在神道：</strong>掌管「生」與「現世利益」。嬰兒出生後的「宮參」（初參拜）在神社進行，祈求神明庇佑健康成長。",
    "rel_love": "<strong>結婚在基督：</strong>追求浪漫與儀式感。超過 60% 的日本婚禮選擇西式教堂，展現對外來文化的借鑑與實用主義。",
    "rel_death": "<strong>死後去佛教：</strong>掌管「死」與「來世」。超過 90% 的日本葬禮由佛教寺院主持，追求彼岸解脫與脫離輪迴。",
    "rel_shinto_h": "神道教 Shinto",
    "rel_buddhism_h": "佛教 Buddhism",
    "mapping_title": "空間映射：跨越心靈象限",
    "axis_spiritual": "精神 / 神聖",
    "axis_material": "物質 / 世俗",
    "axis_traditional": "傳統",
    "axis_modern": "現代",
    "q_meiji": "明治神宮",
    "q_meiji_desc": "神道教的靜謐結界",
    "q_asakusa_ueno": "淺草 / 上野",
    "q_asakusa_ueno_desc": "佛教寺院與下町風情",
    "q_shinjuku_shibuya": "新宿 / 澀谷",
    "q_shinjuku_shibuya_desc": "潮流不夜城",
    "q_akiba": "秋葉原",
    "q_akiba_desc": "現代的「八百萬神」崇拜",
    "budget_title": "成本價值重構",
    "budget_lead": "用最精簡的資源，買到最濃縮的精華。",
    "budget_fixed": "固定成本 Fixed",
    "budget_flights": "機票",
    "budget_skyliner": "Skyliner 來回",
    "budget_skyliner_val": "約 NT$1,100",
    "budget_variable": "變動成本 Variable",
    "budget_hotel": "住宿 (2晚)",
    "budget_meals": "餐飲 (3日)",
    "budget_transit": "市區交通 (3日)",
    "budget_total": "基礎體驗總預算",
    "budget_note": "(起)",
    "budget_philosophy": "捨棄兩天的走馬看花，將預算省下，換取 72 小時無間斷的「高純度」文化與感官體驗。",
    "team_title": "團隊介紹",
    "team_lead": "龍華科技大學 遊憩數媒實作課程",
    "team_member": "團隊成員",
    "taichi_neon": "霓虹",
    "taichi_neon_desc": "世俗 / 新宿 / 澀谷",
    "taichi_incense": "線香",
    "taichi_incense_desc": "神聖 / 淺草 / 上野",
    "closing_title": "在霓虹與線香之間，<br>找到屬於你的東京",
    "closing_text": "東京的偉大，不在於它有多現代化，而在於它從未要求人們在「神聖」與「世俗」之間做出選擇。",
    "closing_quote": "出生在神道，死後去佛教；早晨參拜淺草，夜晚迷失新宿。<br>這不僅是地理移動，更是體現日本人「包容萬物、各取所需」生活哲學的深度之旅。",
    "closing_cta": "帶上文化濾鏡，重新出發。",
    "footer_course": "龍華科技大學 &middot; 遊憩數媒實作課程",
    "rel_lifecycle_title": "生命的三重信仰",
    "rel_lifecycle_desc": "日本人的一生，穿梭於不同宗教之間，各取所需，毫無矛盾。",
    "rel_compare_title": "兩大信仰體系對照",
    "rel_shinto_l1": "核心追求：「淨」，避免「穢」",
    "rel_shinto_l2": "信仰對象：八百萬神（自然萬物皆有靈）",
    "rel_shinto_l3": "代表建築：神社 (Shrine)",
    "rel_shinto_l4": "核心標誌：鳥居（結界，分隔神聖與世俗）",
    "rel_shinto_l5": "參拜方式：二拜二拍手一拜",
    "rel_shinto_l6": "關注領域：現世利益、生育、祈福",
    "rel_buddhism_l1": "核心追求：「悟」，超越現世苦難",
    "rel_buddhism_l2": "信仰對象：佛陀、菩薩、明王",
    "rel_buddhism_l3": "代表建築：寺廟 / 佛塔 (Temple)",
    "rel_buddhism_l4": "核心標誌：佛像、蓮花、法輪",
    "rel_buddhism_l5": "參拜方式：合掌、焚香、念佛",
    "rel_buddhism_l6": "關注領域：來世解脫、喪葬、超度",
    "rel_spots_title": "72 小時神聖座標",
    "rel_spots_desc": "本行程中造訪的重要信仰地標，見證神佛習合的活歷史。",
    "rel_spot_shrine_badge": "神社",
    "rel_spot_temple_badge": "寺院",
    "rel_spot1_h": "神田明神",
    "rel_spot1_loc": "秋葉原 &middot; Day 1",
    "rel_spot1_desc": "守護江戶三大祭之一「神田祭」的千年古社。從秋葉原的霓虹走幾步路，便能踏入結界之內 &mdash; 現代御宅文化與古老神道信仰的驚人並置。IT 安全守護御守是科技時代的獨特產物。",
    "rel_spot2_h": "淺草神社",
    "rel_spot2_loc": "淺草 &middot; Day 2",
    "rel_spot2_desc": "與淺草寺比鄰而居的神道神社，供奉發現觀音像的三位漁師。佛教觀音與神道教在同一境內共存，是「神佛習合」最直觀的活教材。",
    "rel_spot3_h": "淺草寺（金龍山）",
    "rel_spot3_loc": "淺草 &middot; Day 2",
    "rel_spot3_desc": "東京最古老的佛教寺院，建於 628 年。穿過雷門、仲見世通，是從世俗逐步走入神聖空間的「參道淨化」過程。香爐的線香裊裊升起，信眾以煙撲身祈求消災。",
    "rel_spot4_h": "明治神宮",
    "rel_spot4_loc": "原宿 / 澀谷",
    "rel_spot4_desc": "佇立於 70 萬棵樹木的人造森林中，供奉明治天皇與昭憲皇太后。從喧鬧的原宿竹下通到神宮的大鳥居，僅一步之遙便從「世俗」跨入「神聖」&mdash; 東京雙重性格的完美縮影。",
    "rel_insight": "「日本人不是無宗教，而是超宗教。他們用神道迎接生命，用基督教慶祝愛情，用佛教安頓死亡。這不是信仰的混亂，而是一種極致的實用主義 &mdash; 萬物皆可為我所用，各取所需、和而不同。理解了這一點，你才能真正讀懂東京的每一座鳥居與每一縷線香。」",
    "kanda_page_title": "神田明神 Kanda Myojin | 傳統與科技的交匯",
    "kanda_back": "Back to 72H",
    "kanda_nav_about": "關於神田",
    "kanda_nav_cyber": "賽博御守",
    "kanda_nav_access": "交通座標",
    "kanda_badge": "鎮座1300年",
    "kanda_title": "神田明神",
    "kanda_subtitle": "Kanda Myojin",
    "kanda_desc": "江戶總鎮守。守護著秋葉原的繁華與科技，這裡不僅是傳統信仰的結界，更是御宅文化與IT產業的精神堡壘。",
    "kanda_about_h": "跨越千年的江戶總鎮守",
    "kanda_about_p1": "神田明神擁有近1300年的歷史，是東京地區最重要的神社之一。它不僅是「江戶三大祭」之一的神田祭舉辦地，更因為地處秋葉原（Akihabara）的邊緣，在現代成為了科技與傳統交匯的獨特場所。",
    "kanda_about_p2": "從將軍到平民，再到如今的工程師、動漫迷與企業家，神田明神始終張開雙臂，包容著這座城市每一個時代的「現世祈願」。",
    "kanda_cyber_title": "科技與信仰的融合",
    "kanda_cyber_lead": "IT情報安全守護、動漫聯名與賽博祈福",
    "kanda_cyber_1_h": "IT情報安全守護御守",
    "kanda_cyber_1_p": "針對現代社會的特殊需求，神田明神推出了專門保佑電腦不當機、防範病毒與資訊外洩的「IT御守」，是秋葉原工程師們的必備護身符。",
    "kanda_cyber_2_h": "動漫聖地巡禮",
    "kanda_cyber_2_p": "作為《LoveLive!》等知名動漫的取景地，神社境內掛滿了畫著精美動漫角色的「痛繪馬」，展現了八百萬神在現代二次元文化中的驚人包容力。",
    "kanda_cyber_3_h": "EDOCCO 文化交流館",
    "kanda_cyber_3_p": "境內新建的現代化設施，結合了傳統祭典展示、伴手禮商店與咖啡廳，將神道教的文化體驗以更具設計感的方式傳遞給年輕一代。",
    "kanda_access_h": "📍 戰略座標",
    "kanda_access_addr_l": "地址：",
    "kanda_access_addr_v": "東京都千代田區外神田2-16-2",
    "kanda_access_trans_l": "交通：",
    "kanda_access_trans_1": "JR 中央線/總武線「御茶之水站」步行 5 分鐘",
    "kanda_access_trans_2": "JR 山手線/京濱東北線「秋葉原站」步行 7 分鐘",
    "kanda_access_trans_3": "東京地下鐵銀座線「末廣町站」步行 5 分鐘",
    "kanda_access_time_l": "開放時間：",
    "kanda_access_time_v": "24小時開放（御守授予所 9:00 - 17:00）",
    "kanda_btn_back": "返回72H行程藍圖",
    "kanda_footer": "72H Tokyo Strategic Blueprint &copy; 2026 Edition | Kanda Myojin Deep Dive",
    "at_page_title": "淺草寺 Senso-ji | 千年信仰與下町生命力",
    "at_back": "Back to 72H",
    "at_nav_about": "關於淺草寺",
    "at_nav_cyber": "信仰體驗",
    "at_nav_access": "交通座標",
    "at_badge": "建於 628 年",
    "at_title": "淺草寺",
    "at_subtitle": "Senso-ji",
    "at_desc": "東京最古老的佛教寺院。雷門的紅燈籠與香爐裊裊升起的線香，見證了從江戶時代延續至今的下町信仰與庶民生命力。",
    "at_about_h": "從世俗走入神聖的參道",
    "at_about_p1": "淺草寺供奉觀音菩薩，是東京香火最鼎盛的寺廟。從地標性的「雷門」進入，穿過熱鬧的仲見世通商店街，這不僅是觀光路線，更是一條從世俗物質世界，逐步淨化心靈、走向神聖本堂的傳統參道。",
    "at_about_p2": "本堂前的常香爐，總是被祈求健康與好運的信眾包圍。人們將線香的煙霧撲向自己身上不適的部位，這種古老的身體祈福儀式，與一旁現代化的東京晴空塔形成了強烈的時空對比。",
    "at_exp_title": "文化與感官的交融",
    "at_exp_lead": "雷門、凶籤與下町美食",
    "at_exp_1_h": "風雷神門 (雷門)",
    "at_exp_1_p": "淺草寺的總門，懸掛著重達 700 公斤的巨大紅燈籠。左右兩側供奉風神與雷神，是東京最具代表性的視覺標誌與結界入口。",
    "at_exp_2_h": "觀音百籤 (高機率凶籤)",
    "at_exp_2_p": "淺草寺的御神籤以維持古法著稱，因此抽中「凶」的機率高達 30%。抽中凶籤不代表厄運，而是提醒人們反省，將籤詩繫在結籤架上即可將壞運留下。",
    "at_exp_3_h": "仲見世通商店街",
    "at_exp_3_p": "日本最古老的商店街之一。在參拜前後，品嚐人形燒、仙貝與炸饅頭，完美體現了日本宗教中「神聖與世俗並存」的生活哲學。",
    "at_access_h": "📍 戰略座標",
    "at_access_addr_l": "地址：",
    "at_access_addr_v": "東京都台東區淺草2-3-1",
    "at_access_trans_l": "交通：",
    "at_access_trans_1": "東京地下鐵銀座線「淺草站」步行 5 分鐘",
    "at_access_trans_2": "都營地下鐵淺草線「淺草站」步行 5 分鐘",
    "at_access_trans_3": "東武晴空塔線「淺草站」步行 5 分鐘",
    "at_access_time_l": "開放時間：",
    "at_access_time_v": "本堂 6:00 - 17:00（10月至3月為 6:30 開門），寺舞全天開放",
    "at_btn_back": "返回72H行程藍圖",
    "at_footer": "72H Tokyo Strategic Blueprint &copy; 2026 Edition | Senso-ji Deep Dive",
    "as_page_title": "淺草神社 Asakusa Shrine | 神佛習合的活歷史",
    "as_back": "Back to 72H",
    "as_nav_about": "關於淺草神社",
    "as_nav_cyber": "三社祭典",
    "as_nav_access": "交通座標",
    "as_badge": "江戶三大祭",
    "as_title": "淺草神社",
    "as_subtitle": "Asakusa Shrine",
    "as_desc": "與淺草寺比鄰而居，祭祀發現觀音像的三位先人。這裡是「神佛習合」最生動的證明，也是江戶夏季風物詩「三社祭」的舞台。",
    "as_about_h": "神道與佛教的和平共存",
    "as_about_p1": "在日本，「神佛習合」是千年來的宗教常態，直到明治時代的「神佛分離令」才被強制拆散。然而，淺草神社與淺草寺依然緊密相連，信眾在佛寺參拜觀音後，轉身便能在神社的鳥居前向神明祈福。",
    "as_about_p2": "這種沒有排他性、各取所需的信仰方式，正是理解日本文化與東京這座城市包容性的關鍵鑰匙。",
    "as_exp_title": "三社明神與祭典狂熱",
    "as_exp_lead": "神輿、心願與夏季風物詩",
    "as_exp_1_h": "三社祭",
    "as_exp_1_p": "每年 5 月舉辦的「三社祭」是東京最大的祭典之一。超過百座神輿（神轎）在淺草街頭巡遊，伴隨著傳統音樂與人們的熱情呼喊，展現了極致的下町生命力。",
    "as_exp_2_h": "夫妻狛犬與結緣",
    "as_exp_2_p": "神社境內有一對相依偎的「夫妻狛犬」，被認為能保佑良緣與夫妻圓滿。在這裡，神道教的祈福更偏向「現世利益」與日常生活的平安。",
    "as_exp_3_h": "心願卡與御守",
    "as_exp_3_p": "與淺草寺不同，神社提供了獨特的神道教御守與繪馬。人們在這裡寫下心願，寄託於自然萬物的八百萬神之中。",
    "as_access_h": "📍 戰略座標",
    "as_access_addr_l": "地址：",
    "as_access_addr_v": "東京都台東區淺草2-3-1 (位於淺草寺本堂右側)",
    "as_access_trans_l": "交通：",
    "as_access_trans_1": "東京地下鐵銀座線「淺草站」步行 7 分鐘",
    "as_access_trans_2": "都營地下鐵淺草線「淺草站」步行 7 分鐘",
    "as_access_time_l": "開放時間：",
    "as_access_time_v": "全天開放（社務所 9:00 - 16:30）",
    "as_btn_back": "返回72H行程藍圖",
    "as_footer": "72H Tokyo Strategic Blueprint &copy; 2026 Edition | Asakusa Shrine Deep Dive",
    "mj_page_title": "明治神宮 Meiji Jingu | 都心森林與神聖結界",
    "mj_back": "Back to 72H",
    "mj_nav_about": "關於明治神宮",
    "mj_nav_cyber": "森林參道",
    "mj_nav_access": "交通座標",
    "mj_badge": "鎮座百年森林",
    "mj_title": "明治神宮",
    "mj_subtitle": "Meiji Jingu",
    "mj_desc": "供奉明治天皇與昭憲皇太后的神聖空間。從喧鬧的原宿跨過大鳥居，便是一座超過十萬棵樹木組成的人造森林，完美展現了東京「神聖與世俗」的一步之遙。",
    "mj_about_h": "喧鬧都市中的靜謐結界",
    "mj_about_p1": "原宿與表參道是東京最繁華、年輕、世俗的潮流中心。然而，僅僅穿過一座木製大鳥居，世界的聲音彷彿被瞬間抽離，取而代之的是碎石參道的沙沙聲與高聳入雲的綠意。",
    "mj_about_p2": "這種極致的對比，是刻意為之的空間解構。走在明治神宮的參道上，是從物質世界回歸精神內在的絕佳過渡，也是體會日本神道教「敬畏自然」核心的最佳場所。",
    "mj_exp_title": "自然與信仰的體驗",
    "mj_exp_lead": "巨木參道、清酒樽與皇室信仰",
    "mj_exp_1_h": "鎮守之森與大鳥居",
    "mj_exp_1_p": "這片廣大的森林並非天然，而是由百年前日本各地捐贈的十萬棵樹苗種植而成。南參道上的大鳥居是由超過 1500 年樹齡的台灣檜木製成，莊嚴無比。",
    "mj_exp_2_h": "奉納酒樽牆",
    "mj_exp_2_p": "參道兩側擺滿了全國酒造敬獻的清酒樽，對面則是來自法國的葡萄酒桶。這展示了明治天皇積極吸收西方文化的開明，也是洋風與和魂並存的象徵。",
    "mj_exp_3_h": "大御心籤詩與繪馬",
    "mj_exp_3_p": "與一般神社占卜吉凶的籤不同，明治神宮的籤詩稱為「大御心」，內容是明治天皇或昭憲皇太后所作的短歌，為參拜者提供道德與生活上的指引。",
    "mj_access_h": "📍 戰略座標",
    "mj_access_addr_l": "地址：",
    "mj_access_addr_v": "東京都澀谷區代代木神園町1-1",
    "mj_access_trans_l": "交通：",
    "mj_access_trans_1": "JR 山手線「原宿站」步行 1 分鐘 (南參道口)",
    "mj_access_trans_2": "東京地下鐵千代田線/副都心線「明治神宮前站」步行 1 分鐘",
    "mj_access_time_l": "開放時間：",
    "mj_access_time_v": "日出至日落（每月時間不同，通常約為 5:00 - 18:00）",
    "mj_btn_back": "返回72H行程藍圖",
    "mj_footer": "72H Tokyo Strategic Blueprint &copy; 2026 Edition | Meiji Jingu Deep Dive"
  },
  // 以下多國語言保持與原本一致 (省略部分為節省空間，請以您提供的原文為主)
  "zh-Hans": { /* ... */ },
  "en": { /* ... */ },
  "vi": { /* ... */ },
  "id": { /* ... */ },
  "ja": { /* ... */ },
  "ko": { /* ... */ }
};

let currentLang = 'zh-Hant';

const langLabels = {
  'zh-Hant': '繁中',
  'zh-Hans': '简中',
  en: 'EN',
  vi: 'VI',
  id: 'ID',
  ja: 'JP',
  ko: 'KO'
};

function setLanguage(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key] !== undefined) {
      el.innerHTML = i18n[lang][key];
    }
  });

  // Update dropdown button label
  const langCurrent = document.querySelector('.lang-current');
  if (langCurrent) {
    langCurrent.textContent = langLabels[lang] || 'EN';
  }

  // Update active state in dropdown
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
  });

  // Persist preference
  try { localStorage.setItem('preferred-lang', lang); } catch(e) {}

  document.dispatchEvent(new CustomEvent('tokyo:language-change', {
    detail: { lang }
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Language Dropdown ----------
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const langDropdown = document.getElementById('langDropdown');

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langDropdown.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', isOpen);
    });

    langMenu.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.getAttribute('data-lang');
        setLanguage(lang);
        langDropdown.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langDropdown.contains(e.target)) {
        langDropdown.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Load saved language preference, strictly default to Traditional Chinese
  try {
    const savedLang = localStorage.getItem('preferred-lang');
    if (savedLang && i18n[savedLang]) {
      setLanguage(savedLang);
    } else {
      setLanguage('zh-Hant');
    }
  } catch(e) {
    setLanguage('zh-Hant');
  }

  // ---------- Mobile menu toggle ----------
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    // 點擊漢堡按鈕展開/收合選單
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止點擊事件冒泡
      const isActive = mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active'); // 替換掉原本的 open
      menuToggle.setAttribute('aria-expanded', isActive);
    });

    // 點擊導覽列連結自動收合
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // 點擊導覽列以外的空白處，自動收起手機選單
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Header shrink on scroll ----------
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
    } else {
      header.style.boxShadow = 'none';
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // ---------- Active nav link highlighting ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // ---------- Scroll reveal animation ----------
  const fadeElements = document.querySelectorAll(
    '.area-card, .track, .day-block, .religion-hero-card, .religion-section, .religion-insight, .lifecycle-item, .compare-col, .religion-spot-card, .budget-card, .team-card, .q-item, .section-title, .section-lead, .closing-visual, .closing-title, .closing-text, .closing-quote, .closing-cta, .map-container, .tl-item'
  );

  // Add fade-in class and stagger siblings
  fadeElements.forEach(el => el.classList.add('fade-in'));

  // Apply stagger classes to grouped siblings
  const staggerGroups = [
    '.core-areas .area-card',
    '.religion-lifecycle .lifecycle-item',
    '.compare-table .compare-col',
    '.religion-spots-grid .religion-spot-card',
    '.budget-grid .budget-card',
    '.team-grid .team-card',
    '.timeline .tl-item'
  ];
  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (i < 6) el.classList.add('stagger-' + (i + 1));
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  fadeElements.forEach(el => revealObserver.observe(el));

  // ---------- Smooth scroll for anchor links (fallback) ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- Day block expand/collapse ----------
  document.querySelectorAll('.day-header').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const block = header.parentElement;

      if (block.classList.contains('collapsed')) {
        block.classList.remove('collapsed');
        content.style.maxHeight = content.scrollHeight + 'px';
        setTimeout(() => { content.style.maxHeight = 'none'; }, 400);
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(() => {
          block.classList.add('collapsed');
          content.style.maxHeight = '0';
        });
      }
    });
  });
});

// Add collapsed styles dynamically
const collapseStyle = document.createElement('style');
collapseStyle.textContent = `
  .day-block .day-content {
    overflow: hidden;
    transition: max-height 0.4s ease;
  }
  .day-block.collapsed .day-content {
    max-height: 0 !important;
    padding-top: 0;
    padding-bottom: 0;
  }
  .day-header::after {
    content: '\\25B2';
    font-size: 0.7rem;
    color: #999;
    margin-left: auto;
    transition: transform 0.3s;
  }
  .day-block.collapsed .day-header::after {
    transform: rotate(180deg);
  }
  .nav-link.active {
    color: #d93838; /* 更換為品牌主色調紅 */
  }
  .nav-link.active::after {
    width: 100%;
  }
  
  /* 手機端漢堡選單動畫 (同步使用 .active) */
  .menu-toggle.active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle.active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
`;
document.head.appendChild(collapseStyle);
