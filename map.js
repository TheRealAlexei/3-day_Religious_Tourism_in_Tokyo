// ==========================================
// 72H Tokyo - Interactive Itinerary Map
// Neon and incense route map for the 72-hour overview
// ==========================================

var tokyoCenter = [35.6812, 139.7550];
var defaultZoom = 12;

function returnToTokyo() {
  if (!window._tokyoMap) return;

  window._tokyoMap.closePopup();
  window._tokyoMap.flyTo(tokyoCenter, defaultZoom, {
    animate: true,
    duration: 1.35
  });
}

function t(zh, zhs, en, vi, id, ja, ko) {
  return {
    'zh-Hant': zh,
    'zh-Hans': zhs,
    en: en,
    vi: vi,
    id: id,
    ja: ja,
    ko: ko
  };
}

function readMapLang() {
  var lang = document.documentElement.lang || 'zh-Hant';
  if (lang === 'zh-Hans') return 'zh-Hans';
  if (lang === 'zh-Hant' || lang.indexOf('zh') === 0) return 'zh-Hant';
  if (['en', 'vi', 'id', 'ja', 'ko'].indexOf(lang) >= 0) return lang;
  return 'en';
}

function pick(value, lang) {
  return value[lang] || value.en || value['zh-Hant'] || '';
}

document.addEventListener('DOMContentLoaded', function () {
  var mapEl = document.getElementById('tokyo-topology-map');
  if (!mapEl) return;

  var map = L.map('tokyo-topology-map', {
    scrollWheelZoom: true,
    zoomControl: true,
    worldCopyJump: true
  }).setView(tokyoCenter, defaultZoom);
  window._tokyoMap = map;

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  var routeLayer = L.layerGroup().addTo(map);
  var markerLayer = L.layerGroup().addTo(map);
  var macroLayer = L.layerGroup();
  var legendNode = null;
  var scaleHintNode = null;

  var colors = {
    day1: '#15AABF',
    day2: '#E0603E',
    day3: '#5F6C7B',
    shrine: '#B45309',
    temple: '#7C3AED',
    landmark: '#2A5CAA',
    transit: '#64748B',
    base: '#111827',
    food: '#D97706',
    macro: '#D4AF37'
  };

  var typeLabels = {
    shrine: t('神社', '神社', 'Shrine', 'Đền thần', 'Kuil Shinto', '神社', '신사'),
    temple: t('寺院', '寺院', 'Temple', 'Chùa', 'Kuil Buddha', '寺院', '사찰'),
    landmark: t('地標', '地标', 'Landmark', 'Địa danh', 'Landmark', '名所', '랜드마크'),
    transit: t('交通', '交通', 'Transit', 'Giao thông', 'Transit', '交通', '교통'),
    base: t('基地', '基地', 'Base', 'Căn cứ', 'Basis', '拠点', '거점'),
    food: t('美食', '美食', 'Food', 'Ẩm thực', 'Kuliner', '食', '음식')
  };

  var markerLetters = {
    'zh-Hant': { shrine: '社', temple: '寺', base: '基', transit: '交', food: '食', landmark: '景' },
    'zh-Hans': { shrine: '社', temple: '寺', base: '基', transit: '交', food: '食', landmark: '景' },
    en: { shrine: 'S', temple: 'T', base: 'B', transit: 'M', food: 'F', landmark: 'L' },
    vi: { shrine: 'Đ', temple: 'C', base: 'C', transit: 'T', food: 'Ă', landmark: 'D' },
    id: { shrine: 'S', temple: 'B', base: 'P', transit: 'T', food: 'K', landmark: 'L' },
    ja: { shrine: '社', temple: '寺', base: '拠', transit: '交', food: '食', landmark: '景' },
    ko: { shrine: '사', temple: '절', base: '거', transit: '교', food: '식', landmark: '경' }
  };

  var dayLabels = {
    day1: t('Day 1', 'Day 1', 'Day 1', 'Ngày 1', 'Hari 1', 'Day 1', 'Day 1'),
    day2am: t('Day 2 上午', 'Day 2 上午', 'Day 2 AM', 'Ngày 2 sáng', 'Hari 2 pagi', 'Day 2 午前', 'Day 2 오전'),
    day2noon: t('Day 2 中午', 'Day 2 中午', 'Day 2 Noon', 'Ngày 2 trưa', 'Hari 2 siang', 'Day 2 昼', 'Day 2 정오'),
    day2pm: t('Day 2 下午', 'Day 2 下午', 'Day 2 PM', 'Ngày 2 chiều', 'Hari 2 sore', 'Day 2 午後', 'Day 2 오후'),
    day2eve: t('Day 2 傍晚', 'Day 2 傍晚', 'Day 2 Evening', 'Ngày 2 chiều tối', 'Hari 2 petang', 'Day 2 夕方', 'Day 2 저녁'),
    day2night: t('Day 2 夜晚', 'Day 2 夜晚', 'Day 2 Night', 'Ngày 2 đêm', 'Hari 2 malam', 'Day 2 夜', 'Day 2 밤'),
    day1day3: t('Day 1 / Day 3', 'Day 1 / Day 3', 'Day 1 / Day 3', 'Ngày 1 / Ngày 3', 'Hari 1 / Hari 3', 'Day 1 / Day 3', 'Day 1 / Day 3'),
    day13: t('Day 1-3', 'Day 1-3', 'Day 1-3', 'Ngày 1-3', 'Hari 1-3', 'Day 1-3', 'Day 1-3'),
    anchor: t('參考錨點', '参考锚点', 'Reference anchor', 'Mốc tham chiếu', 'Jangkar referensi', '参照アンカー', '기준 앵커'),
    optional: t('延伸地標', '延伸地标', 'Extra landmark', 'Địa danh mở rộng', 'Landmark tambahan', '追加名所', '추가 랜드마크')
  };

  var locations = [
    {
      id: 'nrt',
      coords: [35.7719, 140.3929],
      type: 'transit',
      dayKey: 'day1day3',
      name: t('成田國際機場 NRT', '成田国际机场 NRT', 'Narita International Airport NRT', 'Sân bay quốc tế Narita NRT', 'Bandara Internasional Narita NRT', '成田国際空港 NRT', '나리타 국제공항 NRT'),
      summary: t('Skyliner 進出東京的高速門戶。Day 1 抵達、Day 3 撤退。', 'Skyliner 进出东京的高速门戶。Day 1 抵达、Day 3 撤退。', 'High-speed gateway into Tokyo via Skyliner: arrival on Day 1, departure on Day 3.', 'Cửa ngõ tốc hành vào Tokyo bằng Skyliner: đến ngày 1, rời ngày 3.', 'Gerbang cepat ke Tokyo lewat Skyliner: datang hari 1, pulang hari 3.', 'Skylinerで東京へ入る高速ゲート。Day 1到着、Day 3撤退。', 'Skyliner로 도쿄에 들어가는 고속 관문. Day 1 도착, Day 3 철수.')
    },
    {
      id: 'nippori',
      coords: [35.7278, 139.7708],
      type: 'transit',
      dayKey: 'day1day3',
      name: t('日暮里站', '日暮里站', 'Nippori Station', 'Ga Nippori', 'Stasiun Nippori', '日暮里駅', '닛포리역'),
      summary: t('Skyliner 與 JR 山手線的轉乘節點，讓機場與市區銜接最短化。', 'Skyliner 与 JR 山手线的转乘节点，让机场与市区銜接最短化。', 'Transfer point between Skyliner and JR Yamanote Line, keeping airport access efficient.', 'Điểm đổi tuyến giữa Skyliner và JR Yamanote, giúp nối sân bay với trung tâm nhanh hơn.', 'Titik transfer Skyliner dan JR Yamanote agar akses bandara tetap efisien.', 'SkylinerとJR山手線の乗換点。空港と都心を最短でつなぐ。', 'Skyliner와 JR 야마노테선 환승점으로 공항 접근을 효율화한다.')
    },
    {
      id: 'akiba',
      coords: [35.6984, 139.7730],
      type: 'base',
      dayKey: 'day13',
      name: t('秋葉原戰略基地', '秋叶原战略基地', 'Akihabara Strategic Base', 'Căn cứ Akihabara', 'Basis Strategis Akihabara', '秋葉原戦略拠点', '아키하바라 전략 거점'),
      summary: t('72 小時動線核心。銜接山手線、日比谷線與東東京下町區域。', '72 小时动线核心。銜接山手线、日比谷线与东东京下町区域。', 'The 72-hour mobility core, linking Yamanote, Hibiya Line, and eastern downtown Tokyo.', 'Lõi di chuyển 72 giờ, nối Yamanote, Hibiya và khu phố đông Tokyo.', 'Inti mobilitas 72 jam, menghubungkan Yamanote, Hibiya, dan pusat timur Tokyo.', '72時間動線の中心。山手線、日比谷線、東東京の下町へ接続。', '72시간 동선의 중심. 야마노테선, 히비야선, 동쪽 도쿄를 잇는다.')
    },
    {
      id: 'kanda',
      coords: [35.7017, 139.7679],
      type: 'shrine',
      dayKey: 'day1',
      name: t('神田明神', '神田明神', 'Kanda Myojin Shrine', 'Đền Kanda Myojin', 'Kuil Kanda Myojin', '神田明神', '간다묘진'),
      summary: t('秋葉原旁的江戶總鎮守。動漫、科技與傳統信仰在此奇妙並置。', '秋叶原旁的江戶总镇守。动漫、科技与传统信仰在此奇妙并置。', 'A historic guardian shrine beside Akihabara, where tech culture and old faith overlap.', 'Ngôi đền hộ mệnh cạnh Akihabara, nơi công nghệ và tín ngưỡng cũ giao nhau.', 'Kuil penjaga bersejarah dekat Akihabara, tempat budaya teknologi bertemu tradisi.', '秋葉原そばの江戸総鎮守。テック文化と伝統信仰が重なる。', '아키하바라 옆의 역사적 수호 신사. 기술 문화와 전통 신앙이 겹친다.')
    },
    {
      id: 'sensoji',
      coords: [35.7148, 139.7967],
      type: 'temple',
      dayKey: 'day2am',
      name: t('淺草寺・雷門', '浅草寺・雷门', 'Senso-ji Temple and Kaminarimon', 'Chùa Senso-ji và cổng Kaminarimon', 'Kuil Senso-ji dan Kaminarimon', '浅草寺・雷門', '센소지와 가미나리몬'),
      summary: t('東京最具代表性的古寺，從雷門、仲見世通到本堂完成線香軸線。', '东京最具代表性的古寺，从雷门、仲见世通到本堂完成线香轴线。', 'Tokyo’s iconic old temple, forming the incense route from Kaminarimon to Nakamise and the main hall.', 'Ngôi chùa biểu tượng của Tokyo, tạo trục hương trầm từ Kaminarimon qua Nakamise đến chính điện.', 'Kuil tua ikonik Tokyo, membentuk jalur dupa dari Kaminarimon ke Nakamise dan aula utama.', '東京を代表する古寺。雷門、仲見世、本堂へと香の軸線が続く。', '도쿄 대표 고찰. 가미나리몬에서 나카미세와 본당까지 향의 축이 이어진다.')
    },
    {
      id: 'asakusa-shrine',
      coords: [35.7155, 139.7974],
      type: 'shrine',
      dayKey: 'day2am',
      name: t('淺草神社', '浅草神社', 'Asakusa Shrine', 'Đền Asakusa', 'Kuil Asakusa', '浅草神社', '아사쿠사 신사'),
      summary: t('緊鄰淺草寺，是神佛習合主題最直觀的現場標記。', '紧邻浅草寺，是神佛习合主题最直观的现场标记。', 'Right beside Senso-ji, this is the clearest on-site marker of Shinto-Buddhist coexistence.', 'Nằm cạnh Senso-ji, đây là dấu mốc rõ nhất của sự cùng tồn tại Thần đạo và Phật giáo.', 'Tepat di sebelah Senso-ji, penanda jelas koeksistensi Shinto dan Buddha.', '浅草寺の隣にあり、神仏習合を最も直感的に示す場所。', '센소지 바로 옆에서 신도와 불교의 공존을 가장 선명하게 보여준다.')
    },
    {
      id: 'skytree',
      coords: [35.7101, 139.8107],
      type: 'landmark',
      dayKey: 'optional',
      name: t('東京晴空塔', '东京晴空塔', 'Tokyo Skytree', 'Tokyo Skytree', 'Tokyo Skytree', '東京スカイツリー', '도쿄 스카이트리'),
      summary: t('東東京最醒目的天際線座標，適合與淺草、隅田川一起閱讀。', '东东京最醒目的天际线座标，适合与浅草、隅田川一起閱读。', 'The dominant skyline marker of east Tokyo, best read with Asakusa and the Sumida River.', 'Mốc skyline nổi bật nhất phía đông Tokyo, nên xem cùng Asakusa và sông Sumida.', 'Penanda skyline utama Tokyo timur, cocok dibaca bersama Asakusa dan Sungai Sumida.', '東東京の空を決定づけるランドマーク。浅草、隅田川と一緒に読む。', '동쪽 도쿄의 대표 스카이라인. 아사쿠사와 스미다강과 함께 읽기 좋다.')
    },
    {
      id: 'ueno',
      coords: [35.7156, 139.7732],
      type: 'landmark',
      dayKey: 'day2noon',
      name: t('上野恩賜公園', '上野恩赐公园', 'Ueno Park', 'Công viên Ueno', 'Taman Ueno', '上野恩賜公園', '우에노 공원'),
      summary: t('博物館、美術館與綠地集中，是文化東京與庶民東京的交會點。', '博物馆、美术馆与绿地集中，是文化东京与庶民东京的交会点。', 'Museums, galleries, and parkland converge here, bridging cultural Tokyo and everyday Tokyo.', 'Bảo tàng, mỹ thuật và mảng xanh hội tụ, nối Tokyo văn hóa với Tokyo đời thường.', 'Museum, galeri, dan ruang hijau bertemu, menjembatani Tokyo budaya dan keseharian.', '博物館、美術館、緑地が集まり、文化東京と庶民東京が交差する。', '박물관, 미술관, 녹지가 모여 문화 도쿄와 생활 도쿄를 잇는다.')
    },
    {
      id: 'ueno-toshogu',
      coords: [35.7151, 139.7707],
      type: 'shrine',
      dayKey: 'day2noon',
      name: t('上野東照宮', '上野东照宮', 'Ueno Toshogu Shrine', 'Đền Ueno Toshogu', 'Kuil Ueno Toshogu', '上野東照宮', '우에노 도쇼구'),
      summary: t('供奉德川家康的金色社殿，為上野文化帶補上神道地標。', '供奉德川家康的金色社殿，为上野文化帶补上神道地标。', 'A golden shrine dedicated to Tokugawa Ieyasu, adding a Shinto anchor to Ueno’s culture belt.', 'Đền vàng thờ Tokugawa Ieyasu, bổ sung mốc Thần đạo cho vành đai văn hóa Ueno.', 'Kuil emas untuk Tokugawa Ieyasu, memberi jangkar Shinto pada sabuk budaya Ueno.', '徳川家康を祀る金色の社殿。上野文化帯の神道アンカー。', '도쿠가와 이에야스를 모신 금빛 신사로 우에노 문화권의 신도 앵커다.')
    },
    {
      id: 'ameyoko',
      coords: [35.7101, 139.7744],
      type: 'food',
      dayKey: 'day2noon',
      name: t('阿美橫丁', '阿美横丁', 'Ameyoko Market', 'Chợ Ameyoko', 'Pasar Ameyoko', 'アメ横', '아메요코 시장'),
      summary: t('午餐與街頭補給點。海鮮丼、串燒與下町能量一次濃縮。', '午餐与街头补给点。海鲜丼、串烧与下町能量一次浓缩。', 'Lunch and street-food refuel point, packed with seafood bowls, skewers, and downtown energy.', 'Điểm ăn trưa và nạp năng lượng đường phố với hải sản, xiên nướng và sức sống phố cũ.', 'Titik makan siang jalanan dengan seafood bowl, sate, dan energi pusat kota lama.', '昼食と街歩き補給点。海鮮丼、串焼き、下町の活気が凝縮。', '점심과 길거리 보급 지점. 해산물 덮밥, 꼬치, 서민가의 에너지가 모인다.')
    },
    {
      id: 'nezu',
      coords: [35.7202, 139.7607],
      type: 'shrine',
      dayKey: 'optional',
      name: t('根津神社', '根津神社', 'Nezu Shrine', 'Đền Nezu', 'Kuil Nezu', '根津神社', '네즈 신사'),
      summary: t('千本鳥居與杜鵑名景，適合串接上野、谷根千的安靜散步線。', '千本鳥居与杜鵑名景，适合串接上野、谷根千的安靜散步线。', 'Known for torii gates and azaleas, ideal for a quiet Ueno-Yanesen walking extension.', 'Nổi tiếng với cổng torii và đỗ quyên, hợp nối tuyến đi bộ yên tĩnh Ueno-Yanesen.', 'Terkenal dengan gerbang torii dan azalea, cocok untuk ekstensi jalan kaki Ueno-Yanesen.', '千本鳥居とツツジで知られ、上野・谷根千の静かな散歩線に合う。', '도리이와 철쭉으로 유명해 우에노와 야네센 산책 연장에 좋다.')
    },
    {
      id: 'tokyo-dome',
      coords: [35.7056, 139.7519],
      type: 'landmark',
      dayKey: 'optional',
      name: t('東京巨蛋', '东京巨蛋', 'Tokyo Dome', 'Tokyo Dome', 'Tokyo Dome', '東京ドーム', '도쿄돔'),
      summary: t('棒球、演唱會與都市娛樂的大型節點，可補強「運動東京」主題。', '棒球、演唱会与都市娛乐的大型节点，可补强「运动东京」主题。', 'Major baseball, concert, and entertainment node that supports the sports Tokyo theme.', 'Điểm bóng chày, concert và giải trí lớn, bổ sung chủ đề Tokyo thể thao.', 'Node bisbol, konser, dan hiburan besar untuk tema olahraga Tokyo.', '野球、ライブ、都市娯楽の大型拠点。「スポーツ東京」を補強。', '야구, 콘서트, 도시 엔터테인먼트의 큰 거점으로 스포츠 도쿄 주제를 보강한다.')
    },
    {
      id: 'imperial-palace',
      coords: [35.6852, 139.7528],
      type: 'landmark',
      dayKey: 'anchor',
      name: t('皇居外苑', '皇居外苑', 'Imperial Palace Outer Garden', 'Vườn ngoài Hoàng cư', 'Taman Luar Istana Kekaisaran', '皇居外苑', '고쿄 외원'),
      summary: t('東京政治與地理中樞，也可作為晨跑與城市尺度感的參照點。', '东京政治与地理中枢，也可作为晨跑与城市尺度感的参照点。', 'Political and geographic center of Tokyo, also a reference point for morning runs and city scale.', 'Trung tâm chính trị và địa lý Tokyo, cũng là mốc chạy sáng và cảm nhận quy mô đô thị.', 'Pusat politik dan geografis Tokyo, juga referensi lari pagi dan skala kota.', '東京の政治・地理の中枢。朝ランと都市スケールの参照点。', '도쿄의 정치·지리 중심이자 아침 러닝과 도시 규모의 기준점.')
    },
    {
      id: 'tokyo-station',
      coords: [35.6812, 139.7671],
      type: 'landmark',
      dayKey: 'anchor',
      name: t('東京車站・丸之內', '东京车站・丸之內', 'Tokyo Station and Marunouchi', 'Ga Tokyo và Marunouchi', 'Stasiun Tokyo dan Marunouchi', '東京駅・丸の内', '도쿄역과 마루노우치'),
      summary: t('東西東京的地理中線，可作為下町與山手之間的判讀參照。', '东西东京的地理中线，可作为下町与山手之间的判读参照。', 'A central reference for reading the divide between east downtown Tokyo and west Yamanote.', 'Mốc trung tâm để đọc ranh giới giữa phố đông Tokyo và phía tây Yamanote.', 'Referensi pusat untuk membaca batas Tokyo timur dan Yamanote barat.', '東東京の下町と西側山手を読むための中心参照点。', '동쪽 서민가와 서쪽 야마노테를 읽는 중심 기준점.')
    },
    {
      id: 'ginza',
      coords: [35.6717, 139.7650],
      type: 'landmark',
      dayKey: 'optional',
      name: t('銀座', '銀座', 'Ginza', 'Ginza', 'Ginza', '銀座', '긴자'),
      summary: t('高端商業與百貨街區，呈現東京最精緻的消費秩序。', '高端商业与百货街区，呈现东京最精緻的消费秩序。', 'Premium shopping district showing Tokyo’s most polished retail order.', 'Khu mua sắm cao cấp, thể hiện trật tự tiêu dùng tinh tế của Tokyo.', 'Distrik belanja premium yang menunjukkan tatanan retail Tokyo yang rapi.', '高級商業と百貨店の街。東京の洗練された消費秩序を示す。', '고급 상업과 백화점 거리로 도쿄의 세련된 소비 질서를 보여준다.')
    },
    {
      id: 'tsukiji',
      coords: [35.6655, 139.7707],
      type: 'food',
      dayKey: 'optional',
      name: t('築地場外市場', '築地场外市场', 'Tsukiji Outer Market', 'Chợ ngoài Tsukiji', 'Pasar Luar Tsukiji', '築地場外市場', '쓰키지 장외시장'),
      summary: t('壽司、海鮮與街邊小吃密集，是東京味覺地圖的經典補點。', '壽司、海鲜与街边小吃密集，是东京味觉地图的经典补点。', 'Dense with sushi, seafood, and snacks, a classic add-on for Tokyo’s food map.', 'Nhiều sushi, hải sản và món ăn vặt, điểm bổ sung kinh điển cho bản đồ ẩm thực Tokyo.', 'Padat sushi, seafood, dan jajanan, tambahan klasik untuk peta kuliner Tokyo.', '寿司、海鮮、食べ歩きが密集する東京味覚地図の定番補点。', '스시, 해산물, 길거리 음식이 밀집한 도쿄 미식 지도의 대표 추가 지점.')
    },
    {
      id: 'hie',
      coords: [35.6747, 139.7416],
      type: 'shrine',
      dayKey: 'optional',
      name: t('日枝神社', '日枝神社', 'Hie Shrine', 'Đền Hie', 'Kuil Hie', '日枝神社', '히에 신사'),
      summary: t('赤坂的都心神社，千本鳥居與商務街形成強烈對比。', '赤坂的都心神社，千本鳥居与商务街形成强烈对比。', 'Central Akasaka shrine where torii gates contrast sharply with the business district.', 'Đền ở trung tâm Akasaka, cổng torii tương phản mạnh với khu thương mại.', 'Kuil pusat Akasaka dengan gerbang torii yang kontras dengan distrik bisnis.', '赤坂の都心神社。千本鳥居とビジネス街の対比が強い。', '아카사카 도심 신사로 도리이와 비즈니스 지구의 대비가 강하다.')
    },
    {
      id: 'tokyo-tower',
      coords: [35.6586, 139.7454],
      type: 'landmark',
      dayKey: 'optional',
      name: t('東京鐵塔', '东京鐵塔', 'Tokyo Tower', 'Tháp Tokyo', 'Tokyo Tower', '東京タワー', '도쿄타워'),
      summary: t('昭和東京的紅白天際線，適合對照晴空塔的新舊城市意象。', '昭和东京的紅白天际线，适合对照晴空塔的新舊城市意象。', 'Red-and-white Showa-era skyline icon, a useful contrast to the newer Skytree.', 'Biểu tượng skyline đỏ trắng thời Showa, đối chiếu tốt với Skytree mới hơn.', 'Ikon skyline merah-putih era Showa, kontras dengan Skytree yang lebih baru.', '昭和東京の赤白の象徴。新しいスカイツリーとの対照に最適。', '쇼와 시대의 붉고 흰 스카이라인 상징으로 스카이트리와 대비된다.')
    },
    {
      id: 'meiji',
      coords: [35.6764, 139.6993],
      type: 'shrine',
      dayKey: 'day2pm',
      name: t('明治神宮', '明治神宮', 'Meiji Jingu Shrine', 'Đền Meiji Jingu', 'Kuil Meiji Jingu', '明治神宮', '메이지 신궁'),
      summary: t('原宿旁的巨大鎮守之森，將山手潮流與神道靜謐並排呈現。', '原宿旁的巨大镇守之森，将山手潮流与神道靜谧并排呈现。', 'A vast sacred forest beside Harajuku, placing Yamanote fashion next to Shinto stillness.', 'Khu rừng thiêng lớn cạnh Harajuku, đặt thời trang Yamanote cạnh sự tĩnh lặng Thần đạo.', 'Hutan suci luas dekat Harajuku, menempatkan mode Yamanote bersebelahan dengan keheningan Shinto.', '原宿そばの巨大な鎮守の森。山手の流行と神道の静けさが並ぶ。', '하라주쿠 옆 거대한 신성한 숲. 야마노테의 유행과 신도의 고요함이 나란하다.')
    },
    {
      id: 'harajuku',
      coords: [35.6702, 139.7027],
      type: 'landmark',
      dayKey: 'day2pm',
      name: t('原宿', '原宿', 'Harajuku', 'Harajuku', 'Harajuku', '原宿', '하라주쿠'),
      summary: t('明治神宮與竹下通之間的文化緩衝帶，從森林切換到街頭流行。', '明治神宮与竹下通之间的文化緩冲帶，从森林切换到街头流行。', 'A cultural buffer between Meiji Jingu and Takeshita Street, shifting from forest to street style.', 'Vùng đệm văn hóa giữa Meiji Jingu và Takeshita, chuyển từ rừng sang thời trang đường phố.', 'Zona budaya antara Meiji Jingu dan Takeshita, berpindah dari hutan ke gaya jalanan.', '明治神宮と竹下通の間で、森からストリートカルチャーへ切り替わる。', '메이지 신궁과 다케시타도리 사이에서 숲에서 거리 문화로 전환된다.')
    },
    {
      id: 'takeshita',
      coords: [35.6717, 139.7020],
      type: 'landmark',
      dayKey: 'day2pm',
      name: t('竹下通', '竹下通', 'Takeshita Street', 'Phố Takeshita', 'Jalan Takeshita', '竹下通り', '다케시타 거리'),
      summary: t('年輕流行、甜點與街頭造型的密集巷道，是山手潮流的入口。', '年轻流行、甜点与街头造型的密集巷道，是山手潮流的入口。', 'Dense lane of youth fashion, sweets, and street styling, an entry point into Yamanote trends.', 'Con phố dày đặc thời trang trẻ, đồ ngọt và phong cách đường phố.', 'Lorong padat mode muda, dessert, dan gaya jalanan.', '若者ファッション、スイーツ、ストリートスタイルが密集する山手トレンドの入口。', '젊은 패션, 디저트, 거리 스타일이 밀집한 야마노테 트렌드 입구.')
    },
    {
      id: 'shibuya',
      coords: [35.6595, 139.7005],
      type: 'landmark',
      dayKey: 'day2eve',
      name: t('澀谷十字路口', '涩谷十字路口', 'Shibuya Crossing', 'Ngã tư Shibuya', 'Penyeberangan Shibuya', '渋谷スクランブル交差点', '시부야 스크램블 교차로'),
      summary: t('現代東京的霓虹心臟。人流、影像、商業與年輕文化高度壓縮。', '现代东京的霓虹心臟。人流、影像、商业与年轻文化高度壓缩。', 'The neon heart of modern Tokyo, compressing crowds, screens, commerce, and youth culture.', 'Trái tim neon của Tokyo hiện đại, nén đông người, màn hình, thương mại và văn hóa trẻ.', 'Jantung neon Tokyo modern, memadatkan kerumunan, layar, bisnis, dan budaya muda.', '現代東京のネオンの心臓。人流、映像、商業、若者文化が圧縮される。', '현대 도쿄의 네온 심장. 인파, 화면, 상업, 젊은 문화가 압축된다.')
    },
    {
      id: 'shinjuku',
      coords: [35.6950, 139.7036],
      type: 'landmark',
      dayKey: 'day2night',
      name: t('新宿歌舞伎町', '新宿歌舞伎町', 'Shinjuku Kabukicho', 'Kabukicho Shinjuku', 'Kabukicho Shinjuku', '新宿歌舞伎町', '신주쿠 가부키초'),
      summary: t('夜晚行程終點。百貨、拉麵、不夜城與霓虹物質性在此抵達高峰。', '夜晚行程終点。百货、拉面、不夜城与霓虹物质性在此抵达高峰。', 'Night-route finale where department stores, ramen, sleepless streets, and neon peak.', 'Điểm cuối ban đêm với bách hóa, ramen, phố không ngủ và neon đạt cực điểm.', 'Final malam dengan department store, ramen, kota tak tidur, dan neon yang memuncak.', '夜ルートの終点。百貨店、ラーメン、不夜城、ネオンが最高潮に達する。', '밤 루트의 종점. 백화점, 라멘, 잠들지 않는 거리, 네온이 절정에 오른다.')
    },
    {
      id: 'ryogoku',
      coords: [35.6967, 139.7933],
      type: 'landmark',
      dayKey: 'optional',
      name: t('兩國國技館', '两国国技馆', 'Ryogoku Kokugikan', 'Ryogoku Kokugikan', 'Ryogoku Kokugikan', '両国国技館', '료고쿠 국기관'),
      summary: t('相撲文化核心地標，可將東京運動文化加入行程地圖。', '相扑文化核心地标，可将东京运动文化加入行程地图。', 'Core sumo landmark, adding traditional sports culture to the Tokyo map.', 'Địa danh sumo cốt lõi, thêm văn hóa thể thao truyền thống vào bản đồ Tokyo.', 'Landmark sumo utama, menambah budaya olahraga tradisional ke peta Tokyo.', '相撲文化の中心地。東京のスポーツ文化を地図に加える。', '스모 문화의 중심지로 도쿄의 전통 스포츠 문화를 더한다.')
    },
    {
      id: 'odaiba',
      coords: [35.6272, 139.7760],
      type: 'landmark',
      dayKey: 'optional',
      name: t('台場海濱公園', '台场海濱公园', 'Odaiba Seaside Park', 'Công viên biển Odaiba', 'Taman Tepi Laut Odaiba', 'お台場海浜公園', '오다이바 해변공원'),
      summary: t('東京灣人工島景觀，可作為夜景、海風與未來都市感的延伸點。', '东京灣人工島景观，可作为夜景、海风与未来都市感的延伸点。', 'Tokyo Bay island view for night scenery, sea breeze, and futuristic city texture.', 'Cảnh đảo vịnh Tokyo cho đêm, gió biển và cảm giác đô thị tương lai.', 'Pemandangan pulau Teluk Tokyo untuk malam, angin laut, dan nuansa kota futuristik.', '東京湾の人工島景観。夜景、海風、未来都市感の延伸点。', '도쿄만 인공섬 풍경으로 야경, 바닷바람, 미래 도시감을 더한다.')
    }
  ];

  var locationById = {};
  locations.forEach(function (loc) {
    locationById[loc.id] = loc;
  });

  var itineraryRoutes = [
    {
      labels: t(
        'Day 1 抵達線：NRT → 日暮里 → 秋葉原 → 神田明神',
        'Day 1 arrival: NRT → Nippori → Akihabara → Kanda Myojin',
        'Ngày 1 đến: NRT → Nippori → Akihabara → Kanda Myojin',
        'Hari 1 tiba: NRT → Nippori → Akihabara → Kanda Myojin',
        'Day 1 到着線：NRT → 日暮里 → 秋葉原 → 神田明神',
        'Day 1 도착선: NRT → 닛포리 → 아키하바라 → 간다묘진'
      ),
      color: colors.day1,
      dashArray: null,
      points: ['nrt', 'nippori', 'akiba', 'kanda']
    },
    {
      labels: t(
        'Day 2 線香到霓虹：淺草 → 上野 → 明治神宮 → 澀谷 → 新宿',
        'Day 2 incense to neon: Asakusa → Ueno → Meiji Jingu → Shibuya → Shinjuku',
        'Ngày 2 hương trầm đến neon: Asakusa → Ueno → Meiji Jingu → Shibuya → Shinjuku',
        'Hari 2 dupa ke neon: Asakusa → Ueno → Meiji Jingu → Shibuya → Shinjuku',
        'Day 2 香からネオンへ：浅草 → 上野 → 明治神宮 → 渋谷 → 新宿',
        'Day 2 향에서 네온으로: 아사쿠사 → 우에노 → 메이지 신궁 → 시부야 → 신주쿠'
      ),
      color: colors.day2,
      dashArray: null,
      points: ['akiba', 'sensoji', 'asakusa-shrine', 'ueno', 'ueno-toshogu', 'ameyoko', 'meiji', 'harajuku', 'shibuya', 'shinjuku']
    },
    {
      labels: t(
        'Day 3 撤退線：秋葉原/上野 → 日暮里 → NRT',
        'Day 3 departure: Akihabara/Ueno → Nippori → NRT',
        'Ngày 3 rời đi: Akihabara/Ueno → Nippori → NRT',
        'Hari 3 pulang: Akihabara/Ueno → Nippori → NRT',
        'Day 3 撤退線：秋葉原/上野 → 日暮里 → NRT',
        'Day 3 철수선: 아키하바라/우에노 → 닛포리 → NRT'
      ),
      color: colors.day3,
      dashArray: '10, 8',
      points: ['akiba', 'ueno', 'nippori', 'nrt']
    }
  ];

  var legendText = {
    heading: t('72 小時路線圖例', '72 小时路线图例', '72-Hour Route Legend', 'Chú giải tuyến 72 giờ', 'Legenda Rute 72 Jam', '72時間ルート凡例', '72시간 경로 범례'),
    day1: t('Day 1 抵達與秋葉原', 'Day 1 抵达与秋叶原', 'Day 1 Arrival and Akihabara', 'Ngày 1 đến và Akihabara', 'Hari 1 tiba dan Akihabara', 'Day 1 到着と秋葉原', 'Day 1 도착과 아키하바라'),
    day2: t('Day 2 線香到霓虹主線', 'Day 2 线香到霓虹主线', 'Day 2 Incense-to-neon main route', 'Ngày 2 tuyến hương trầm đến neon', 'Hari 2 rute utama dupa ke neon', 'Day 2 香からネオンへの主線', 'Day 2 향에서 네온으로 가는 주 노선'),
    day3: t('Day 3 撤退線', 'Day 3 撤退线', 'Day 3 Departure route', 'Ngày 3 tuyến rời đi', 'Hari 3 rute pulang', 'Day 3 撤退線', 'Day 3 철수 노선'),
    shrine: t('神社標記', '神社标记', 'Shrine markers', 'Dấu đền thần', 'Penanda kuil Shinto', '神社マーカー', '신사 표식'),
    temple: t('寺院標記', '寺院标记', 'Temple markers', 'Dấu chùa', 'Penanda kuil Buddha', '寺院マーカー', '사찰 표식'),
    landmark: t('知名地標', '知名地标', 'Famous landmarks', 'Địa danh nổi tiếng', 'Landmark terkenal', '有名ランドマーク', '유명 랜드마크'),
    food: t('美食/市場', '美食/市场', 'Food and markets', 'Ẩm thực / chợ', 'Kuliner / pasar', '食・市場', '음식 / 시장'),
    macro: t('國土尺度東京座標', '国土尺度东京座标', 'Country-scale Tokyo anchor', 'Neo Tokyo ở quy mô toàn quốc', 'Jangkar Tokyo skala nasional', '国土スケール東京アンカー', '전국 규모 도쿄 앵커')
  };

  var mapHelpText = {
    scaleHint: t(
      '縮小到日本尺度時，金色菱形會標示東京；點擊即可回到行程視角。',
      'Zoom out to Japan scale: the gold diamond marks Tokyo. Click it to return to the itinerary view.',
      'Thu nhỏ đến quy mô Nhật Bản: hình thoi vàng đánh dấu Tokyo. Bấm để trở lại góc nhìn lịch trình.',
      'Perkecil ke skala Jepang: berlian emas menandai Tokyo. Klik untuk kembali ke tampilan rute.',
      '日本全体の縮尺まで引くと金色の菱形が東京を示します。クリックで旅程視点へ戻ります。',
      '일본 전체 규모로 축소하면 금색 마름모가 도쿄를 표시합니다. 클릭하면 일정 시점으로 돌아갑니다.'
    ),
    macroLabel: t('Tokyo', 'Tokyo', 'Tokyo', 'Tokyo', 'Tokyo', 'Tokyo', 'Tokyo'),
    macroTitle: t('回到東京 72 小時行程區', '回到东京 72 小时行程区', 'Return to the 72-hour Tokyo itinerary area', 'Trở lại khu lịch trình Tokyo 72 giờ', 'Kembali ke area rute Tokyo 72 jam', '72時間東京旅程エリアへ戻る', '72시간 도쿄 일정 구역으로 돌아가기'),
    macroTooltip: t('東京 72H 行程座標：點擊回到市區', '东京 72H 行程座标：点击回到市区', 'Tokyo 72H anchor: click to return to the city view', 'Neo Tokyo 72H: bấm để về góc nhìn đô thị', 'Jangkar Tokyo 72H: klik untuk kembali ke kota', '東京72Hアンカー：クリックで市街地へ戻る', '도쿄 72H 앵커: 클릭하면 시내 시점으로 돌아갑니다'),
    yamanote: t('JR 山手線參考環', 'JR 山手线参考环', 'JR Yamanote Line reference loop', 'Vòng tham chiếu JR Yamanote', 'Lingkar referensi JR Yamanote', 'JR山手線参照ループ', 'JR 야마노테선 기준 순환')
  };

  var yamanoteReference = [
    [35.7278, 139.7708],
    [35.7138, 139.7772],
    [35.6984, 139.7730],
    [35.6812, 139.7671],
    [35.6655, 139.7597],
    [35.6285, 139.7388],
    [35.6580, 139.7016],
    [35.6896, 139.7006],
    [35.7278, 139.7708]
  ];

  function getTypeColor(type) {
    return colors[type] || colors.landmark;
  }

  function markerIcon(loc, lang) {
    var color = getTypeColor(loc.type);
    var label = (markerLetters[lang] && markerLetters[lang][loc.type]) || markerLetters.en[loc.type] || 'L';

    return L.divIcon({
      html: '<div class="map-marker-pin map-marker-' + loc.type + '" style="--pin-color:' + color + '">' +
        '<span>' + label + '</span>' +
      '</div>',
      className: 'map-marker-shell',
      iconSize: [34, 42],
      iconAnchor: [17, 38],
      popupAnchor: [0, -34]
    });
  }

  function popupFor(loc, lang) {
    return '<div class="map-popup-card">' +
      '<div class="map-popup-card-body">' +
        '<div class="map-popup-title map-popup-' + loc.type + '">' +
          '<span class="map-popup-badge map-badge-' + loc.type + '">' + pick(typeLabels[loc.type], lang) + '</span>' +
          '<span>' + pick(loc.name, lang) + '</span>' +
        '</div>' +
        '<div class="map-popup-meta">' + pick(dayLabels[loc.dayKey], lang) + '</div>' +
        '<div class="map-popup-desc">' + pick(loc.summary, lang) + '</div>' +
      '</div>' +
    '</div>';
  }

  function renderMarkers(lang) {
    markerLayer.clearLayers();
    locations.forEach(function (loc) {
      L.marker(loc.coords, {
        icon: markerIcon(loc, lang),
        keyboard: true,
        title: pick(loc.name, lang)
      })
        .addTo(markerLayer)
        .bindPopup(popupFor(loc, lang), { className: 'map-custom-popup', offset: [0, -5] });
    });
  }

  function renderRoutes(lang) {
    routeLayer.clearLayers();

    itineraryRoutes.forEach(function (route) {
      // OSRM API 需要的座標格式是 經度,緯度 (lng,lat)，且用分號隔開
      var waypoints = route.points.map(function (id) {
        var c = locationById[id].coords;
        return c[1] + ',' + c[0]; 
      }).join(';');

      // 呼叫 OSRM 的 Driving (駕駛) 路徑規劃 API
      var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + waypoints + '?overview=full&geometries=geojson';

      fetch(osrmUrl)
        .then(function(response) { return response.json(); })
        .then(function(data) {
          if (data.routes && data.routes.length > 0) {
            var routeGeoJSON = data.routes[0].geometry;

            // 繪製底層白色描邊 (增加對比度與質感)
            L.geoJSON(routeGeoJSON, {
              style: {
                color: '#ffffff',
                weight: 10,
                opacity: 0.82,
                lineCap: 'round',
                lineJoin: 'round'
              }
            }).addTo(routeLayer);

            // 繪製上層彩色路線，並綁定 Tooltip
            L.geoJSON(routeGeoJSON, {
              style: {
                color: route.color,
                weight: 5,
                opacity: 0.95,
                dashArray: route.dashArray,
                lineCap: 'round',
                lineJoin: 'round'
              }
            })
              .bindTooltip(pick(route.labels, lang), { sticky: true })
              .addTo(routeLayer);
          } else {
            // 如果 OSRM 沒有回傳路線，作為備用方案退回畫直線
            drawStraightLinesFallback(route, lang);
          }
        })
        .catch(function(err) {
          console.error('無法取得真實道路路線，退回直線模式:', err);
          drawStraightLinesFallback(route, lang);
        });
    });

    // 備用的直線畫法 (Fallback)
    function drawStraightLinesFallback(route, lang) {
      var latLngs = route.points.map(function (id) {
        return locationById[id].coords;
      });

      L.polyline(latLngs, {
        color: '#ffffff', weight: 10, opacity: 0.82, lineCap: 'round', lineJoin: 'round'
      }).addTo(routeLayer);

      L.polyline(latLngs, {
        color: route.color, weight: 5, opacity: 0.95, dashArray: route.dashArray, lineCap: 'round', lineJoin: 'round'
      }).bindTooltip(pick(route.labels, lang), { sticky: true }).addTo(routeLayer);
    }

    // JR 山手線參考環保留原本的幾何虛線，因為它只是作為空間判讀的「參考邊界」
    L.polyline(yamanoteReference, {
      color: '#84CC16',
      weight: 2,
      opacity: 0.45,
      dashArray: '4, 8',
      lineCap: 'round'
    })
      .bindTooltip(pick(mapHelpText.yamanote, lang))
      .addTo(routeLayer);
  }

  function renderMacro(lang) {
    macroLayer.clearLayers();

    var macroIcon = L.divIcon({
      html: '<button class="tokyo-macro-diamond" type="button" aria-label="' + pick(mapHelpText.macroTitle, lang) + '">' +
        '<span>' + pick(mapHelpText.macroLabel, lang) + '</span>' +
      '</button>',
      className: 'tokyo-macro-shell',
      iconSize: [86, 86],
      iconAnchor: [43, 43]
    });

    L.marker(tokyoCenter, {
      icon: macroIcon,
      keyboard: true,
      title: pick(mapHelpText.macroTitle, lang)
    })
      .addTo(macroLayer)
      .bindTooltip(pick(mapHelpText.macroTooltip, lang), {
        direction: 'top',
        offset: [0, -26]
      })
      .on('click', returnToTokyo);
  }

  function updateLegend(lang) {
    if (!legendNode) return;

    legendNode.innerHTML =
      '<b class="map-legend-heading">' + pick(legendText.heading, lang) + '</b>' +
      '<div class="map-legend-item"><span class="map-legend-line" style="background:' + colors.day1 + '"></span>' + pick(legendText.day1, lang) + '</div>' +
      '<div class="map-legend-item"><span class="map-legend-line" style="background:' + colors.day2 + '"></span>' + pick(legendText.day2, lang) + '</div>' +
      '<div class="map-legend-item"><span class="map-legend-line map-legend-line-dash" style="background:' + colors.day3 + '"></span>' + pick(legendText.day3, lang) + '</div>' +
      '<div class="map-legend-item"><span class="map-legend-dot" style="background:' + colors.shrine + '"></span>' + pick(legendText.shrine, lang) + '</div>' +
      '<div class="map-legend-item"><span class="map-legend-dot" style="background:' + colors.temple + '"></span>' + pick(legendText.temple, lang) + '</div>' +
      '<div class="map-legend-item"><span class="map-legend-dot" style="background:' + colors.landmark + '"></span>' + pick(legendText.landmark, lang) + '</div>' +
      '<div class="map-legend-item"><span class="map-legend-dot" style="background:' + colors.food + '"></span>' + pick(legendText.food, lang) + '</div>' +
      '<div class="map-legend-item"><span class="map-legend-diamond"></span>' + pick(legendText.macro, lang) + '</div>';
  }

  function updateScaleHint(lang) {
    if (scaleHintNode) {
      scaleHintNode.innerHTML = pick(mapHelpText.scaleHint, lang);
    }
  }

  function syncMacroLayer() {
    var zoom = map.getZoom();

    if (zoom <= 7) {
      if (map.hasLayer(markerLayer)) map.removeLayer(markerLayer);
      if (map.hasLayer(routeLayer)) map.removeLayer(routeLayer);
      if (!map.hasLayer(macroLayer)) map.addLayer(macroLayer);
    } else {
      if (!map.hasLayer(markerLayer)) map.addLayer(markerLayer);
      if (!map.hasLayer(routeLayer)) map.addLayer(routeLayer);
      if (map.hasLayer(macroLayer)) map.removeLayer(macroLayer);
    }
  }

  function renderMapLanguage(lang) {
    renderMarkers(lang);
    renderRoutes(lang);
    renderMacro(lang);
    updateLegend(lang);
    updateScaleHint(lang);
    syncMacroLayer();
  }

  var legend = L.control({ position: 'topright' });
  legend.onAdd = function () {
    legendNode = L.DomUtil.create('div', 'map-legend');
    updateLegend(readMapLang());
    return legendNode;
  };
  legend.addTo(map);

  var scaleHint = L.control({ position: 'bottomleft' });
  scaleHint.onAdd = function () {
    scaleHintNode = L.DomUtil.create('div', 'map-scale-hint');
    updateScaleHint(readMapLang());
    return scaleHintNode;
  };
  scaleHint.addTo(map);

  renderMapLanguage(readMapLang());
  map.on('zoomend', syncMacroLayer);

  document.addEventListener('tokyo:language-change', function (event) {
    var nextLang = event.detail && event.detail.lang ? event.detail.lang : readMapLang();
    if (nextLang === 'zh-Hans') nextLang = 'zh-Hans';
    else if (nextLang.indexOf('zh') === 0) nextLang = 'zh-Hant';
    renderMapLanguage(nextLang);
  });
});
