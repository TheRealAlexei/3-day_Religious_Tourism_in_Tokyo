// ==========================================
// 72H Tokyo - Interactive Itinerary Map (Innovative Clean Version)
// Neon and incense route map for the 72-hour overview
// ==========================================

var tokyoCenter = [35.6950, 139.7550]; // 微調中心點讓畫面更平衡
var defaultZoom = 12;

function returnToTokyo() {
  if (!window._tokyoMap) return;
  window._tokyoMap.closePopup();
  window._tokyoMap.flyTo(tokyoCenter, defaultZoom, { animate: true, duration: 1.35 });
}

function t(zh, zhs, en, vi, id, ja, ko) {
  return { 'zh-Hant': zh, 'zh-Hans': zhs, en: en, vi: vi, id: id, ja: ja, ko: ko };
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
  setTimeout(function() {
    var mapEl = document.getElementById('tokyo-topology-map');
    if (!mapEl) {
      console.error('tokyo-topology-map element not found!');
      return;
    }
    
    if (typeof L === 'undefined') {
        console.error('Leaflet is not loaded!');
        return;
    }

    // 初始化地圖
    var map = L.map('tokyo-topology-map', {
      scrollWheelZoom: true,
      zoomControl: true,
      worldCopyJump: true
    }).setView(tokyoCenter, defaultZoom);
    window._tokyoMap = map;

    // ✨ 創新點 1：替換為極簡的 CartoDB Positron 底圖，大幅減少視覺雜訊
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    // ✨ 創新點 2：建立圖層群組，分離「主線」與「延伸地標」，降低雜亂感
    var routeLayer = L.layerGroup().addTo(map);
    var mainMarkerLayer = L.layerGroup().addTo(map);
    var optionalMarkerLayer = L.layerGroup(); // 預設不加入地圖，隱藏延伸地標
    var macroLayer = L.layerGroup();
    var legendNode = null;

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
      ja: { shrine: '社', temple: '寺', base: '拠', transit: '交', food: '食', landmark: '景' },
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

    // 濃縮與整理後的地理座標
    var locations = [
      { id: 'nrt', coords: [35.7719, 140.3929], type: 'transit', dayKey: 'day1day3', name: t('成田機場 NRT', '成田机场 NRT', 'Narita Airport NRT', 'NRT', 'NRT', '成田空港 NRT', '나리타 NRT'), summary: t('Skyliner 高速門戶。') },
      { id: 'nippori', coords: [35.7278, 139.7708], type: 'transit', dayKey: 'day1day3', name: t('日暮里站', '日暮里站', 'Nippori Sta.', 'Nippori', 'Nippori', '日暮里駅', '닛포리역'), summary: t('轉乘節點。') },
      { id: 'akiba', coords: [35.6984, 139.7730], type: 'base', dayKey: 'day13', name: t('秋葉原基地', '秋叶原基地', 'Akihabara Base', 'Akihabara', 'Akihabara', '秋葉原拠点', '아키하바라 거점'), summary: t('72 小時動線核心。') },
      { id: 'kanda', coords: [35.7017, 139.7679], type: 'shrine', dayKey: 'day1', name: t('神田明神', '神田明神', 'Kanda Myojin', 'Kanda Myojin', 'Kanda Myojin', '神田明神', '간다묘진'), summary: t('動漫與傳統信仰並置。') },
      { id: 'sensoji', coords: [35.7148, 139.7967], type: 'temple', dayKey: 'day2am', name: t('淺草寺・雷門', '浅草寺・雷门', 'Senso-ji Temple', 'Senso-ji', 'Senso-ji', '浅草寺・雷門', '센소지'), summary: t('東京最具代表性的古寺。') },
      { id: 'asakusa-shrine', coords: [35.7155, 139.7974], type: 'shrine', dayKey: 'day2am', name: t('淺草神社', '浅草神社', 'Asakusa Shrine', 'Asakusa Shrine', 'Asakusa Shrine', '浅草神社', '아사쿠사 신사'), summary: t('神佛習合主題。') },
      { id: 'skytree', coords: [35.7101, 139.8107], type: 'landmark', dayKey: 'optional', name: t('東京晴空塔', '东京晴空塔', 'Tokyo Skytree', 'Tokyo Skytree', 'Tokyo Skytree', '東京スカイツリー', '스카이트리'), summary: t('東東京天際線。') },
      { id: 'ueno', coords: [35.7156, 139.7732], type: 'landmark', dayKey: 'day2noon', name: t('上野公園', '上野公园', 'Ueno Park', 'Ueno Park', 'Ueno Park', '上野公園', '우에노 공원'), summary: t('文化與庶民的交會點。') },
      { id: 'ueno-toshogu', coords: [35.7151, 139.7707], type: 'shrine', dayKey: 'day2noon', name: t('上野東照宮', '上野东照宮', 'Ueno Toshogu', 'Ueno Toshogu', 'Ueno Toshogu', '上野東照宮', '우에노 도쇼구'), summary: t('金色社殿。') },
      { id: 'ameyoko', coords: [35.7101, 139.7744], type: 'food', dayKey: 'day2noon', name: t('阿美橫丁', '阿美横丁', 'Ameyoko Market', 'Ameyoko', 'Ameyoko', 'アメ横', '아메요코'), summary: t('海鮮丼與街頭補給。') },
      { id: 'meiji', coords: [35.6764, 139.6993], type: 'shrine', dayKey: 'day2pm', name: t('明治神宮', '明治神宮', 'Meiji Jingu', 'Meiji Jingu', 'Meiji Jingu', '明治神宮', '메이지 신궁'), summary: t('原宿旁的鎮守之森。') },
      { id: 'harajuku', coords: [35.6702, 139.7027], type: 'landmark', dayKey: 'day2pm', name: t('原宿', '原宿', 'Harajuku', 'Harajuku', 'Harajuku', '原宿', '하라주쿠'), summary: t('文化緩衝帶。') },
      { id: 'takeshita', coords: [35.6717, 139.7020], type: 'landmark', dayKey: 'day2pm', name: t('竹下通', '竹下通', 'Takeshita St.', 'Takeshita', 'Takeshita', '竹下通り', '다케시타 거리'), summary: t('山手潮流入口。') },
      { id: 'shibuya', coords: [35.6595, 139.7005], type: 'landmark', dayKey: 'day2eve', name: t('澀谷十字路口', '涩谷十字路口', 'Shibuya Crossing', 'Shibuya', 'Shibuya', '渋谷交差点', '시부야'), summary: t('現代東京的霓虹心臟。') },
      { id: 'shinjuku', coords: [35.6950, 139.7036], type: 'landmark', dayKey: 'day2night', name: t('新宿歌舞伎町', '新宿歌舞伎町', 'Shinjuku Kabukicho', 'Shinjuku', 'Shinjuku', '新宿歌舞伎町', '신주쿠'), summary: t('不夜城與霓虹高峰。') },
      { id: 'tokyo-tower', coords: [35.6586, 139.7454], type: 'landmark', dayKey: 'optional', name: t('東京鐵塔', '东京鐵塔', 'Tokyo Tower', 'Tokyo Tower', 'Tokyo Tower', '東京タワー', '도쿄타워'), summary: t('昭和東京的紅白天際線。') }
    ];

    var locationById = {};
    locations.forEach(function (loc) { locationById[loc.id] = loc; });

    var itineraryRoutes = [
      {
        labels: t('Day 1 抵達線', 'Day 1 抵达线', 'Day 1 Arrival', 'Day 1', 'Day 1', 'Day 1 到着線', 'Day 1 도착선'),
        color: colors.day1, dashArray: null, points: ['nrt', 'nippori', 'akiba', 'kanda']
      },
      {
        labels: t('Day 2 線香到霓虹', 'Day 2 线香到霓虹', 'Day 2 Route', 'Day 2', 'Day 2', 'Day 2 主線', 'Day 2 주 노선'),
        color: colors.day2, dashArray: null, points: ['akiba', 'sensoji', 'asakusa-shrine', 'ueno', 'ueno-toshogu', 'ameyoko', 'meiji', 'harajuku', 'shibuya', 'shinjuku']
      },
      {
        labels: t('Day 3 撤退線', 'Day 3 撤退线', 'Day 3 Departure', 'Day 3', 'Day 3', 'Day 3 撤退線', 'Day 3 철수선'),
        color: colors.day3, dashArray: '8, 8', points: ['akiba', 'ueno', 'nippori', 'nrt']
      }
    ];

    function getTypeColor(type) { return colors[type] || colors.landmark; }

    // ✨ 創新點 3：寫死 Inline CSS 的精緻圓點標記，解決樣式丟失與畫面雜亂問題
    function markerIcon(loc, lang) {
      var color = getTypeColor(loc.type);
      var label = (markerLetters[lang] && markerLetters[lang][loc.type]) || markerLetters['zh-Hant'][loc.type] || 'L';
      
      // 判斷是否為主線行程，延伸地標稍微縮小並降低透明度
      var isOptional = loc.dayKey === 'optional' || loc.dayKey === 'anchor';
      var size = isOptional ? 22 : 28;
      var opacity = isOptional ? 0.85 : 1;
      var border = isOptional ? 1 : 2;

      var html = '<div style="' +
        'background-color:' + color + ';' +
        'color:#ffffff;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'border-radius:50%;' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:center;' +
        'font-size:' + (isOptional ? 10 : 13) + 'px;' +
        'font-weight:bold;' +
        'font-family:sans-serif;' +
        'border:' + border + 'px solid #ffffff;' +
        'box-shadow:0 3px 8px rgba(0,0,0,0.25);' +
        'opacity:' + opacity + ';' +
        '">' + label + '</div>';

      return L.divIcon({
        html: html,
        className: 'custom-bullet-icon',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
      });
    }

    function popupFor(loc, lang) {
      return '<div style="font-family:sans-serif; padding:4px;">' +
        '<strong style="display:block; font-size:14px; color:#333; margin-bottom:4px;">' + pick(loc.name, lang) + '</strong>' +
        '<span style="font-size:12px; color:#666;">' + pick(loc.summary, lang) + '</span>' +
      '</div>';
    }

    function renderMarkers(lang) {
      mainMarkerLayer.clearLayers();
      optionalMarkerLayer.clearLayers();

      locations.forEach(function (loc) {
        var marker = L.marker(loc.coords, {
          icon: markerIcon(loc, lang),
          title: pick(loc.name, lang)
        }).bindPopup(popupFor(loc, lang));

        // 根據屬性分類到不同圖層
        if (loc.dayKey === 'optional' || loc.dayKey === 'anchor') {
          marker.addTo(optionalMarkerLayer);
        } else {
          marker.addTo(mainMarkerLayer);
        }
      });
    }

    // ✨ 創新點 4：優化路線樣式，移除刺眼的白色粗框，改用優雅的半透明細線
    function renderRoutes(lang) {
      routeLayer.clearLayers();

      itineraryRoutes.forEach(function (route) {
        var waypoints = route.points.map(function (id) {
          var c = locationById[id].coords;
          return c[1] + ',' + c[0]; 
        }).join(';');

        var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + waypoints + '?overview=full&geometries=geojson';

        fetch(osrmUrl)
          .then(function(res) { return res.json(); })
          .then(function(data) {
            if (data.routes && data.routes.length > 0) {
              var routeGeoJSON = data.routes[0].geometry;
              // 繪製細緻的主線條
              L.geoJSON(routeGeoJSON, {
                style: {
                  color: route.color,
                  weight: 4,          // 變細
                  opacity: 0.85,      // 稍微透明，透出底圖
                  dashArray: route.dashArray,
                  lineCap: 'round',
                  lineJoin: 'round'
                }
              }).bindTooltip(pick(route.labels, lang), { sticky: true }).addTo(routeLayer);
            } else {
              drawStraightLinesFallback(route, lang);
            }
          })
          .catch(function(err) {
            drawStraightLinesFallback(route, lang);
          });
      });

      function drawStraightLinesFallback(route, lang) {
        var latLngs = route.points.map(function (id) { return locationById[id].coords; });
        L.polyline(latLngs, {
          color: route.color, weight: 4, opacity: 0.85, dashArray: route.dashArray, lineCap: 'round', lineJoin: 'round'
        }).bindTooltip(pick(route.labels, lang), { sticky: true }).addTo(routeLayer);
      }
    }

    // ✨ 創新點 5：絕對不會壞掉的防禦性圖例設計 (完全依賴 Inline CSS)
    function updateLegend(lang) {
      if (!legendNode) return;
      var heading = pick({ 'zh-Hant': '72 小時路線圖例', 'zh-Hans': '72 小时路线图例', en: 'Map Legend' }, lang);
      
      // 加入了背景色、毛玻璃、圓角與陰影，無視外部 CSS 損壞
      legendNode.innerHTML =
        '<div style="background:rgba(255,255,255,0.95); backdrop-filter:blur(8px); border:1px solid #ddd; border-radius:12px; padding:16px; box-shadow:0 4px 16px rgba(0,0,0,0.1); font-family:sans-serif; font-size:13px; color:#333; min-width:160px; pointer-events:auto;">' +
          '<b style="display:block; margin-bottom:12px; font-size:14px;">' + heading + '</b>' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
            '<span style="width:20px; height:4px; border-radius:2px; background:' + colors.day1 + ';"></span> Day 1' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
            '<span style="width:20px; height:4px; border-radius:2px; background:' + colors.day2 + ';"></span> Day 2' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
            '<span style="width:20px; height:2px; border-top:3px dashed ' + colors.day3 + ';"></span> Day 3' +
          '</div>' +
        '</div>';
    }

    var legend = L.control({ position: 'bottomright' }); // 移到右下角避免擋住圖層控制器
    legend.onAdd = function () {
      legendNode = L.DomUtil.create('div');
      L.DomEvent.disableClickPropagation(legendNode);
      updateLegend(readMapLang());
      return legendNode;
    };
    legend.addTo(map);

    // ✨ 創新點 6：加入官方圖層控制器 (Layer Control) 讓使用者自由切換雜亂程度
    var baseMaps = {};
    var overlayMaps = {};
    
    // 根據語言設定圖層控制器的名稱
    var currentLang = readMapLang();
    var mainRouteLabel = currentLang === 'zh-Hant' ? "📍 72H 主線行程" : "📍 Main Route";
    var optionalLabel = currentLang === 'zh-Hant' ? "🗺️ 延伸地標 (展開)" : "🗺️ Optional Spots";
    
    overlayMaps[mainRouteLabel] = mainMarkerLayer;
    overlayMaps[optionalLabel] = optionalMarkerLayer;

    // 將圖層控制器加到右上角
    L.control.layers(baseMaps, overlayMaps, { collapsed: false, position: 'topright' }).addTo(map);

    // 初次渲染
    renderMapLanguage(readMapLang());

    function renderMapLanguage(lang) {
      renderMarkers(lang);
      renderRoutes(lang);
      updateLegend(lang);
    }

    document.addEventListener('tokyo:language-change', function (event) {
      var nextLang = event.detail && event.detail.lang ? event.detail.lang : readMapLang();
      if (nextLang === 'zh-Hans') nextLang = 'zh-Hans';
      else if (nextLang.indexOf('zh') === 0) nextLang = 'zh-Hant';
      renderMapLanguage(nextLang);
    });

  }, 200);
});
